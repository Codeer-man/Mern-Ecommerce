import mongoose from "mongoose";

const URL =
  "mongodb+srv://mdrmoney34:mdrmoney34@cluster0.klkq8ku.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

import Review from "../model/review";

export const connectdb = async () => {
  try {
    await mongoose.connect(URL);
    console.log("Database connected");
  } catch (error) {
    console.error("Connection error:", error);
    process.exit(1);
  }
};

const seedReview = [
  {
    productId: new mongoose.Types.ObjectId("5f8d8a7b2f4d1c3e6b9a2c7d"),
    userId: new mongoose.Types.ObjectId("6a7b8c9d0e1f2a3b4c5d6e7f"),
    userName: "alex_johnson",
    reviewMessage:
      "Great product! Works perfectly and exceeded my expectations.",
    reviewValue: 5,
    reply:
      "Thank you for your kind words! We're thrilled you're enjoying our product.",
    createdAt: new Date("2025-04-10T08:15:30.000Z"),
    updatedAt: new Date("2025-04-12T14:22:45.000Z"),
    __v: 0,
  },
  {
    productId: new mongoose.Types.ObjectId("6b5c4d3e2f1a0b9c8d7e6f5a"),
    userId: new mongoose.Types.ObjectId("9a8b7c6d5e4f3a2b1c0d9e8f"),
    userName: "maya_patel",
    reviewMessage:
      "Average quality. The product could be improved in several areas.",
    reviewValue: 3,
    reply:
      "We appreciate your feedback and will work on improving these aspects.",
    createdAt: new Date("2025-03-22T11:45:15.000Z"),
    updatedAt: new Date("2025-03-25T09:30:22.000Z"),
    __v: 0,
  },
  {
    productId: new mongoose.Types.ObjectId("1a2b3c4d5e6f7a8b9c0d1e2f"),
    userId: new mongoose.Types.ObjectId("3a4b5c6d7e8f9a0b1c2d3e4f"),
    userName: "david_kim",
    reviewMessage:
      "Absolutely terrible! The product broke after just 2 days of use.",
    reviewValue: 1,
    reply:
      "We're very sorry to hear about your experience. Please contact our support team for a replacement.",
    createdAt: new Date("2025-05-05T16:30:45.000Z"),
    updatedAt: new Date("2025-05-07T10:15:33.000Z"),
    __v: 0,
  },
  {
    productId: new mongoose.Types.ObjectId("7a8b9c0d1e2f3a4b5c6d7e8f"),
    userId: new mongoose.Types.ObjectId("2a3b4c5d6e7f8a9b0c1d2e3f"),
    userName: "sarah_williams",
    reviewMessage:
      "Good value for money. Works as described with minor issues.",
    reviewValue: 4,
    reply:
      "Thanks for your review! We're glad you're satisfied with your purchase.",
    createdAt: new Date("2025-02-18T09:20:10.000Z"),
    updatedAt: new Date("2025-02-20T13:45:28.000Z"),
    __v: 0,
  },
  {
    productId: new mongoose.Types.ObjectId("9a0b1c2d3e4f5a6b7c8d9e0f"),
    userId: new mongoose.Types.ObjectId("4a5b6c7d8e9f0a1b2c3d4e5f"),
    userName: "james_rodriguez",
    reviewMessage: "Excellent product! Fast delivery and perfect condition.",
    reviewValue: 5,
    reply: "We're so happy you love it! Thank you for choosing our product.",
    createdAt: new Date("2025-01-15T14:10:05.000Z"),
    updatedAt: new Date("2025-01-15T14:10:05.000Z"),
    __v: 0,
  },
];

const seedDB = async () => {
  try {
    await Review.insertMany(seedReview);
    console.log("Successfully seeded reviews");
  } catch (error) {
    console.error("Seeding error:", error);
  }
};

// seedDB();
