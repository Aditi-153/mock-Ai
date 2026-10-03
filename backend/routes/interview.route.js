import express from "express";

import {
  completeInterview,
  createInterview,
  deleteInterview,
  getInterviewById,
  getMyInterview,
  updateInterview,
  updateQuestionAnswer,
} from "../controllers/interview.controller.js";

import { userAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", userAuth, createInterview);
router.get("/", userAuth, getMyInterview);
router.get("/:id", userAuth, getInterviewById);
router.patch("/:id", userAuth, updateInterview);
router.delete("/:id", userAuth, deleteInterview);
router.patch("/:id/questions/:questionId", userAuth, updateQuestionAnswer);
router.patch("/:id/complete", userAuth, completeInterview);

export default router;
