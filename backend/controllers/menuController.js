import db from "../config/db.js";


export const getMenu = (req, res) => {
    db.query("SELECT * FROM menu", (err, results) => {
        if (err) return res.status(500).json({ error: err })
        res.json(results);
    });
};

export const getCategories = (req, res) => {
    db.query("SELECT category, COUNT(*) as count FROM menu GROUP BY category", (err, results) => {
        if (err) return res.status(500).json({ error: err })
        res.json(results);
    });
};

export const addCategory = (req, res) => {
    const { category } = req.body;

    if (!category) return res.status(400).json({ message: "category name required" });


    const checkSql = "SELECT * FROM menu WHERE category = ?"

    db.query(checkSql, [category], (err, existing) => {
        if (err) return res.status(500).json({ error: err });
        if (existing.length > 0) {
            return res.status(400).json({ message: "category already exist" });
        }

        const sql = "INSERT INTO menu (item_name, price, category, size) VALUES (?,?,?,?)";
        db.query(sql, ["", 0, category, ""], (err) => {
            if (err) return res.status(500).json({ message: "error in adding category", err })
            res.json({ message: "category added successfully" });
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