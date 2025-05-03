import mongoose from "mongoose";

interface CartItem {
  productId: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
}

interface AddressInfo {
  addressId: string;
  address: string;
  city: string;
  pincode: number;
  phoneNo: number;
  notes: string;
}

export interface IOrder extends Document {
  userId: string;
  CartId: string;
  cartItems: CartItem[];
  addressInfo: AddressInfo;
  oderstatus: string;
  paymentMethod: string;
  paymentStatus: string;
  totalAmount: number;
  orderDate?: Date;
  orderUpdate?: Date;
  paymentId?: string;
  payerId?: string;
}

const orderSchema = new mongoose.Schema<IOrder>(
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
      },
    ],
    addressInfo: {
      addressId: String,
      address: String,
      city: String,
      pincode: Number,
      phoneNo: Number,
      notes: String,
    },
    oderstatus: String,
    paymentMethod: String,
    paymentStatus: String,
    totalAmount: Number,
    orderDate: {
      type: Date,
      default: Date.now(),
    },
    orderUpdate: Date,
    paymentId: String,
    payerId: String,
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
