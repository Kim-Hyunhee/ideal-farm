import express from "express";
import {
  getProducts,
  getProductsDetail,
  getYetEndProducts,
} from "../controllers/products.js";
var router = express.Router();

router.get("/", getProducts);
router.get("/yet-end", getYetEndProducts);
router.get("/:id", getProductsDetail);
export default router;
