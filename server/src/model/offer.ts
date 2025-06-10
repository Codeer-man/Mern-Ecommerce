import mongoose from "mongoose";

interface offerI {
  name: string;
  tags: string;
  productId: mongoose.Schema.Types.ObjectId[];
  discountPercentage: number;
}

const offerSchema = new mongoose.Schema<offerI>(
  {
    name: {
      type: String,
      requried: true,
    },
    tags: {
      type: String,
      required: true,
    },
    discountPercentage: {
      type: Number,
      required: true,
    },
    productId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

const Offer = mongoose.model<offerI>("Offer", offerSchema);

export default Offer;
