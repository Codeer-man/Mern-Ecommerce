import mongoose, { Document } from "mongoose";
interface ImageI {
  url: string;
  publicId: string;
}

export interface IAdvertiseMent extends Document {
  title: string;
  targetUrl: string;
  image: Array<ImageI>;
  description: string;
  isActive: boolean;
  startDate: Date;
  endDate: Date;
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
    image: [
      {
        url: String,
        publicId: String,
      },
    ],
    description: {
      type: String,
      reqruied: true,
    },
    isActive: {
      type: Boolean,
      default: false,
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
