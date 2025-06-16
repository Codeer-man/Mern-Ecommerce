import mongoose from "mongoose";

interface ImageI {
  url: string;
  publicId: string;
}

interface offerI {
  name: string;
  tags: string;
  productId: mongoose.Schema.Types.ObjectId[];
  discountPercentage: number;
  image: Array<ImageI>;
  publish: boolean;
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
    image: [
      {
        url: String,
        publicId: String,
      },
    ],
    productId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart",
      },
    ],
    publish: Boolean,
  },
  { timestamps: true }
);

const Offer = mongoose.model<offerI>("Offer", offerSchema);

export default Offer;
