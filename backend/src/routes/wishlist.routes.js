import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getWishlist, toggleWishlistItem } from "../controllers/wishlist.controller.js";

const router = express.Router();

/**
 * @route GET /api/wishlist
 * @description Get user's wishlist
 * @access Private
 */
router.get("/", protect, getWishlist);

/**
 * @route POST /api/wishlist/toggle
 * @description Toggle product in wishlist
 * @access Private
 */
router.post("/toggle", protect, toggleWishlistItem);

export default router;
