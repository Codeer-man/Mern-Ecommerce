import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { errorHandler } from "./middleware/errorHandlin.middleware";
import authRoutes from "./routes/auth/auth.routes";
import adminProducts from "./routes/admin/product.routes";
import cookieParse from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PATCH", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParse());
// routes
app.use("/api/auth", authRoutes);
app.use("/api/admin/product", adminProducts);

mongoose
  .connect("mongodb://localhost:27017/E-commerce")
  .then(() => console.log("Database connectred"))
  .catch((e) => console.log("Datasebase not connected", e));

app.use(errorHandler);
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening to PORT ${PORT}`);
});
