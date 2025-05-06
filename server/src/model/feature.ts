import mongoose from "mongoose";

interface IFeature extends Document {
  image: string;
}

const featureSchema = new mongoose.Schema<IFeature>(
  {
    image: String,
  },
  { timestamps: true }
);

const Feature = mongoose.model("Feature", featureSchema);
export default Feature;
