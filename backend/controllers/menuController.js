import db from "../config/db.js";


export const getMenu = (req, res) =>{
    db.query("SELECT * FROM menu", (err, results) =>{
        if(err) return res.status(500).json({error: err})
        res.json(results);
    });
};

export const getCategories = (req, res) =>{
    db.query("SELECT category, COUNT(*) as count FROM menu GROUP BY category", (err, results) =>{
        if(err) return res.status(500).json({error:err})
        res.json(results);    
    });
};