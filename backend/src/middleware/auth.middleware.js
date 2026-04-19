import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import { redisClient } from "../config/redis.js";
import userModel from "../models/user.model.js";


export const protect = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const isBlacklisted = await redisClient.get(`blacklist:${token}`);

    if (isBlacklisted) {
      return res.status(401).json({ message: "Not authorized, token revoked" });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "Not authorized, user not found" });
    }
    
    req.user = user;

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

export const isSeller = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "seller") {
      return res.status(403).json({ message: "Not authorized, Forbidden" });
    }
    next();
  } catch (error) {
    console.error("Seller middleware error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
