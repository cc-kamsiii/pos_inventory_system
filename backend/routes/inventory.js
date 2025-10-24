import express from "express";
import {getItems, addItems, readItems, editItems, deleteItems, getInventorySummary} from "../controllers/inventoryController.js";

const router = express.Router();


router.get('/summary', getInventorySummary);

router.get('/', getItems);
router.post('/', addItems);
router.get('/:id', readItems)
router.put('/:id', editItems)
router.delete('/:id', deleteItems)

export default router;
