const express = require("express");
const router = express.Router();
const { login, register, deleteUser, getAllUsers } = require("../controllers/authController");

router.post("/login", login);
router.post("/register", register);
router.delete("/:id", deleteUser);
router.get("/users", getAllUsers);

module.exports = router;
