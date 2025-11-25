const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.json({ success: false, message: "All fields are required" });
  }

  db.query(
    "SELECT * FROM users WHERE username = ? AND is_archived = FALSE",
    [username],
    async (err, result) => {
      if (err) return res.json({ error: err });

      if (result.length === 0)
        return res.json({ success: false, message: "User not found or archived" });

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

exports.logout = async (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    return res.json({ success: false, message: "User ID is required" });
  }

  const logoutSql = `
    UPDATE cashier_logins 
    SET logout_time = NOW() 
    WHERE user_id = ? 
    AND logout_time IS NULL 
    ORDER BY login_time DESC 
    LIMIT 1
  `;

  db.query(logoutSql, [user_id], (err, result) => {
    if (err) {
      console.error("Error recording cashier logout:", err);
      return res.status(500).json({ error: err });
    }

    return res.json({
      success: true,
      message: "Logout recorded successfully"
    });
  });
};

exports.getAllUsers = async (req, res) => {
  const sql = "SELECT id, username, role, name FROM users WHERE is_archived = FALSE";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
};

exports.register = async (req, res) => {
  const { username, password, role, name, first_name } = req.body;

  if (!username || !password || !role || !name || !first_name) {
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
        "INSERT INTO users (username, password, role, name, first_name, is_archived) VALUES (?, ?, ?, ?, ?, FALSE)";

      db.query(sql, [username, hashedPassword, role, name, first_name], (err, result) => {
        if (err) return res.status(400).json({ error: err });
        res.json({ success: true, message: "Account created successfully!" });
      });
    }
  );
};

exports.archiveUser = async (req, res) => {
  const { id } = req.params;

  console.log("=== ARCHIVE USER START ===");
  console.log("Attempting to archive user with ID:", id);

  const sql = "UPDATE users SET is_archived = TRUE, archived_at = NOW() WHERE id = ?";
  
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error archiving user:", err);
      return res.status(500).json({ 
        error: err.message,
        step: "archive_user"
      });
    }

    if (result.affectedRows === 0) {
      console.log("User not found with ID:", id);
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    console.log("Successfully archived user");
    console.log("=== ARCHIVE USER COMPLETE ===");
    
    res.json({ 
      success: true, 
      message: "Account archived successfully! Transaction history preserved." 
    });
  });
};

exports.getArchivedUsers = async (req, res) => {
  const sql = "SELECT id, username, role, name, first_name, archived_at FROM users WHERE is_archived = TRUE ORDER BY archived_at DESC";
  
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
};

exports.restoreUser = async (req, res) => {
  const { id } = req.params;

  const sql = "UPDATE users SET is_archived = FALSE, archived_at = NULL WHERE id = ?";
  
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error restoring user:", err);
      return res.status(500).json({ error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Archived user not found" 
      });
    }

    res.json({ 
      success: true, 
      message: "User restored successfully!" 
    });
  });
};

exports.permanentDeleteUser = async (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT COUNT(*) as count FROM transactions WHERE user_id = ?",
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });

      const transactionCount = result[0].count;

      if (transactionCount > 0) {
        return res.status(400).json({ 
          success: false, 
          message: `Cannot permanently delete user. This user has ${transactionCount} transaction(s) in the system. Archive only is allowed to preserve transaction history.`
        });
      }

      db.query("DELETE FROM users WHERE id = ? AND is_archived = TRUE", [id], (deleteErr, deleteResult) => {
        if (deleteErr) return res.status(500).json({ error: deleteErr });

        if (deleteResult.affectedRows === 0) {
          return res.status(404).json({ 
            success: false, 
            message: "Archived user not found" 
          });
        }

        res.json({ 
          success: true, 
          message: "User permanently deleted!" 
        });
      });
    }
  );
};