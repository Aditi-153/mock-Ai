import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();

const PORT = process.env.POST || 3000;

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("backend running..");
});

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
