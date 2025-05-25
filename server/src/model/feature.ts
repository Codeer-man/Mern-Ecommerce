import mongoose from "mongoose";

interface IFeature extends Document {
  image: string;
  publicId:string
}

const featureSchema = new mongoose.Schema<IFeature>(
  {
    image: String,
    publicId:String,
  },
  { timestamps: true }
);

const Feature = mongoose.model("Feature", featureSchema);
export default Feature;
