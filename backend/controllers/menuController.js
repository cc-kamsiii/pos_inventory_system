import db from "../config/db.js";

export const getMenu = (req, res) => {
  const sql = `
    SELECT 
      m.id,
      m.item_name,
      m.price,
      m.size,
      m.category,
      CASE
        -- If no recipe ingredients, check inventory directly
        WHEN COUNT(ri.ingredient_id) = 0 THEN
          CASE
            WHEN inv.quantity IS NULL OR inv.quantity <= 0 THEN 'no-stock'
            WHEN inv.quantity <= 10 THEN 'low-stock'
            ELSE 'available'
          END
        ELSE
          -- If menu has ingredients, base on servings possible
          CASE
            WHEN MIN(
              CASE 
                WHEN i.quantity IS NULL THEN 0
                WHEN ri.amount_per_serving <= 0 THEN 999999
                ELSE i.quantity / ri.amount_per_serving
              END
            ) <= 0 THEN 'no-stock'
            WHEN MIN(
              CASE 
                WHEN i.quantity IS NULL THEN 0
                WHEN ri.amount_per_serving <= 0 THEN 999999
                ELSE i.quantity / ri.amount_per_serving
              END
            ) <= 10 THEN 'low-stock'
            ELSE 'available'
          END
      END AS stockStatus
    FROM menu m
    LEFT JOIN recipe_ingredients ri ON m.id = ri.menu_id
    LEFT JOIN inventory i ON ri.ingredient_id = i.id
    LEFT JOIN inventory inv ON LOWER(inv.item) = LOWER(m.item_name)
    GROUP BY m.id, m.item_name, m.price, m.category, inv.quantity;
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching menu:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
};

export const searchMenuWithIngredients = (req, res) => {
  const { query } = req.query;
  
  const sql = `
    SELECT DISTINCT
      m.id,
      m.item_name,
      m.price,
      m.size,
      m.category,
      CASE
        WHEN COUNT(ri.ingredient_id) = 0 THEN
          CASE
            WHEN inv.quantity IS NULL OR inv.quantity <= 0 THEN 'no-stock'
            WHEN inv.quantity <= 10 THEN 'low-stock'
            ELSE 'available'
          END
        ELSE
          CASE
            WHEN MIN(
              CASE 
                WHEN i.quantity IS NULL THEN 0
                WHEN ri.amount_per_serving <= 0 THEN 999999
                ELSE i.quantity / ri.amount_per_serving
              END
            ) <= 0 THEN 'no-stock'
            WHEN MIN(
              CASE 
                WHEN i.quantity IS NULL THEN 0
                WHEN ri.amount_per_serving <= 0 THEN 999999
                ELSE i.quantity / ri.amount_per_serving
              END
            ) <= 10 THEN 'low-stock'
            ELSE 'available'
          END
      END AS stockStatus,
      GROUP_CONCAT(DISTINCT inv_ing.item SEPARATOR ', ') AS ingredients
    FROM menu m
    LEFT JOIN recipe_ingredients ri ON m.id = ri.menu_id
    LEFT JOIN inventory i ON ri.ingredient_id = i.id
    LEFT JOIN inventory inv ON LOWER(inv.item) = LOWER(m.item_name)
    LEFT JOIN inventory inv_ing ON ri.ingredient_id = inv_ing.id
    WHERE 
      LOWER(m.item_name) LIKE LOWER(?) OR
      EXISTS (
        SELECT 1 FROM recipe_ingredients ri2
        LEFT JOIN inventory i2 ON ri2.ingredient_id = i2.id
        WHERE ri2.menu_id = m.id AND LOWER(i2.item) LIKE LOWER(?)
      )
    GROUP BY m.id, m.item_name, m.price, m.category, m.size, inv.quantity
  `;
  
  const searchTerm = `%${query}%`;
  
  db.query(sql, [searchTerm, searchTerm], (err, results) => {
    if (err) {
      console.error("Error searching menu:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
};

export const getCategories = (req, res) => {
  const sql = `
   SELECT category,
       COUNT(*) AS count
FROM menu
WHERE category IS NOT NULL AND category <> ''
GROUP BY category;

  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

export const addCategory = (req, res) => {
  const { category } = req.body;
  if (!category)
    return res.status(400).json({ message: "Category name required" });

  const checkSql = "SELECT DISTINCT category FROM menu WHERE category = ?";
  db.query(checkSql, [category], (err, existing) => {
    if (err) return res.status(500).json({ error: err });

    if (existing.length > 0) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const sql = "INSERT INTO menu (category) VALUES (?)";
    db.query(sql, [category], (err) => {
      if (err)
        return res.status(500).json({ message: "Error adding category", err });
      res.json({ message: "Category added successfully" });
    });
  });
};

export const addMenuItem = (req, res) => {
  const { item_name, price, category, size } = req.body;
  const itemSize = size && size.trim() !== "" ? size : null;

  db.query(
    "INSERT INTO menu (item_name, price, category, size) VALUES (?, ?, ?, ?)",
    [item_name, price, category, itemSize],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });

      res.status(200).json({
        message: "Item added successfully",
        menu_id: result.insertId,
      });
    }
  );
};

export const getSalesByCategory = (req, res) => {
  const sql = `
    SELECT 
      COALESCE(m.category, 'Uncategorized') AS category, 
      SUM(COALESCE(ti.quantity, 0) * COALESCE(ti.price, 0)) AS amount
    FROM transaction_items ti
    JOIN menu m ON ti.menu_id = m.id
    JOIN transactions t ON ti.transaction_id = t.id
    GROUP BY m.category
    ORDER BY amount DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });

    const data = [["Category", "Amount"]];
    results.forEach((row) => {
      data.push([row.category, Number(row.amount) || 0]);
    });

    res.json(data);
  });
};

export const getRecipeIngredients = (req, res) => {
  db.query("SELECT * FROM recipe_ingredients", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

export const updateMenuItem = (req, res) => {
  const { id } = req.params;
  const { item_name, price, category, size } = req.body;

  const sql = `
    UPDATE menu 
    SET item_name = ?, price = ?, category = ?, size = ?
    WHERE id = ?
  `;

  db.query(sql, [item_name, price, category, size, id], (err, result) => {
    if (err) {
      console.error("Error updating menu item:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json({ message: "Menu item updated successfully" });
  });
};

export const deleteMenuItem = (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT COUNT(*) as count FROM transaction_items WHERE menu_id = ?",
    [id],
    (err, countResult) => {
      if (err) {
        console.error("Error checking transactions:", err);
        return res.status(500).json({ error: "Database error" });
      }

      const transactionCount = countResult[0].count;

      if (transactionCount > 0) {
        return res.status(400).json({
          success: false,
          message: `Cannot delete this menu item. It has been used in ${transactionCount} transaction(s). Consider archiving it instead.`,
          usedInTransactions: true
        });
      }

      db.query(
        "DELETE FROM recipe_ingredients WHERE menu_id = ?",
        [id],
        (err2) => {
          if (err2) {
            console.error("Error deleting recipe ingredients:", err2);
            return res.status(500).json({ error: "Database error" });
          }

          db.query("DELETE FROM menu WHERE id = ?", [id], (err3) => {
            if (err3) {
              console.error("Error deleting menu item:", err3);
              return res.status(500).json({ error: "Database error" });
            }

            res.json({ message: "Menu item deleted successfully" });
          });
        }
      );
    }
  );
};

export const getMenuIngredients = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT 
      ri.id,
      ri.ingredient_id,
      i.item AS ingredient_name,
      ri.amount_per_serving
    FROM recipe_ingredients ri
    LEFT JOIN inventory i ON ri.ingredient_id = i.id
    WHERE ri.menu_id = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Error fetching menu ingredients:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json(results);
  });
};

export const addMenuIngredients = (req, res) => {
  const { menu_id, ingredients } = req.body;

  if (!menu_id || !ingredients || !Array.isArray(ingredients)) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const sql = `
    INSERT INTO recipe_ingredients (menu_id, ingredient_id, amount_per_serving)
    VALUES ?
  `;

  const values = ingredients.map((ing) => [
    menu_id,
    ing.ingredient_id || null,
    parseFloat(ing.amount_per_serving || ing.qty || 0),
  ]);

  db.query(sql, [values], (err) => {
    if (err) {
      console.error("Error saving recipe ingredients:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json({ message: "Ingredients saved successfully" });
  });
};

export const saveMenuIngredients = (req, res) => {
  const { id } = req.params;
  const { ingredients } = req.body;

  if (!Array.isArray(ingredients)) {
    return res.status(400).json({ message: "Ingredients must be array" });
  }

  const deleteSQL = "DELETE FROM recipe_ingredients WHERE menu_id = ?";

  db.query(deleteSQL, [id], (deleteErr) => {
    if (deleteErr) {
      console.error("Delete error:", deleteErr);
      return res.status(500).json({ error: "Error deleting old ingredients" });
    }

    if (ingredients.length === 0) {
      return res.json({ message: "Ingredients cleared" });
    }

    const insertSQL = `
      INSERT INTO recipe_ingredients (menu_id, ingredient_id, amount_per_serving)
      VALUES ?
    `;

    const values = ingredients.map((ing) => [
      id,
      ing.ingredient_id || null,
      ing.amount_per_serving || ing.qty || 0,
    ]);

    db.query(insertSQL, [values], (insertErr) => {
      if (insertErr) {
        console.error("Insert error:", insertErr);
        return res.status(500).json({ error: "Error saving ingredients" });
      }

      res.json({ message: "Ingredients updated successfully" });
    });
  });
};

export const getArchivedMenu = (req, res) => {
  db.query("SELECT * FROM archived_menu", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

export const archiveMenu = (req, res) => {
  const id = req.params.id;

  db.query("SELECT * FROM menu WHERE id = ?", [id], (err, rows) => {
    if (err) {
      console.error("Error fetching menu item:", err);
      return res.status(500).json({ error: err.message });
    }
    
    if (rows.length === 0) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    const item = rows[0];

    db.query(
      `INSERT INTO archived_menu 
        (item_name, price, category, size, archived_at) 
       VALUES (?, ?, ?, ?, NOW())`,
      [
        item.item_name,
        item.price || 0,
        item.category || null,
        item.size || null
      ],
      (err2) => {
        if (err2) {
          console.error("Error inserting into archived_menu:", err2);
          return res.status(500).json({ error: err2.message });
        }

        db.query("DELETE FROM recipe_ingredients WHERE menu_id = ?", [id], (err3) => {
          if (err3) {
            console.error("Error deleting recipe ingredients:", err3);
            return res.status(500).json({ error: err3.message });
          }

          db.query("DELETE FROM menu WHERE id = ?", [id], (err4) => {
            if (err4) {
              console.error("Error deleting menu item:", err4);
              return res.status(500).json({ error: err4.message });
            }

            res.json({ success: true, message: "Menu item archived successfully" });
          });
        });
      }
    );
  });
};

export const restoreMenu = (req, res) => {
  const id = req.params.id;

  db.query(
    "SELECT * FROM archived_menu WHERE id = ?",
    [id],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      if (rows.length === 0)
        return res.status(404).json({ message: "Not found" });

      const item = rows[0];

      db.query(
        "SELECT * FROM menu WHERE item_name = ? AND category = ?",
        [item.item_name, item.category],
        (err2, exists) => {
          if (err2) return res.status(500).json(err2);

          if (exists.length > 0) {
            return res.status(400).json({
              message: `Cannot restore. Item "${item.item_name}" already exists in menu.`,
            });
          }

          db.query(
            "INSERT INTO menu (item_name, price, category, size) VALUES (?, ?, ?, ?)",
            [item.item_name, item.price, item.category, item.size],
            (err3) => {
              if (err3) return res.status(500).json(err3);

              db.query(
                "DELETE FROM archived_menu WHERE id = ?",
                [id],
                () => {}
              );

              res.json({ success: true, message: "Menu item restored" });
            }
          );
        }
      );
    }
  );
};

export const deletePermanentMenu = (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM archived_menu WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Menu item permanently deleted" });
  });
};