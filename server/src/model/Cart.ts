import mongoose, { Document, Types } from "mongoose";

interface CartItem {
  ProductId: Types.ObjectId | IProduct;
  quantity: number;
  size: string[];
}

interface CartI extends Document {
  userId: Types.ObjectId;
  items: CartItem[];
}

export interface IProduct {
  _id: string;
  image: string;
  title: string;
  price: number;
  salePrice: number;
}

const CartSchema = new mongoose.Schema<CartI>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        ProductId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        size: {
          type: [String],
        },
      },
    ],
  },
  { timestamps: true }
);

const Cart = mongoose.model<CartI>("Cart", CartSchema);
export default Cart;
