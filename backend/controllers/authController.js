const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.json({ success: false, message: "All fields are required" });
  }

  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, result) => {
      if (err) return res.json({ error: err });

      if (result.length === 0)
        return res.json({ success: false, message: "User not found" });

      const user = result[0];

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.json({ success: false, message: "Wrong Password" });

      const expiresIn = user.role === "staff" ? "1h" : "6h";

      const token = jwt.sign(
        {
          id: user.id,
          name: user.name,
          role: user.role,
          first_name: user.first_name,
        },
        "secretkey",
        { expiresIn }
      );

      if (user.role === "staff") {
        const loginSql = "INSERT INTO cashier_logins (user_id, first_name) VALUES (?, ?)";
        db.query(loginSql, [user.id, user.first_name], (loginErr) => {
          if (loginErr) {
            console.error("Error recording cashier login:", loginErr);
          }
        });
      }

      return res.json({
        success: true,
        message: "Login successful",
        token,
        role: user.role,
        name: user.name,
        first_name: user.first_name,
        user_id: user.id,
      });
    }
  );
};

exports.register = async (req, res) => {
  const { username, password, role, name, first_name } = req.body; // Add first_name here

  if (!username || !password || !role || !name || !first_name) { // Validate it
    return res.json({ success: false, message: "All fields are required" });
  }

  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, result) => {
      if (err) return res.status(500).json({ error: err });

      if (result.length > 0) {
        return res.json({ success: false, message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const sql =
        "INSERT INTO users (username, password, role, name, first_name) VALUES (?, ?, ?, ?, ?)";

      db.query(sql, [username, hashedPassword, role, name, first_name], (err, result) => { // Add first_name here
        if (err) return res.status(400).json({ error: err });
        res.json({ success: true, message: "Account created successfully!" });
      });
    }
  );
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });

    if (result.affectedRows === 0)
      return res
        .status(400)
        .json({ success: false, message: "User not found" });

    res.json({ success: true, message: "Account deleted successfully!" });
  });
};

exports.getAllUsers = async (req, res) => {
  const sql = "SELECT id, username, role, name FROM users";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
};
