import express from "express"
import {getMenu, getCategories, addCategory, addMenuItem} from "../controllers/menuController.js";


const router = express.Router();

router.get("/", getMenu);
router.get("/categories", getCategories);
router.post("/add-category", addCategory);
router.post("/add-item", addMenuItem);

export default router;