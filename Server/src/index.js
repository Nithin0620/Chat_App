import express from "express";
import auth from "./routes/auth.route.js";
import dotenv from "dotenv";
import { dbConnect } from "./configuration/database.js";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";

dotenv.config();
const PORT = process.env.PORT || 8000;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`server has started and is listening in port NO. : ${PORT}`);
  dbConnect();
});

app.get("/", (req, res) => {
  res.send(
    `<h1> This is homepage, response from server hance the server is up and running <h1/>`
  );
});
