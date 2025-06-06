import mongoose, { Document } from "mongoose";

interface ProductInfo extends Document {
  title: string;
  subTitle: string;
  description: string;
  image: Array<{
    url: string;
    publicId: string;
  }>;
  category: string;
  brand: string;
  price: number;
  salePrice: number;
  totalStock: number;
  list: boolean;
  size: number[];
}

const productSchema = new mongoose.Schema<ProductInfo>(
  {
    title: String,
    subTitle: String,
    description: String,
    image: [
      {
        url: String,
        publicId: String,
      },
    ],
    category: String,
    brand: String,
    price: Number,
    salePrice: Number,
    totalStock: Number,

    list: {
      type: Boolean,
      default: false,
    },
    size: [Number],
  },
  { timestamps: true }
);

const Product = mongoose.model<ProductInfo>("Product", productSchema);
export default Product;
