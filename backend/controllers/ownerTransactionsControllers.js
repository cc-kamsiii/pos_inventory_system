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