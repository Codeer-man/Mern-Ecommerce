import mongoose from "mongoose";

interface IFeature extends Document {
  image: string;
  publicId: string;
}

interface ImageI {
  url: string;
  publicId: string;
  image: Array<ImageI>;
}

const featureSchema = new mongoose.Schema<IFeature>(
  {
    image: [
      {
        url: String,
        publicId: String,
      },
    ],
    publicId: String,
  },
  { timestamps: true }
);

const Feature = mongoose.model("Feature", featureSchema);
export default Feature;
