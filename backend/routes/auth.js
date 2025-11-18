const express = require("express");
const router = express.Router();

const { 
    login, 
    register, 
    getAllUsers,
    archiveUser,
    getArchivedUsers,
    restoreUser,        // Add this
    permanentDeleteUser // Add this
} = require("../controllers/authController");

router.post("/login", login);
router.post("/register", register);

router.delete("/archive/:id", archiveUser);
router.post("/restore/:id", restoreUser);           // Add this
router.delete("/permanent/:id", permanentDeleteUser); // Add this

router.get("/users", getAllUsers);
router.get("/archived", getArchivedUsers);

module.exports = router;