import express from "express";
import cors from "cors";
import chats from "./data/data.js";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
app.use(express.json());
dotenv.config();
connectDB();
app.use(cors());
app.get("/", (req, res) => {
  res.send("Hello from chatting server");
});

app.use("/api/user", userRoutes);

app.get("/api/chat/:id", (req, res) => {
  const singleChat = chats.find((c) => c._id === req.params.id);
  res.send(singleChat);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`--> Server listening on port ${PORT} ...`);
});
