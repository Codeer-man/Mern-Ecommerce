import mongoose from "mongoose";

interface IReview extends Document {
  productId: string;
  userId: string;
  userName: string;
  reviewMessage: string;
  reviewValue: number;
}

const productReviewSchema = new mongoose.Schema<IReview>(
  {
    productId: String,
    userId: String,
    userName: String,
    reviewMessage: String,
    reviewValue: Number,
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", productReviewSchema);
export default Review;
