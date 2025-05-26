import mongoose, { Types } from "mongoose";

interface IReview extends Document {
  productId: string;
  userId: string;
  userName: string;
  reviewMessage: string;
  reviewValue: number;
  reply?: string;
}

const productReviewSchema = new mongoose.Schema<IReview>(
  {
    productId: {
      type: mongoose.Schema.Types.String,
      ref: "Product",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.String,
      ref: "User",
      required: true,
    },
    userName: String,
    reviewMessage: String,
    reviewValue: Number,
    reply: String,
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", productReviewSchema);
export default Review;
