import db from "../config/db.js";

export const getItems = (req, res) =>{
    db.query("SELECT * FROM inventory", (err, results) =>{
        if(err) return res.status(500).json({error: err});
        res.json(results)
    })
}

export const addItems = (req, res) =>{
    const values = [
        req.body.item,
        req.body.quantity,
        req.body.unit
    ]
    const sql = "INSERT INTO inventory (`item`, `quantity`, `unit`, `last_update`) VALUES (?, ? ,?, NOW())";
    db.query(sql, [values], (err, results) =>{
        if(err) return res.status(500).json({error: err});
        res.json({message: "Item added", id: results.insertId });
    })
}