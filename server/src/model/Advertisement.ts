import mongoose, { Document } from "mongoose";

export interface IAdvertiseMent extends Document {
  title: string;
  targetUrl: string;
  imageUrl: string;
  description: string;
  isActive: boolean;
  startDate: Date;
  endDate: Date;
  publicId: string;
}

const AdvertisementSchema = new mongoose.Schema<IAdvertiseMent>(
  {
    title: {
      type: String,
      reqruied: true,
    },
    targetUrl: {
      type: String,
      reqruied: true,
    },
    imageUrl: {
      type: String,
      reqruied: true,
    },
    description: {
      type: String,
      reqruied: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    publicId: {
      type: String,
    },
    endDate: {
      type: Date,
      default: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  },
  { timestamps: true }
);

const Ads = mongoose.model("Ads", AdvertisementSchema);

export default Ads;
