import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import { redisClient } from "../config/redis.js";

async function sendTokenResponse(user, res, message) {
  const token = jwt.sign(
    {
      id: user._id,
    },
    config.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.status(200).json({
    message,
    success: true,
    user: {
      id: user._id,
      email: user.email,
      contact: user.contact,
      fullname: user.fullname,
      role: user.role,
    },
  });
}

export const register = async (req, res) => {
  const { email, contact, password, fullname, isSeller } = req.body;

  try {
    const existingUser = await userModel.findOne({
      $or: [{ email }, { contact }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email or contact already exists" });
    }

    const user = await userModel.create({
      email,
      contact,
      password,
      fullname,
      role: isSeller ? "seller" : "buyer",
    });

    await sendTokenResponse(user, res, "User registered successfully");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  await sendTokenResponse(user, res, "User logged in successfully");
};

export const getMe = async (req, res) => {
  const user = await userModel.findById(req.user.id);
  res.status(200).json({
    message: "User details fetched successfully",
    user,
  });
}

export const googleCallback = async (req, res) => {
  try {
    const profile = req.user;
    
    const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
    const fullname = profile.displayName || "Google User";
    const googleId = profile.id;

    if (!email) {
      return res.status(400).json({ message: "No email associated with this Google account" });
    }

    let user = await userModel.findOne({ email });

    if (!user) {
      user = await userModel.create({
        email,
        fullname,
        googleId,
        role: "buyer"
      });
    } else if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
    }

    await sendTokenResponse(user, res, "Logged in with Google successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during Google auth" });
  }
};

export const githubCallback = async (req, res) => {
  try {
    const profile = req.user;
    
    const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : `${profile.username}@github.com`;
    const fullname = profile.displayName || profile.username;
    const githubId = profile.id;

    let user = await userModel.findOne({ email });

    if (!user) {
      user = await userModel.create({
        email,
        fullname,
        githubId,
        role: "buyer"
      });
    } else if (!user.githubId) {
      user.githubId = githubId;
      await user.save();
    }

    await sendTokenResponse(user, res, "Logged in with GitHub successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during GitHub auth" });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.cookies?.token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    if (!token) {
      return res.status(400).json({ message: "No token provided" });
    }

    const decoded = jwt.decode(token);
    
    if (decoded && decoded.exp) {
      const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
      
      if (expiresIn > 0) {
        await redisClient.setEx(`blacklist:${token}`, expiresIn, "blacklisted");
      }
    }

    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during logout" });
  }
};
