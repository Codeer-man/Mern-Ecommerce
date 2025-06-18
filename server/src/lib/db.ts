import mongoose from "mongoose";
import Product from "../model/Product";
import Review from "../model/review";

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

const productIds = [
  "68446c7169b3f34d31923e64",
  "684a51eaadf30565e3eb7a8f",
  "684a54d2adf30565e3eb7b74",
  "68446d0c69b3f34d31923e87",
];

const users = [
  { userId: "681ca378987329c683758217", userName: "Alice Rai" },
  { userId: "6826b0108ac076fb24cbbfd3", userName: "Binod Sharma" },
  { userId: "68373ab60b8e215095fbc15e", userName: "Chirag Lama" },
  { userId: "68500001a1b2c3d4e5f60789", userName: "Dikshya Joshi" },
  { userId: "68500002a1b2c3d4e5f60789", userName: "Erik Thapa" },
  { userId: "68500003a1b2c3d4e5f60789", userName: "Falguni Karki" },
  { userId: "68500004a1b2c3d4e5f60789", userName: "Gaurav Singh" },
  { userId: "68500005a1b2c3d4e5f60789", userName: "Hema Gurung" },
];

const reviewMessages = [
  "Amazing quality, worth every rupee!",
  "Decent product for the price.",
  "Loved it, fast delivery too.",
  "Packaging could have been better.",
  "Quality wasn't what I expected.",
  "Highly recommended!",
  "Good, but expected more features.",
  "Exactly as described, very satisfied.",
  "Value for money!",
  "Would definitely buy again.",
];

const getRandomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomItem = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

export const seedReviews = async () => {
  try {
    await mongoose.connect(URL);
    console.log("📡 Connected to MongoDB");

    await Review.deleteMany();

    const allReviews: any[] = [];

    for (const productId of productIds) {
      const reviewCount = getRandomInt(2, 5);
      const usedUserIds = new Set<string>();
      const productReviews: any[] = [];

      while (productReviews.length < reviewCount) {
        const user = getRandomItem(users);
        if (usedUserIds.has(user.userId)) continue;

        usedUserIds.add(user.userId);

        const review = {
          productId,
          userId: user.userId,
          userName: user.userName,
          reviewMessage: getRandomItem(reviewMessages),
          reviewValue: getRandomInt(1, 5),
        };

        productReviews.push(review);
        allReviews.push(review);
      }

      const avg =
        productReviews.reduce((sum, r) => sum + r.reviewValue, 0) /
        productReviews.length;

      await Product.findByIdAndUpdate(productId, {
        averageReview: avg,
      });
    }

    await Review.insertMany(allReviews);
    console.log(`✅ Seeded ${allReviews.length} reviews for products.`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding reviews", err);
    process.exit(1);
  }
};
