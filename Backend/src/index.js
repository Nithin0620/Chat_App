import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path";

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);


app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Catch-all
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend" , "dist" , "index.html"));
});


server.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});

app.get("/" , (req,res)=>{
   res.send(`<h1> This is homepage, response from server hance the server is up and running <h1/>`)
})