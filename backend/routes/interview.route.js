import express from "express";

import {
  createInterview,
  deleteInterview,
  getInterviewById,
  getMyInterview,
  updateInterview,
} from "../controllers/interview.controller.js";

import { userAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", userAuth, createInterview);
router.get("/", userAuth, getMyInterview);
router.get("/:id", userAuth, getInterviewById);
router.patch("/:id", userAuth, updateInterview);
router.delete("/:id", userAuth, deleteInterview);
export default router;
