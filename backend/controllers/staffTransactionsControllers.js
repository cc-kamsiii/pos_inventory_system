import db from "../config/db.js";

export const getTransactions = (req, res) => {
  const { date, cashier_name } = req.query;
  
  let sql = `
    SELECT 
      t.id AS transaction_id,
      t.id AS order_id,
      COALESCE(m.item_name, ti.item_name) AS item_name,
      ti.quantity,
      ti.price,
      t.order_type,
      t.payment_method,
      t.total_payment,
      t.payment_amount,
      t.change_amount,
      t.cashier_name,
      t.order_date
    FROM transactions t
    JOIN transaction_items ti ON t.id = ti.transaction_id
    LEFT JOIN menu m ON ti.menu_id = m.id
  `;

  let whereClause = date 
    ? `WHERE DATE(t.order_date) = ?` 
    : `WHERE DATE(t.order_date) = CURDATE()`;
  
  const params = [];
  
  if (date) {
    params.push(date);
  }

  if (cashier_name) {
    whereClause += ` AND t.cashier_name = ?`;
    params.push(cashier_name);
  }

  sql += ` ${whereClause} ORDER BY t.order_date DESC`;

  db.query(sql, params, (err, result) => {
    if (err) {
      console.log("Error fetching transactions:", err);
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
    payment_amount,
    change_amount,
    cashier_name, 
    order_type, 
    user_id 
  } = req.body;

  if (!cart || cart.length === 0)
    return res.status(400).json({ error: "Cart is empty" });
  if (!user_id || !cashier_name)
    return res.status(400).json({ error: "User not logged in" });

  console.log("Received transaction data:", req.body);

  db.beginTransaction((err) => {
    if (err) return res.status(500).json({ error: "Transaction start failed" });

    const sqlTransaction = `
      INSERT INTO transactions (
        order_type, 
        payment_method, 
        total_payment, 
        payment_amount,
        change_amount,
        cashier_name, 
        user_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sqlTransaction, 
      [order_type, payment_method, total_payment, payment_amount, change_amount, cashier_name, user_id], 
      (err, result) => {
        if (err) {
          db.rollback(() => {});
          console.error("Error inserting transaction:", err);
          return res.status(500).json({ error: "Database error: " + err.message });
        }

        const transactionId = result.insertId;

        const sqlItems = `
          INSERT INTO transaction_items (transaction_id, menu_id, item_name, quantity, price)
          VALUES ?
        `;
        const values = cart.map((item) => [
          transactionId, 
          item.id, 
          item.item_name,  
          item.quantity, 
          item.price
        ]);

        db.query(sqlItems, [values], async (err2) => {
          if (err2) {
            db.rollback(() => {});
            console.error("Error inserting transaction items:", err2);
            return res.status(500).json({ error: "Database error: " + err2.message });
          }

          try {
            for (const item of cart) {
              const [recipeRows] = await new Promise((resolve, reject) => {
                db.query(
                  "SELECT ingredient_id, amount_per_serving FROM recipe_ingredients WHERE menu_id = ?",
                  [item.id],
                  (err, rows) => {
                    if (err) reject(err);
                    else resolve([rows]);
                  }
                );
              });

              if (recipeRows.length > 0) {
                for (const r of recipeRows) {
                  const totalNeeded = r.amount_per_serving * item.quantity;

                  const [invRows] = await new Promise((resolve, reject) => {
                    db.query(
                      "SELECT id, quantity, item, unit FROM inventory WHERE id = ?",
                      [r.ingredient_id],
                      (err, rows) => {
                        if (err) reject(err);
                        else resolve([rows]);
                      }
                    );
                  });

                  if (invRows.length === 0) continue;

                  const inv = invRows[0];
                  const newQuantity = inv.quantity - totalNeeded;

                  if (newQuantity < 0) {
                    db.rollback(() => {});
                    return res.status(400).json({
                      error: `Not enough stock for ingredient ${inv.item}`,
                    });
                  }

                  await new Promise((resolve, reject) => {
                    db.query(
                      "UPDATE inventory SET quantity = ?, last_update = NOW() WHERE id = ?",
                      [newQuantity, inv.id],
                      (err) => (err ? reject(err) : resolve())
                    );
                  });
                }
              } else {
                const [invRows] = await new Promise((resolve, reject) => {
                  db.query(
                    "SELECT id, quantity, unit, item FROM inventory WHERE LOWER(item) = LOWER(?)",
                    [item.item_name],
                    (err, rows) => {
                      if (err) reject(err);
                      else resolve([rows]);
                    }
                  );
                });

                if (invRows.length > 0) {
                  const inv = invRows[0];
                  let deductQty = item.quantity;

                  if (["pcs", "can", "bottle", "pack"].includes(inv.unit.toLowerCase())) {
                    deductQty = item.quantity; 
                  }

                  const newQuantity = inv.quantity - deductQty;

                  if (newQuantity < 0) {
                    db.rollback(() => {});
                    return res.status(400).json({
                      error: `Not enough stock for ${inv.item}`,
                    });
                  }

                  await new Promise((resolve, reject) => {
                    db.query(
                      "UPDATE inventory SET quantity = ?, last_update = NOW() WHERE id = ?",
                      [newQuantity, inv.id],
                      (err) => (err ? reject(err) : resolve())
                    );
                  });
                }
              }
            }

            db.commit((err3) => {
              if (err3) {
                db.rollback(() => {});
                return res.status(500).json({ error: "Commit failed" });
              }
              res.json({ message: "Transaction saved and inventory deducted", transactionId });
            });
          } catch (e) {
            db.rollback(() => {});
            console.error("Deduction error:", e);
            return res.status(500).json({ error: "Error deducting inventory" });
          }
        });
      }
    );
  });
};