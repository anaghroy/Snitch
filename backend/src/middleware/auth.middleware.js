import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import { redisClient } from "../config/redis.js";

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
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};
