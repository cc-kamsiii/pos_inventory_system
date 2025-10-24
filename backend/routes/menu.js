import express from "express"
import {getMenu, getCategories, addCategory, addMenuItem, getSalesByCategory} from "../controllers/menuController.js";


const router = express.Router();

router.get("/", getMenu);
router.get("/categories", getCategories);
router.post("/add-category", addCategory);
router.post("/add-item", addMenuItem);
router.get('/sales_by_category', getSalesByCategory); 

export default router;