const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
    const { username, password } = req.body;

    db.query("SELECT * FROM users WHERE username = ?", [username], async (err, result) => {
        if (err) return res.json({ error: err });

        if (result.length === 0) 
            return res.json({ success: false, message: "User not found" });

        const user = result[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) 
            return res.json({ success: false, message: "Wrong Password" });

        const token = jwt.sign(
            { id: user.id, name: user.name },
            "secretkey",
            { expiresIn: "1h" }
        );

        return res.json({ success: true, token, name: user.name, role: user.role });
    });
};
