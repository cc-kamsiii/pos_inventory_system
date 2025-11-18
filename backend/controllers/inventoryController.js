import db from "../config/db.js";

function getCategoryFromItem(itemName) {
  const lower = itemName.toLowerCase();

  // Meat & Poultry
  if (
    lower.includes("chicken") ||
    lower.includes("tapa") ||
    lower.includes("lechon") ||
    lower.includes("beef") ||
    lower.includes("pork") ||
    lower.includes("meat") ||
    lower.includes("liempo") ||
    lower.includes("egg")
  ) {
    return "meat";
  }

  // Seafood
  if (
    lower.includes("bangus") ||
    lower.includes("pulpo") ||
    lower.includes("fish") ||
    lower.includes("shrimp") ||
    lower.includes("seafood")
  ) {
    return "seafood";
  }

  // Vegetables & Produce
  if (
    lower.includes("broccoli") ||
    lower.includes("vegetable") ||
    lower.includes("garlic") ||
    lower.includes("onion") ||
    lower.includes("tomato") ||
    lower.includes("lettuce") ||
    lower.includes("cabbage") ||
    lower.includes("carrot") ||
    lower.includes("eggplant") ||
    lower.includes("tokwa") ||
    lower.includes("tofu") ||
    lower.includes("calamansi")
  ) {
    return "vegetables";
  }

  // Condiments & Sauces
  if (
    lower.includes("sauce") ||
    lower.includes("mayonnaise") ||
    lower.includes("ketchup") ||
    lower.includes("gravy") ||
    lower.includes("condiment") ||
    lower.includes("vinegar") ||
    lower.includes("fish sauce") ||
    lower.includes("sinigang") ||
    lower.includes("cooking oil") ||
    lower.includes("oil") ||
    lower.includes("black pepper") ||
    lower.includes("pepper") ||
    lower.includes("salt")
  ) {
    return "condiments";
  }

  // Beverages
  if (
    lower.includes("juice") ||
    lower.includes("lemonade") ||
    lower.includes("syrup") ||
    lower.includes("mix") ||
    lower.includes("drink") ||
    lower.includes("beverage") ||
    lower.includes("soda") ||
    lower.includes("water") ||
    lower.includes("coffee") ||
    lower.includes("yakult") ||
    lower.includes("coke") ||
    lower.includes("sprite") ||
    lower.includes("royal") ||
    lower.includes("mountain dew") ||
    lower.includes("pepsi") ||
    lower.includes("mug") ||
    lower.includes("rootbeer")
  ) {
    return "beverages";
  }

  // Rice & Grains
  if (
    lower.includes("rice") ||
    lower.includes("grain") ||
    lower.includes("flour")
  ) {
    return "rice";
  }

  // Noodles
  if (
    lower.includes("noodle") ||
    lower.includes("bihon") ||
    lower.includes("canton") ||
    lower.includes("pasta") ||
    lower.includes("spaghetti")
  ) {
    return "noodles";
  }

  // Processed & Canned Goods
  if (
    lower.includes("corned beef") ||
    lower.includes("luncheon") ||
    lower.includes("longganisa") ||
    lower.includes("hotdog") ||
    lower.includes("hot dog") ||
    lower.includes("tocino") ||
    lower.includes("ham") ||
    lower.includes("hungarian") ||
    lower.includes("sausage") ||
    lower.includes("sardines") ||
    lower.includes("canned") ||
    lower.includes("processed")
  ) {
    return "processed";
  }

  return "other";
}

export const getItems = (req, res) => {
  db.query("SELECT * FROM inventory", (err, results) => {
    if (err) return res.status(500).json({ error: err });

    const itemsWithCategories = results.map((item) => ({
      ...item,
      category: item.category || getCategoryFromItem(item.item),
    }));

    res.json(itemsWithCategories);
  });
};

export const addItems = (req, res) => {
  const { item, price, quantity, unit, category } = req.body;

  const itemCategory = category || getCategoryFromItem(item);

  db.query("SHOW COLUMNS FROM inventory LIKE 'category'", (err, result) => {
    let sql, values;

    if (result && result.length > 0) {
      sql = `
        INSERT INTO inventory (item, price, quantity, unit, category, last_update)
        VALUES (?, ?, ?, ?, ?, NOW())
      `;
      values = [item, price, quantity, unit, itemCategory];
    } else {
      sql = `
        INSERT INTO inventory (item, price, quantity, unit, last_update)
        VALUES (?, ?, ?, ?, NOW())
      `;
      values = [item, price, quantity, unit];
    }

    db.query(sql, values, (err, results) => {
      if (err) {
        console.error("Error inserting item:", err);
        return res.status(500).json({
          success: false,
          message: "Database error",
          error: err,
        });
      }

      console.log("Item inserted:", results.insertId);
      return res.status(200).json({
        success: true,
        message: "Item added successfully",
        id: results.insertId,
        category: itemCategory,
      });
    });
  });
};

export const readItems = (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM inventory WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ Message: "Error inside server" });

    if (result.length > 0) {
      const item = result[0];
      item.category = item.category || getCategoryFromItem(item.item);
      return res.json([item]);
    }

    return res.json(result);
  });
};

export const editItems = (req, res) => {
  const id = req.params.id;
  const { item, price, quantity, unit, category } = req.body;

  const itemCategory = category || getCategoryFromItem(item);

  db.query("SHOW COLUMNS FROM inventory LIKE 'category'", (err, result) => {
    let sql, values;

    if (result && result.length > 0) {
      sql =
        "UPDATE inventory SET item = ?, price = ?, quantity = ?, unit = ?, category = ?, last_update = NOW() WHERE id = ?";
      values = [item, price, quantity, unit, itemCategory, id];
    } else {
      sql =
        "UPDATE inventory SET item = ?, price = ?, quantity = ?, unit = ?, last_update = NOW() WHERE id = ?";
      values = [item, price, quantity, unit, id];
    }

    db.query(sql, values, (err, result) => {
      if (err) return res.status(500).json({ Message: "Error inside server" });
      return res.json({
        Message: "Updated Successfully",
        category: itemCategory,
      });
    });
  });
};

export const deleteItems = (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM inventory WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ Message: "Error inside server" });
    return res.json(result);
  });
};

export const getInventorySummary = (req, res) => {
  db.query("SELECT * FROM inventory", (err, results) => {
    if (err) {
      console.error("Inventory summary error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    let total = results.length;
    let lowStock = 0;
    let noStock = 0;

    const categoryCount = {
      meat: 0,
      seafood: 0,
      vegetables: 0,
      condiments: 0,
      beverages: 0,
      rice: 0,
      noodles: 0,
      processed: 0,
      other: 0,
    };

    results.forEach((inv) => {
      const item = inv.item?.toLowerCase() || "";
      const qty = inv.quantity || 0;
      const unit = inv.unit || "";

      const category = inv.category || getCategoryFromItem(inv.item);
      if (categoryCount.hasOwnProperty(category)) {
        categoryCount[category]++;
      }

      if (qty === 0) {
        noStock++;
        return;
      }

      if (
        item.includes("rice") ||
        item.includes("tapa") ||
        item.includes("bangus") ||
        item.includes("chicken") ||
        item.includes("lechon") ||
        item.includes("pulpo") ||
        item.includes("beef") ||
        item.includes("pork") ||
        item.includes("broccoli") ||
        item.includes("vegetable") ||
        item.includes("garlic") ||
        item.includes("onion")
      ) {
        if (qty < 10) lowStock++;
      } else if (
        item.includes("syrup") ||
        item.includes("mix") ||
        item.includes("sauce") ||
        item.includes("mayonnaise") ||
        item.includes("ketchup") ||
        item.includes("gravy") ||
        item.includes("juice") ||
        item.includes("lemonade")
      ) {
        if (qty < 5) lowStock++;
      } else if (
        (unit === "pcs" && qty < 20) ||
        (unit === "cans" && qty < 20) ||
        (unit === "bottles" && qty < 20)
      ) {
        lowStock++;
      }
    });

    res.json({
      total_inventory: total,
      low_stock: lowStock,
      no_stock: noStock,
      by_category: categoryCount,
    });
  });
};

export const getItemsByCategory = (req, res) => {
  const { category } = req.params;

  if (category === "all") {
    return getItems(req, res);
  }

  db.query("SELECT * FROM inventory", (err, results) => {
    if (err) return res.status(500).json({ error: err });

    const filtered = results.filter((item) => {
      const itemCategory = item.category || getCategoryFromItem(item.item);
      return itemCategory === category;
    });

    res.json(filtered);
  });
};

export const getArchivedInventory = (req, res) => {
  db.query("SELECT * FROM archived_inventory", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

export const archiveInventory = (req, res) => {
  const id = req.params.id;

  db.query("SELECT * FROM inventory WHERE id = ?", [id], (err, rows) => {
    if (err) {
      console.error("Error fetching item:", err);
      return res.status(500).json({ error: err.message });
    }
    
    if (rows.length === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    const item = rows[0];

    // **NEW: Delete recipe relationships first**
    db.query(
      "DELETE FROM recipe_ingredients WHERE ingredient_id = ?",
      [id],
      (err2) => {
        if (err2) {
          console.error("Error removing from recipes:", err2);
          return res.status(500).json({ error: err2.message });
        }

        // Insert into archived_inventory
        db.query(
          `INSERT INTO archived_inventory 
            (item, price, category, quantity, unit, archived_at) 
           VALUES (?, ?, ?, ?, ?, NOW())`,
          [
            item.item,
            item.price || 0,
            item.category || getCategoryFromItem(item.item),
            item.quantity || 0,
            item.unit || ''
          ],
          (err3) => {
            if (err3) {
              console.error("Error archiving item:", err3);
              return res.status(500).json({ error: err3.message });
            }

            // Delete from inventory
            db.query("DELETE FROM inventory WHERE id = ?", [id], (err4) => {
              if (err4) {
                console.error("Error deleting item:", err4);
                return res.status(500).json({ error: err4.message });
              }

              res.json({ 
                success: true, 
                message: "Item archived successfully (removed from recipes)" 
              });
            });
          }
        );
      }
    );
  });
};

export const restoreInventory = (req, res) => {
  const id = req.params.id;

  db.query(
    "SELECT * FROM archived_inventory WHERE id = ?",
    [id],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      if (rows.length === 0)
        return res.status(404).json({ message: "Not found" });

      const item = rows[0];

      // Check for duplicates
      db.query(
        "SELECT * FROM inventory WHERE item = ? AND unit = ?",
        [item.item, item.unit],
        (err2, exists) => {
          if (err2) return res.status(500).json(err2);

          if (exists.length > 0) {
            return res.status(400).json({
              message: `Cannot restore. Item "${item.item}" already exists in inventory.`,
            });
          }

          db.query(
            "INSERT INTO inventory (item, category, quantity, unit, last_update) VALUES (?, ?, ?, ?, NOW())",
            [item.item, item.category, item.quantity, item.unit],
            (err3) => {
              if (err3) return res.status(500).json(err3);

              db.query(
                "DELETE FROM archived_inventory WHERE id = ?",
                [id],
                () => {}
              );

              res.json({ success: true, message: "Restored" });
            }
          );
        }
      );
    }
  );
};

export const deletePermanentItem = (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM archived_inventory WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Item permanently deleted" });
  });
};
