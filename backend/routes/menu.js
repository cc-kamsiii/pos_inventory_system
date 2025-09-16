import express from "express"
import {getMenu, getCategories} from "../controllers/menuController.js";


const router = express.Router();

router.get("/", getMenu);
router.get("/categories", getCategories);

export default router;