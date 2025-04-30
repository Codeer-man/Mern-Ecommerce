import mongoose, { Types } from "mongoose";

interface CartI extends Document {
  userId: Types.ObjectId;
  items: CartItem[];
}
export interface IProduct {
  _id: Types.ObjectId;
  image: string;
  title: string;
  price: number;
  salePrice?: number;
}
interface CartItem {
  ProductId: IProduct;
  quantity: number;
}

const CartSchema = new mongoose.Schema<CartI>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      require: true,
    },
    items: [
      {
        ProductId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          require: true,
        },
        quantity: {
          type: Number,
          require: true,
          min: 1,
        },
      },
    ],
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", CartSchema);
export default Cart;
