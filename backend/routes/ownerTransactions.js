import express from "express";
import {
  getTransactions,
  addTransactions,
  getTotalSales,
  getTotalSalesBreakdown,
  getOrdersSummary,
  getSalesChart,
  getCashierLogins,
  getMostSellingMenu, 
  getSalesByCategory
} from "../controllers/ownerTransactionsControllers.js";

const router = express.Router();

router.get("/", getTransactions);
router.post("/", addTransactions);
router.get("/total_sales", getTotalSales);
router.get("/total_sales_breakdown", getTotalSalesBreakdown);
router.get("/orders_summary", getOrdersSummary);
router.get("/sales_chart", getSalesChart);
router.get("/cashier_logins", getCashierLogins);
router.get("/most_selling_menu", getMostSellingMenu);
router.get("/sales_by_category", getSalesByCategory);

export default router;
