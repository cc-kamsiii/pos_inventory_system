import express from "express";
import { getSalesByType } from "../controllers/salesController.js";

const router = express.Router();

router.get("/:type", getSalesByType);

export default router;
