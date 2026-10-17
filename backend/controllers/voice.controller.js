import multer from "multer";
import OpenAI from "openai";
import { success } from "zod";

export const uploadAudio = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

const ai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export const transcribeAudio = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Audio file required",
      });
    }

    const transcription = await ai.audio.transcriptions.create({
      file: new File([req.file.buffer], "recording.wav", {
        type: "audio/wav",
      }),
      model: "whisper-large-v3-turbo",
    });

    return res.status(200).json({
      success: true,
      transcript: transcription.text,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "failed to transcribe audio",
    });
  }
};
