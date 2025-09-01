const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt"); 
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser")

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));


const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "pos_system"
});

app.post('/login', (req, res) =>{
    const {username, password} = req.body;

    db.query("SELECT * FROM users WHERE username = ?", [username], async (err, result) =>{
        if(err) return res.json({error: err});

        if(result.length === 0 ) return res.json({success: false, message: "User not found"});

        const user = result[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) return res.json({success: false, message: "Wrong Password"});

        const token = jwt.sign({id: user.id, role: user.role}, "secretkey", {expiresIn: "1h"});

        return res.json({success: true, token, role:user.role});
    });
});

app.listen(8081, ()=>{
    console.log('listening...');
})

