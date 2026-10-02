import express from "express";

import {
  registerUser,
  loginUser,
  userProfile,
  userLogout,
} from "../controllers/auth.controller.js";

import { userAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/profile", userAuth, userProfile);

router.post("/logout", userLogout);

export default router;