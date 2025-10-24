import express from "express";
import {getTransactions, addTransactions, getTotalSales, getAnalytics} from "../controllers/ownerTransactionsControllers.js";

const router = express.Router();

router.get('/', getTransactions);
router.post('/', addTransactions);
router.get('/total_sales', getTotalSales)
router.get('/analytics', getAnalytics)



export default router;

