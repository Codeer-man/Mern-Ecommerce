import mongoose from "mongoose";

const URL = process.env.DATABASE_URL!;

export const connectdb = async () => {
  try {
    if (!URL) {
      throw new Error("URL not found");
    }
    await mongoose.connect(URL);

    console.log("Database connected");
  } catch (error) {
    console.error("Connection error:", error);
    process.exit(1);
  }
};
