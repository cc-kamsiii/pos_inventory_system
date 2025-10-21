import db from "../config/db.js";


export const getMenu = (req, res) => {
  db.query(
    "SELECT * FROM menu WHERE item_name IS NOT NULL AND item_name <> ''",
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    }
  );
};


export const getCategories = (req, res) => {
  const sql = `
    SELECT category, 
           COUNT(CASE WHEN item_name IS NOT NULL AND item_name <> '' THEN 1 END) AS count
    FROM menu
    GROUP BY category
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};


export const addCategory = (req, res) => {
  const { category } = req.body;

  if (!category) return res.status(400).json({ message: "Category name required" });

  const checkSql = "SELECT DISTINCT category FROM menu WHERE category = ?";
  db.query(checkSql, [category], (err, existing) => {
    if (err) return res.status(500).json({ error: err });

    if (existing.length > 0) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const sql = "INSERT INTO menu (category) VALUES (?)";
    db.query(sql, [category], (err) => {
      if (err) {
        console.error("SQL ERROR:", err);
        return res.status(500).json({ message: "Error adding category", err });
      }
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
            res.status(200).json({ message: "Item added successfully" });
        }
    );
}