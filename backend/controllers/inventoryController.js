import db from "../config/db.js";

export const getItems = (req, res) =>{
    db.query("SELECT * FROM inventory", (err, results) =>{
        if(err) return res.status(500).json({error: err});
        res.json(results)
    })
}

export const addItems = (req, res) => {
  const { item, price,  quantity, unit } = req.body;

  const sql = `
    INSERT INTO inventory (item, price, quantity, unit, last_update)
    VALUES (?, ?, ?, ?, NOW())
  `;

  db.query(sql, [item, price,  quantity, unit], (err, results) => {
    if (err) {
      console.error("Error inserting item:", err);
      return res.status(500).json({ success: false, message: "Database error", error: err });
    }

    console.log("Item inserted:", results.insertId);
    return res.status(200).json({
      success: true,
      message: "Item added successfully",
      id: results.insertId
    });
  });
};


export const readItems = (req, res) =>{
    const id = req.params.id;
    const sql = "SELECT * FROM inventory WHERE id = ?";
    db.query(sql, [id], (err, result)=>{
        if(err) return res.status(500).json({Message: "Error inside server"});
        return res.json(result);
    })
}

export const editItems = (req, res) =>{
    const id = req.params.id;
    const {item, price, quantity, unit} = req.body;

    const sql = "UPDATE inventory SET item = ?, price = ?, quantity = ?, unit = ?, last_update = NOW() WHERE id = ?";
    db.query(sql, [item, price, quantity, unit, id], (err, result) =>{
        if(err) return res.status(500).json({Message: "Error inside server"});
        return res.json({Message: "Updated Successfully"});
    })
}

export const deleteItems = (req, res) =>{
    const id = req.params.id;
    const sql = "DELETE FROM inventory WHERE id = ?";
    db.query(sql, [id], (err, result) =>{
        if(err) return res.status(500).json({Message: "Error inside server"});
        return res.json(result)
    })
}

export const getInventorySummary = (req, res) => {
  db.query("SELECT * FROM inventory", (err, results) => {
    if (err) {
      console.error("Inventory summary error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    let total = results.length;
    let lowStock = 0;

    results.forEach((inv) => {
      const item = inv.item.toLowerCase();
      const qty = inv.quantity;
      const unit = inv.unit;

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
    });
  });
};
