import express from "express";
import {
  getItems,
  addItems,
  readItems,
  editItems,
  deleteItems,
  getInventorySummary,
  getItemsByCategory,
  getArchivedInventory,
  archiveInventory,  
  restoreInventory,   
  deletePermanentItem
} from "../controllers/inventoryController.js";

const router = express.Router();

router.get('/summary', getInventorySummary);
router.get('/archived', getArchivedInventory);
router.get('/category/:category', getItemsByCategory);

router.post('/archive/:id', archiveInventory); 
router.post('/restore/:id', restoreInventory);  
router.delete('/permanent/:id', deletePermanentItem);

router.get('/', getItems);
router.post('/', addItems);
router.get('/:id', readItems);
router.put('/:id', editItems);
router.delete('/:id', deleteItems);

export default router;