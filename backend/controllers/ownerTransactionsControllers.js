import db from "../config/db.js";

export const getTransactions = (req, res) => {
  const { date, page = 1, limit = 10 } = req.query;

  const offset = (page - 1) * limit;

  let sql = `
    SELECT
      t.id AS transaction_id,
      m.item_name,
      ti.quantity,
      ti.price,
      t.order_type,
      t.payment_method,
      t.total_payment,
      t.cashier_name,
      DATE_FORMAT(t.order_date, '%Y-%m-%d') AS order_date
    FROM transactions t
    JOIN transaction_items ti ON t.id = ti.transaction_id
    JOIN menu m ON ti.menu_id = m.id
  `;

  let whereClause = "";

  if (date) {
    whereClause = `WHERE DATE(t.order_date) = ?`;
  }

  const finalSQL = `
    ${sql} 
    ${whereClause}
    ORDER BY t.order_date DESC
    LIMIT ? OFFSET ?
  `;

  const params = date
    ? [date, Number(limit), Number(offset)]
    : [Number(limit), Number(offset)];

  db.query(finalSQL, params, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json(result);
  });
};

export const addTransactions = (req, res) => {
  const {
    cart,
    payment_method,
    total_payment,
    cashier_name,
    order_type,
    user_id,
  } = req.body;

  if (!cart || cart.length === 0)
    return res.status(400).json({ error: "Cart is empty" });

  if (!user_id || !cashier_name)
    return res.status(400).json({ error: "User not logged in" });

  console.log("Received transaction data:", req.body);

  const sqlTransaction = `
    INSERT INTO transactions (order_type, payment_method, total_payment, cashier_name, user_id)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sqlTransaction,
    [order_type, payment_method, total_payment, cashier_name, user_id],
    (err, result) => {
      if (err) {
        console.error("Error inserting transaction:", err);
        return res
          .status(500)
          .json({ error: "Database error: " + err.message });
      }

      const transactionId = result.insertId;

      const sqlItems = `
      INSERT INTO transaction_items (transaction_id, menu_id, quantity, price)
      VALUES ?
    `;

      const values = cart.map((item) => [
        transactionId,
        item.id,
        item.quantity,
        item.price,
      ]);

      db.query(sqlItems, [values], (err2) => {
        if (err2) {
          console.error("Error inserting transaction items:", err2);
          return res
            .status(500)
            .json({ error: "Database error: " + err2.message });
        }

        res.json({ message: "Transaction saved successfully", transactionId });
      });
    }
  );
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

export const getTotalSalesBreakdown = (req, res) => {
  const sql = `
    SELECT 
      SUM(total_payment) AS total_sales,
      SUM(CASE WHEN payment_method = 'Cash' THEN total_payment ELSE 0 END) AS cash_sales,
      SUM(CASE WHEN payment_method = 'GCash' THEN total_payment ELSE 0 END) AS gcash_sales
    FROM transactions
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(result[0]);
  });
};

export const getOrdersSummary = (req, res) => {
  const sql = `
    SELECT 
      COUNT(*) AS total_orders,
      SUM(
        CASE 
          WHEN LOWER(REPLACE(order_type, '-', '')) IN ('dinein', 'dine in') THEN 1 
          ELSE 0 
        END
      ) AS dine_in,
      SUM(
        CASE 
          WHEN LOWER(REPLACE(order_type, '-', '')) IN ('takeout', 'take out') THEN 1 
          ELSE 0 
        END
      ) AS takeout
    FROM transactions
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Orders summary error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    const data = result[0] || { total_orders: 0, dine_in: 0, takeout: 0 };
    res.json({
      total_orders: parseInt(data.total_orders) || 0,
      dine_in: parseInt(data.dine_in) || 0,
      takeout: parseInt(data.takeout) || 0,
    });
  });
};

export const getSalesChart = (req, res) => {
  const { period } = req.query;
  let groupBy = "";
  let labelExpr = "";
  let orderBy = "";

  if (period === "weekly") {
    groupBy = "WEEK(order_date)";
    labelExpr = "CONCAT('Week ', WEEK(order_date))";
    orderBy = "WEEK(order_date)";
  } else if (period === "monthly") {
    groupBy = "MONTH(order_date)";
    labelExpr = "MONTHNAME(order_date)";
    orderBy = "MONTH(order_date)";
  } else {
    groupBy = "YEAR(order_date)";
    labelExpr = "CONCAT('Year ', YEAR(order_date))";
    orderBy = "YEAR(order_date)";
  }

  const sql = `
    SELECT ${labelExpr} AS period, SUM(total_payment) AS sales
    FROM transactions
    WHERE order_date IS NOT NULL
    GROUP BY ${groupBy}
    ORDER BY ${orderBy}
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Sales chart error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (!result.length) {
      return res.json([["Period", "Sales", { role: "style" }]]);
    }

    const data = [
      ["Period", "Sales", { role: "style" }],
      ...result.map((row) => [row.period, Number(row.sales) || 0, "#8b5cf6"]),
    ];

    res.json(data);
  });
};

export const getCashierLogins = (req, res) => {
  const { date } = req.query;

  let sql = `
    SELECT 
      u.first_name, 
      DATE_FORMAT(c.login_time, '%Y-%m-%d %H:%i:%s') AS login_time
    FROM cashier_logins c
    JOIN users u ON c.user_id = u.id
  `;

  const params = [];

  if (date) {
    sql += " WHERE DATE(c.login_time) = ?";
    params.push(date);
  }

  sql += " ORDER BY c.login_time DESC";

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error("Error fetching cashier logins:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(result);
  });
};

