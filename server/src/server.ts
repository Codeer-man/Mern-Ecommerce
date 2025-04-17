import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();

app.use(
  cors({
    origin: "localhost://5073",
    methods: ["GET", "POST", "DELETE", "PATCH", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Auhorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

mongoose
  .connect("mongodb://localhost:27017/E-commerce")
  .then(() => console.log("Database connectred"))
  .catch((e) => console.log("Datasebase not connected", e));

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server listening to PORT ${PORT}`);
});
