import express from "express";
import {getTransactions, addTransactions} from "../controllers/transactionsControllers.js";

const router = express.Router();

router.get('/', getTransactions);
router.post('/', addTransactions);



export default router;

