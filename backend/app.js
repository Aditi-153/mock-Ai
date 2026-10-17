import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
import userRoutes from "./routes/user.route.js";
import interviewRoutes from "./routes/interview.route.js";
import cors from "cors";
import voiceRoute from "./routes/voice.routes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.get("/", (req, res) => {
  res.send("backend running..");
});

app.use("/api/auth", userRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/voice", voiceRoute);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongDb connected");

    app.listen(PORT, () => {
      console.log(`server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log("mongoDb connection failed", error);
  });
