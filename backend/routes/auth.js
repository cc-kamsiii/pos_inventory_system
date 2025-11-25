const express = require("express");
const router = express.Router();

const { 
    login, 
    register, 
    getAllUsers,
    archiveUser,
    getArchivedUsers,
    restoreUser,        
    permanentDeleteUser,
    logout,  // ✅ Added logout to destructuring
} = require("../controllers/authController");

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);  // ✅ Use logout directly (not authController.logout)

router.delete("/archive/:id", archiveUser);
router.post("/restore/:id", restoreUser);           
router.delete("/permanent/:id", permanentDeleteUser); 

router.get("/users", getAllUsers);
router.get("/archived", getArchivedUsers);

module.exports = router;