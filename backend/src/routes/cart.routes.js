import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getCart, addToCart } from "../controllers/cart.controller.js";

const router = express.Router();

/**
 * @route GET /api/cart
 * @description Get user's cart
 * @access Private
 */
router.get("/", protect, getCart);

/**
 * @route POST /api/cart/add
 * @description Add product to cart
 * @access Private
 */
router.post("/add", protect, addToCart);

export default router;
