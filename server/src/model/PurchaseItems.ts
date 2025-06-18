import mongoose, { Types } from "mongoose";

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
  verifyNumber: boolean;
}

enum paymentMethod {
  ESEWA = "esewa",
  KHALTI = "khalti",
  DELIVERY = "cash on delivery",
}
export enum statusI {
  PENDING = " pending",
  PAID = "Paid",
  FAILED = " failed",
}

export enum ProductI {
  PENDING = "pending",
  INPROCESS = "In Process",
  INSHIPPING = "In Shipping",
  DELIVERED = "Delivered",
  REJECTED = "Rejected",
}

export interface IOrder extends Document {
  cartId: Types.ObjectId;
  cartItems: CartItem[];
  paymentStatus: statusI;
  paymentMethod: paymentMethod;
  deliveryCharge: number;
  totalPrice: number;
  addressInfo: AddressInfo;
  purchaseDate?: Date;
  userId: string;
  productStatus: ProductI;
}

const purchaseItemSchema = new mongoose.Schema<IOrder>(
  {
    cartId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    userId: String,
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

    paymentStatus: {
      type: String,
      enum: statusI,
      default: statusI.PENDING,
    },
    paymentMethod: {
      type: String,
      enum: paymentMethod,
    },
    productStatus: {
      type: String,
      enum: ProductI,
      default: ProductI.PENDING,
    },
    deliveryCharge: Number,
    totalPrice: Number,
    addressInfo: {
      addressId: String,
      address: String,
      city: String,
      pincode: Number,
      phoneNo: Number,
      notes: String,
      verifyNumber: Boolean,
    },
    purchaseDate: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

const PurchaseItem = mongoose.model("Order", purchaseItemSchema);
export default PurchaseItem;
