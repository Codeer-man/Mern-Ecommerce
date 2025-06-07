import mongoose from "mongoose";

const URL =
  "mongodb+srv://mdrmoney34:mdrmoney34@cluster0.klkq8ku.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

import Review from "../model/review";
import Product from "../model/Product";

export const connectdb = async () => {
  try {
    await mongoose.connect(URL);
    console.log("Database connected");
  } catch (error) {
    console.error("Connection error:", error);
    process.exit(1);
  }
};

// const seedDB = async () => {
//   try {
//     await Review.insertMany(seedReview);
//     console.log("Successfully seeded reviews");
//   } catch (error) {
//     console.error("Seeding error:", error);
//   }
// };

// seedDB();
