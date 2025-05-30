import mongoose from "mongoose";

interface CartItem {
  productId: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
  isReturned: boolean;
}

interface AddressInfo {
  addressId: string;
  address: string;
  city: string;
  pincode: number;
  phoneNo: number;
  notes: string;
}

enum paymentMethod {
  ESEWA = "esewa",
  KHALTI = "khalti",
}

export interface IOrder extends Document {
  userId: string;
  CartId: string;
  cartItems: CartItem[];
  status: string;
  paymentMethod: paymentMethod;
  paymentStatus: string;
  deliveryCharge: number;
  totalPrice: number;
  purchaseDate?: Date;
}

const purchaseItemSchema = new mongoose.Schema<IOrder>(
  {
    userId: String,
    CartId: String,
    cartItems: [
      {
        productId: String,
        title: String,
        image: String,
        price: Number,
        quantity: Number,
        isReturned: {
          type: Boolean,
          default: false,
        },
      },
    ],

    status: String,
    paymentMethod: {
      type: String,
      enum: paymentMethod,
    },
    paymentStatus: String,
    deliveryCharge: Number,
    totalPrice: Number,
    purchaseDate: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

const PurchaseItem = mongoose.model("Order", purchaseItemSchema);
export default PurchaseItem;
