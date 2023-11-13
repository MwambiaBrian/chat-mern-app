import express from "express";
import cors from "cors";
import chats from "./data/data.js";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";
import { Server } from "socket.io";
import path from "path";

const app = express();
app.use(express.json());
dotenv.config();
connectDB();
app.use(cors());

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

//--------------------------Deployment--------------------------
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "frontend", "dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Hello from chatting server");
  });
}

//--------------------------Deployment---------------------------

app.use(notFound);
app.use(errorHandler);

app.get("/api/chat/:id", (req, res) => {
  const singleChat = chats.find((c) => c._id === req.params.id);
  res.send(singleChat);
});

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`--> Server listening on port ${PORT} ...`);
});

//Real-time messaging with socket-io
const io = new Server(server, {
  pingTimeout: 60000,
  cors: { origin: "http://localhost:5173" },
});
io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    // console.log(userData._id);
    socket.emit("connected");

    socket.on("join chat", (room) => {
      socket.join(room);
      console.log(`user joined room: ${room}`);
    });
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
    socket.on("new message", (newMessageReceived) => {
      var chat = newMessageReceived.chat;
      if (!chat.users) return console.log("chat.users not defined");
      chat.users.forEach((user) => {
        if (user._id == newMessageReceived.sender._id) return;
        socket.in(user._id).emit("message received", newMessageReceived);
      });
    });
  });
  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
