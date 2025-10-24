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

// Returns analytics for dashboard by range (weekly, monthly, yearly)
// Response shape:
// {
//   range,
//   totals: { total_sales, orders_count },
//   payments: { cash: { total_sales, orders_count }, gcash: { total_sales, orders_count }, other: { total_sales, orders_count } },
//   orderTypes: { dine_in, takeout, other },
//   bar: [ { period, label, total_sales } ]
// }
export const getAnalytics = (req, res) => {
  const rangeRaw = (req.query.range || "monthly").toString().toLowerCase();
  const range = ["weekly", "monthly", "yearly"].includes(rangeRaw)
    ? rangeRaw
    : "monthly";

  let startCondition;
  let groupSelect;
  let orderBy;

  if (range === "weekly") {
    startCondition = "DATE(t.order_date) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)";
    groupSelect = "DATE(t.order_date) AS period";
    orderBy = "DATE(t.order_date)";
  } else if (range === "yearly") {
    startCondition = "DATE(t.order_date) >= DATE_SUB(CURDATE(), INTERVAL 5 YEAR)";
    groupSelect = "YEAR(t.order_date) AS period";
    orderBy = "YEAR(t.order_date)";
  } else {
    // monthly: last 12 months
    startCondition = "DATE(t.order_date) >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)";
    groupSelect = "DATE_FORMAT(t.order_date, '%Y-%m') AS period";
    orderBy = "period";
  }

  const totalsSql = `
    SELECT COALESCE(SUM(total_payment), 0) AS total_sales,
           COUNT(*) AS orders_count
    FROM transactions t
    WHERE ${startCondition}
  `;

  const paymentsSql = `
    SELECT LOWER(t.payment_method) AS method,
           COALESCE(SUM(t.total_payment), 0) AS total_sales,
           COUNT(*) AS orders_count
    FROM transactions t
    WHERE ${startCondition}
    GROUP BY LOWER(t.payment_method)
  `;

  const orderTypeSql = `
    SELECT LOWER(t.order_type) AS type,
           COUNT(*) AS count
    FROM transactions t
    WHERE ${startCondition}
    GROUP BY LOWER(t.order_type)
  `;

  const barSql = `
    SELECT ${groupSelect},
           COALESCE(SUM(t.total_payment), 0) AS total_sales
    FROM transactions t
    WHERE ${startCondition}
    GROUP BY ${groupSelect}
    ORDER BY ${orderBy}
  `;

  // Execute queries in sequence and compose response
  db.query(totalsSql, (errTotals, totalsRows) => {
    if (errTotals) {
      console.error("Error fetching totals:", errTotals);
      return res.status(500).json({ error: "Database error" });
    }

    db.query(paymentsSql, (errPay, payRows) => {
      if (errPay) {
        console.error("Error fetching payments:", errPay);
        return res.status(500).json({ error: "Database error" });
      }

      db.query(orderTypeSql, (errType, typeRows) => {
        if (errType) {
          console.error("Error fetching order types:", errType);
          return res.status(500).json({ error: "Database error" });
        }

        db.query(barSql, (errBar, barRows) => {
          if (errBar) {
            console.error("Error fetching bar series:", errBar);
            return res.status(500).json({ error: "Database error" });
          }

          const totals = totalsRows && totalsRows[0]
            ? {
                total_sales: Number(totalsRows[0].total_sales || 0),
                orders_count: Number(totalsRows[0].orders_count || 0),
              }
            : { total_sales: 0, orders_count: 0 };

          const paymentsAgg = { cash: { total_sales: 0, orders_count: 0 }, gcash: { total_sales: 0, orders_count: 0 }, other: { total_sales: 0, orders_count: 0 } };
          for (const r of payRows || []) {
            const method = (r.method || "").toLowerCase();
            const entry = { total_sales: Number(r.total_sales || 0), orders_count: Number(r.orders_count || 0) };
            if (method.includes("cash") && !method.includes("g")) {
              paymentsAgg.cash.total_sales += entry.total_sales;
              paymentsAgg.cash.orders_count += entry.orders_count;
            } else if (method.includes("gcash") || method.includes("g-cash") || method.includes("g cash")) {
              paymentsAgg.gcash.total_sales += entry.total_sales;
              paymentsAgg.gcash.orders_count += entry.orders_count;
            } else {
              paymentsAgg.other.total_sales += entry.total_sales;
              paymentsAgg.other.orders_count += entry.orders_count;
            }
          }

          const orderTypesAgg = { dine_in: 0, takeout: 0, other: 0 };
          for (const r of typeRows || []) {
            const type = (r.type || "").toLowerCase();
            const count = Number(r.count || 0);
            if (type.startsWith("dine")) {
              orderTypesAgg.dine_in += count;
            } else if (type.startsWith("take")) {
              orderTypesAgg.takeout += count;
            } else {
              orderTypesAgg.other += count;
            }
          }

          // Label formatting for bar series
          const bar = (barRows || []).map((r) => {
            let label = String(r.period);
            if (range === "weekly") {
              // r.period is a Date or string date; format to 'Mon'
              const dt = new Date(r.period);
              if (!isNaN(dt)) {
                label = dt.toLocaleDateString("en-US", { weekday: "short" });
              }
            } else if (range === "monthly") {
              // Expect 'YYYY-MM' -> label as 'Mon YYYY'
              const [y, m] = String(r.period).split("-");
              if (y && m) {
                const dt = new Date(Number(y), Number(m) - 1, 1);
                label = dt.toLocaleDateString("en-US", { month: "short", year: "numeric" });
              }
            } else if (range === "yearly") {
              label = String(r.period);
            }
            return { period: r.period, label, total_sales: Number(r.total_sales || 0) };
          });

          return res.json({
            range,
            totals,
            payments: paymentsAgg,
            orderTypes: orderTypesAgg,
            bar,
          });
        });
      });
    });
  });
};