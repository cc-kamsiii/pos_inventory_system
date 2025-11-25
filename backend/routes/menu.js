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
  saveMenuIngredients,
  getArchivedMenu,
  archiveMenu,
  restoreMenu,
  deletePermanentMenu
} from "../controllers/menuController.js";

const router = express.Router();

router.get("/categories", getCategories);
router.get("/sales_by_category", getSalesByCategory);
router.get("/recipe_ingredients", getRecipeIngredients);
router.get("/archived", getArchivedMenu);

router.post("/archive/:id", archiveMenu);
router.post("/restore/:id", restoreMenu);
router.delete("/permanent/:id", deletePermanentMenu);

router.post("/add-category", addCategory);
router.post("/add-item", addMenuItem);
router.post("/add-ingredients", addMenuIngredients);

router.put("/update/:id", updateMenuItem);
router.delete("/delete/:id", deleteMenuItem);
router.get("/:id/ingredients", getMenuIngredients);
router.post("/:id/ingredients/save", saveMenuIngredients);

router.get("/", getMenu);

export default router;