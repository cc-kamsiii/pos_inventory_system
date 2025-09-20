import db from "../config/db.js"

export const getTransactions = (req, res) =>{
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
    ORDER BY t.order_date DESC
    `;

    db.query(sql, (err, result) =>{
        if(err){
            console.log(err)
            return res.status(500).json({error: "Database error"});
        }
        res.json(result);
    });
}