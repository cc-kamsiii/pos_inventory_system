import express from "express";
import {getItems, addItems} from "../controllers/inventoryController.js";

const router = express.Router();

router.get('/', getItems);
router.post('/', addItems);

export default router;
