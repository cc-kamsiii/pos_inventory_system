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
    WHERE DATE(t.order_date) = CURDATE()
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

 
  db.beginTransaction((err) => {
    if (err) return res.status(500).json({ error: "Transaction start failed" });

    const sqlTransaction = `
      INSERT INTO transactions (order_type, payment_method, total_payment, cashier_name, user_id)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sqlTransaction, [order_type, payment_method, total_payment, cashier_name, user_id], (err, result) => {
      if (err) {
        db.rollback(() => {});
        console.error("Error inserting transaction:", err);
        return res.status(500).json({ error: "Database error: " + err.message });
      }

      const transactionId = result.insertId;

      // Insert all transaction items
      const sqlItems = `
        INSERT INTO transaction_items (transaction_id, menu_id, quantity, price)
        VALUES ?
      `;
      const values = cart.map(item => [transactionId, item.id, item.quantity, item.price]);

      db.query(sqlItems, [values], async (err2) => {
        if (err2) {
          db.rollback(() => {});
          console.error("Error inserting transaction items:", err2);
          return res.status(500).json({ error: "Database error: " + err2.message });
        }

        try {
          // Loop through all menu items in the cart
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
              // Deduct ingredients per recipe
              for (const r of recipeRows) {
                const totalNeeded = r.amount_per_serving * item.quantity;

                const [invRows] = await new Promise((resolve, reject) => {
                  db.query(
                    "SELECT quantity, item FROM inventory WHERE id = ?",
                    [r.ingredient_id],
                    (err, rows) => {
                      if (err) reject(err);
                      else resolve([rows]);
                    }
                  );
                });

                if (invRows.length === 0 || invRows[0].quantity < totalNeeded) {
                  db.rollback(() => {});
                  return res.status(400).json({
                    error: `Not enough stock for ingredient ID ${r.ingredient_id}`,
                  });
                }

                await new Promise((resolve, reject) => {
                  db.query(
                    "UPDATE inventory SET quantity = quantity - ?, last_update = NOW() WHERE id = ?",
                    [totalNeeded, r.ingredient_id],
                    (err) => {
                      if (err) reject(err);
                      else resolve();
                    }
                  );
                });
              }
            } else {
              // No recipe: try to deduct directly from inventory by name (for drinks)
              await new Promise((resolve) => {
                db.query(
                  "UPDATE inventory SET quantity = quantity - ? , last_update = NOW() WHERE LOWER(item) = LOWER(?)",
                  [item.quantity, item.item_name || ""],
                  () => resolve() // silently skip if not found
                );
              });
            }
          }

          // Commit only if all OK
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
    });
  });
};
