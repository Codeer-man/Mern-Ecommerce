import mongoose from "mongoose";

interface ProductInfo extends Document {
  title: string;
  description: string;
  image: string;
  category: string;
  brand: string;
  price: number;
  salePrice: number;
  totalStock: number;
}

const productSchema = new mongoose.Schema<ProductInfo>(
  {
    title: String,
    description: String,
    image: String,
    category: String,
    brand: String,
    price: Number,
    salePrice: Number,
    totalStock: Number,
  },
  { timestamps: true }
);

const Product = mongoose.model<ProductInfo>("Product", productSchema);
export default Product;
