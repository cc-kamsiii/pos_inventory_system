import express from "express";
import {
  getMenu,
  getCategories,
  addCategory,
  addMenuItem,
  getSalesByCategory,
  getRecipeIngredients,
  updateMenuItem,
  deleteMenuItem,
  getMenuIngredients,
  addMenuIngredients,
  saveMenuIngredients
} from "../controllers/menuController.js";

const router = express.Router();

router.get("/", getMenu);
router.get("/categories", getCategories);
router.post("/add-category", addCategory);
router.post("/add-item", addMenuItem);
router.get("/sales_by_category", getSalesByCategory);
router.get("/recipe_ingredients", getRecipeIngredients);
router.put("/update/:id", updateMenuItem);
router.delete("/delete/:id", deleteMenuItem);
router.get("/:id/ingredients", getMenuIngredients);
router.post("/:id/ingredients/save", saveMenuIngredients);
router.post("/add-ingredients", addMenuIngredients);      




export default router;
