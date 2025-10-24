import db from "../config/db.js";

export const getTransactions = (req, res) => {
  const sql = `
    SELECT
      t.id AS transaction_id,
      m.item_name,
      ti.quantity,
      ti.price,
      t.order_type,
      t.payment_method,
      t.total_payment,
      t.cashier_name,
      t.order_date
    FROM transactions t
    JOIN transaction_items ti ON t.id = ti.transaction_id
    JOIN menu m ON ti.menu_id = m.id
    ORDER BY t.order_date DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.log("Error fetching transactions:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(result);
  });
};

export const addTransactions = (req, res) => {
  const { cart, payment_method, total_payment, cashier_name, order_type, user_id } = req.body;

  if (!cart || cart.length === 0) return res.status(400).json({ error: "Cart is empty" });

  if (!user_id || !cashier_name) return res.status(400).json({ error: "User not logged in" });

  console.log("Received transaction data:", req.body);

  const sqlTransaction = `
    INSERT INTO transactions (order_type, payment_method, total_payment, cashier_name, user_id)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sqlTransaction, [order_type, payment_method, total_payment, cashier_name, user_id], (err, result) => {
    if (err) {
      console.error("Error inserting transaction:", err);
      return res.status(500).json({ error: "Database error: " + err.message });
    }

    const transactionId = result.insertId;

    const sqlItems = `
      INSERT INTO transaction_items (transaction_id, menu_id, quantity, price)
      VALUES ?
    `;

    const values = cart.map(item => [transactionId, item.id, item.quantity, item.price]);

    db.query(sqlItems, [values], (err2) => {
      if (err2) {
        console.error("Error inserting transaction items:", err2);
        return res.status(500).json({ error: "Database error: " + err2.message });
      }

      res.json({ message: "Transaction saved successfully", transactionId });
    });
  });
}; 


export const getTotalSales = (req, res) => {
  const sql = "SELECT SUM(total_payment) AS total_sales FROM transactions"; 
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching total sales:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(result[0]);
  });
};

// Dashboard metrics endpoint with period filters
export const getDashboardMetrics = (req, res) => {
  const { period = "weekly" } = req.query;

  const now = new Date();

  function formatDateOnly(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  function endOfDay(date) {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
  }

  function startOfDay(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function monthLabel(date) {
    return date.toLocaleString("en-US", { month: "short", year: "2-digit" });
  }

  // Determine time window and grouping
  let startDate; // JS Date
  let groupBy = "day"; // or "month"

  if (period === "yearly") {
    const startMonth = new Date(now.getFullYear(), now.getMonth() - 11, 1);
    startDate = startOfDay(startMonth);
    groupBy = "month";
  } else if (period === "monthly") {
    const d = new Date(now);
    d.setDate(d.getDate() - 29);
    startDate = startOfDay(d);
    groupBy = "day";
  } else {
    // weekly (default): last 7 days including today
    const d = new Date(now);
    d.setDate(d.getDate() - 6);
    startDate = startOfDay(d);
    groupBy = "day";
  }

  const startStr = `${formatDateOnly(startDate)} 00:00:00`;
  const endStr = `${formatDateOnly(endOfDay(now))} 23:59:59`;

  // Queries
  const totalsSql = `
    SELECT 
      COALESCE(SUM(t.total_payment), 0) AS totalSales,
      COUNT(*) AS ordersCount
    FROM transactions t
    WHERE t.order_date BETWEEN ? AND ?
  `;

  const paymentSql = `
    SELECT LOWER(t.payment_method) AS method, COALESCE(SUM(t.total_payment), 0) AS total
    FROM transactions t
    WHERE t.order_date BETWEEN ? AND ?
    GROUP BY LOWER(t.payment_method)
  `;

  const orderTypeSql = `
    SELECT LOWER(t.order_type) AS type, COUNT(*) AS count
    FROM transactions t
    WHERE t.order_date BETWEEN ? AND ?
    GROUP BY LOWER(t.order_type)
  `;

  const seriesSqlDay = `
    SELECT DATE(t.order_date) AS bucket, COALESCE(SUM(t.total_payment), 0) AS total
    FROM transactions t
    WHERE t.order_date BETWEEN ? AND ?
    GROUP BY DATE(t.order_date)
    ORDER BY DATE(t.order_date)
  `;

  const seriesSqlMonth = `
    SELECT DATE_FORMAT(t.order_date, '%Y-%m-01') AS bucket, COALESCE(SUM(t.total_payment), 0) AS total
    FROM transactions t
    WHERE t.order_date BETWEEN ? AND ?
    GROUP BY YEAR(t.order_date), MONTH(t.order_date)
    ORDER BY YEAR(t.order_date), MONTH(t.order_date)
  `;

  const categorySql = `
    SELECT COALESCE(m.category, 'Uncategorized') AS category,
           COALESCE(SUM(ti.quantity * ti.price), 0) AS total
    FROM transactions t
    JOIN transaction_items ti ON t.id = ti.transaction_id
    JOIN menu m ON ti.menu_id = m.id
    WHERE t.order_date BETWEEN ? AND ?
    GROUP BY m.category
    ORDER BY total DESC
  `;

  db.query(totalsSql, [startStr, endStr], (err, totalsRows) => {
    if (err) {
      console.error("Dashboard totals error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    db.query(paymentSql, [startStr, endStr], (err2, paymentRows) => {
      if (err2) {
        console.error("Dashboard payment breakdown error:", err2);
        return res.status(500).json({ error: "Database error" });
      }

      db.query(orderTypeSql, [startStr, endStr], (err3, orderTypeRows) => {
        if (err3) {
          console.error("Dashboard order type error:", err3);
          return res.status(500).json({ error: "Database error" });
        }

        const seriesSql = groupBy === "month" ? seriesSqlMonth : seriesSqlDay;
        db.query(seriesSql, [startStr, endStr], (err4, seriesRows) => {
          if (err4) {
            console.error("Dashboard series error:", err4);
            return res.status(500).json({ error: "Database error" });
          }

          db.query(categorySql, [startStr, endStr], (err5, categoryRows) => {
            if (err5) {
              console.error("Dashboard category error:", err5);
              return res.status(500).json({ error: "Database error" });
            }

            // Build payment breakdown
            let cash = 0;
            let gcash = 0;
            for (const r of paymentRows) {
              const method = (r.method || "").toLowerCase();
              if (method.includes("gcash")) gcash += Number(r.total) || 0;
              else if (method.includes("cash")) cash += Number(r.total) || 0;
            }

            // Build order breakdown
            let dine_in = 0;
            let takeout = 0;
            for (const r of orderTypeRows) {
              const type = (r.type || "").toLowerCase();
              if (type.includes("dine")) dine_in += Number(r.count) || 0;
              else if (type.includes("take")) takeout += Number(r.count) || 0;
            }

            // Build time buckets with zeros
            const buckets = new Map();
            for (const r of seriesRows) {
              buckets.set(String(r.bucket), Number(r.total) || 0);
            }

            const barSeries = [["Period", "Sales"]];
            if (groupBy === "month") {
              // last 12 months
              const cursor = new Date(now.getFullYear(), now.getMonth() - 11, 1);
              for (let i = 0; i < 12; i++) {
                const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-01`;
                const label = monthLabel(cursor);
                const val = buckets.get(key) || 0;
                barSeries.push([label, val]);
                cursor.setMonth(cursor.getMonth() + 1);
              }
            } else {
              // day buckets from startDate to now
              const cursor = new Date(startDate);
              while (cursor <= now) {
                const key = formatDateOnly(cursor);
                const label = cursor.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" });
                const val = buckets.get(key) || 0;
                barSeries.push([label, val]);
                cursor.setDate(cursor.getDate() + 1);
              }
            }

            // Build category pie series
            const pieSeries = [["Category", "Sales"]];
            for (const r of categoryRows) {
              const cat = r.category || "Uncategorized";
              const total = Number(r.total) || 0;
              if (total > 0) pieSeries.push([cat, total]);
            }

            const totals = totalsRows && totalsRows[0] ? totalsRows[0] : { totalSales: 0, ordersCount: 0 };
            const response = {
              totalSales: Number(totals.totalSales) || 0,
              ordersCount: Number(totals.ordersCount) || 0,
              paymentBreakdown: { cash, gcash },
              orderBreakdown: { dine_in, takeout },
              barSeries,
              pieSeries,
            };

            return res.json(response);
          });
        });
      });
    });
  });
};