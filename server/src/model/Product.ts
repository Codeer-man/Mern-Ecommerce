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
  sizes: string[];
  tags: string[];
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
    salePrice: {
      type: Number,
      default: 0,
    },
    totalStock: Number,

    list: {
      type: Boolean,
      default: false,
    },
    sizes: {
      type: [String],
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const Product = mongoose.model<ProductInfo>("Product", productSchema);
export default Product;
