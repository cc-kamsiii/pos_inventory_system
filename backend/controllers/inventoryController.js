import db from "../config/db.js";

function getCategoryFromItem(itemName) {
  const lower = itemName.toLowerCase();

  // Meat & Poultry
  if (lower.includes("chicken") || lower.includes("tapa") || 
      lower.includes("lechon") || lower.includes("beef") || 
      lower.includes("pork") || lower.includes("meat") ||
      lower.includes("liempo") || lower.includes("egg")) {
    return "meat";
  }
  
  // Seafood
  if (lower.includes("bangus") || lower.includes("pulpo") || 
      lower.includes("fish") || lower.includes("shrimp") || 
      lower.includes("seafood")) {
    return "seafood";
  }
  
  // Vegetables & Produce
  if (lower.includes("broccoli") || lower.includes("vegetable") || 
      lower.includes("garlic") || lower.includes("onion") || 
      lower.includes("tomato") || lower.includes("lettuce") ||
      lower.includes("cabbage") || lower.includes("carrot") ||
      lower.includes("eggplant") || lower.includes("tokwa") ||
      lower.includes("tofu") || lower.includes("calamansi")) {
    return "vegetables";
  }
  
  // Condiments & Sauces
  if (lower.includes("sauce") || lower.includes("mayonnaise") || 
      lower.includes("ketchup") || lower.includes("gravy") || 
      lower.includes("condiment") || lower.includes("vinegar") ||
      lower.includes("fish sauce") || lower.includes("sinigang") ||
      lower.includes("cooking oil") || lower.includes("oil") ||
      lower.includes("black pepper") || lower.includes("pepper") ||
      lower.includes("salt")) {
    return "condiments";
  }
  
  // Beverages
  if (lower.includes("juice") || lower.includes("lemonade") || 
      lower.includes("syrup") || lower.includes("mix") || 
      lower.includes("drink") || lower.includes("beverage") ||
      lower.includes("soda") || lower.includes("water") ||
      lower.includes("coffee") || lower.includes("yakult") ||
      lower.includes("coke") || lower.includes("sprite") ||
      lower.includes("royal") || lower.includes("mountain dew") ||
      lower.includes("pepsi") || lower.includes("mug") ||
      lower.includes("rootbeer")) {
    return "beverages";
  }
  
  // Rice & Grains
  if (lower.includes("rice") || lower.includes("grain") || 
      lower.includes("flour")) {
    return "rice";
  }
  
  // Noodles
  if (lower.includes("noodle") || lower.includes("bihon") || 
      lower.includes("canton") || lower.includes("pasta") ||
      lower.includes("spaghetti")) {
    return "noodles";
  }
  
  // Processed & Canned Goods
  if (lower.includes("corned beef") || lower.includes("luncheon") ||
      lower.includes("longganisa") || lower.includes("hotdog") ||
      lower.includes("hot dog") || lower.includes("tocino") ||
      lower.includes("ham") || lower.includes("hungarian") ||
      lower.includes("sausage") || lower.includes("sardines") ||
      lower.includes("canned") || lower.includes("processed")) {
    return "processed";
  }

  return "other";
}

export const getItems = (req, res) => {
  db.query("SELECT * FROM inventory", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    
    const itemsWithCategories = results.map(item => ({
      ...item,
      category: item.category || getCategoryFromItem(item.item)
    }));
    
    res.json(itemsWithCategories);
  });
}

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
          error: err 
        });
      }

      console.log("Item inserted:", results.insertId);
      return res.status(200).json({
        success: true,
        message: "Item added successfully",
        id: results.insertId,
        category: itemCategory 
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
}

export const editItems = (req, res) => {
  const id = req.params.id;
  const { item, price, quantity, unit, category } = req.body;
  
  const itemCategory = category || getCategoryFromItem(item);

  db.query("SHOW COLUMNS FROM inventory LIKE 'category'", (err, result) => {
    let sql, values;
    
    if (result && result.length > 0) {
      sql = "UPDATE inventory SET item = ?, price = ?, quantity = ?, unit = ?, category = ?, last_update = NOW() WHERE id = ?";
      values = [item, price, quantity, unit, itemCategory, id];
    } else {
      sql = "UPDATE inventory SET item = ?, price = ?, quantity = ?, unit = ?, last_update = NOW() WHERE id = ?";
      values = [item, price, quantity, unit, id];
    }

    db.query(sql, values, (err, result) => {
      if (err) return res.status(500).json({ Message: "Error inside server" });
      return res.json({ 
        Message: "Updated Successfully",
        category: itemCategory 
      });
    });
  });
}

export const deleteItems = (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM inventory WHERE id = ?";
  
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ Message: "Error inside server" });
    return res.json(result);
  });
}

export const getInventorySummary = (req, res) => {
  db.query("SELECT * FROM inventory", (err, results) => {
    if (err) {
      console.error("Inventory summary error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    let total = results.length;
    let lowStock = 0;

    const categoryCount = {
      meat: 0,
      seafood: 0,
      vegetables: 0,
      condiments: 0,
      beverages: 0,
      rice: 0,
      noodles: 0,
      processed: 0,
      other: 0
    };

    results.forEach((inv) => {
      const item = inv.item.toLowerCase();
      const qty = inv.quantity;
      const unit = inv.unit;

      const category = inv.category || getCategoryFromItem(inv.item);
      if (categoryCount.hasOwnProperty(category)) {
        categoryCount[category]++;
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
      by_category: categoryCount 
    });
  });
};

export const getItemsByCategory = (req, res) => {
  const { category } = req.params;
  
  if (category === 'all') {
    return getItems(req, res);
  }
  
  db.query("SELECT * FROM inventory", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    
    const filtered = results.filter(item => {
      const itemCategory = item.category || getCategoryFromItem(item.item);
      return itemCategory === category;
    });
    
    res.json(filtered);
  });
};