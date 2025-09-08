import db from "../config/db.js";

export const getItems = (req, res) =>{
    db.query("SELECT * FROM inventory", (err, results) =>{
        if(err) return res.status(500).json({error: err});
        res.json(results)
    })
}

export const addItems = (req, res) =>{
    const {item, quantity, unit} = req.body
    const sql = "INSERT INTO inventory (`item`, `quantity`, `unit`, `last_update`) VALUES (?, ? ,?, NOW())";
    db.query(sql, [item, quantity, unit], (err, results) =>{
        if(err) return res.status(500).json({error: err});
        res.json({message: "Item added", id: results.insertId });
    })
}

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
    const {item, quantity, unit} = req.body;

    const sql = "UPDATE inventory SET item = ?, quantity = ?, unit = ?, last_update = NOW() WHERE id = ?";
    db.query(sql, [item, quantity, unit, id], (err, result) =>{
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
