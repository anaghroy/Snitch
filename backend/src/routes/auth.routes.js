import { Router } from "express";
import {
  validateRegisterUser,
  validateLoginUser,
} from "../validator/auth.validator.js";
import {
  googleCallback,
  githubCallback,
  login,
  register,
  logout,
  getMe,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { config } from "../config/config.js";
import passport from "passport";

const router = Router();

router.post("/register", validateRegisterUser, register);

router.post("/login", validateLoginUser, login);

router.get("/get-me", protect, getMe);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect:
      config.NODE_ENV == "development"
        ? "http://localhost:5173/login"
        : "/login",
  }),
  googleCallback,
);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
);
router.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect:
      config.NODE_ENV == "development"
        ? "http://localhost:5173/login"
        : "/login",
  }),
  githubCallback,
);

router.get("/logout", logout);

export default router;
