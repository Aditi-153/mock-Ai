import express from "express";
import {
  uploadAudio,
  transcribeAudio,
} from "../controllers/voice.controller.js";

const router = express.Router();

router.post("/transcribe", uploadAudio.single("audio"), transcribeAudio);

export default router;