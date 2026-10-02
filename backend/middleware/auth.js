import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.userToken;

    if (!token) {
      return res.status(401).json({
        message: "Please log in first",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY
    );

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log("AUTH ERROR:", error.message);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};