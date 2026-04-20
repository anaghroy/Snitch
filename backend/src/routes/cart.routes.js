import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getCart, addToCart, removeFromCart, clearCart, updateCartItemQuantity } from "../controllers/cart.controller.js";

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

/**
 * @route DELETE /api/cart/remove/:itemId
 * @description Remove product from cart
 * @access Private
 */
router.delete("/remove/:itemId", protect, removeFromCart);

/**
 * @route DELETE /api/cart/clear
 * @description Clear cart
 * @access Private
 */
router.delete("/clear", protect, clearCart);

/**
 * @route PUT /api/cart/update/:itemId
 * @description Update cart item quantity
 * @access Private
 */
router.put("/update/:itemId", protect, updateCartItemQuantity);

export default router;
