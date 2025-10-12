import express from "express";
import {getTransactions, addTransactions, getTotalSales} from "../controllers/ownerTransactionsControllers.js";

const router = express.Router();

router.get('/', getTransactions);
router.post('/', addTransactions);
router.get('/total_sales', getTotalSales)



export default router;

