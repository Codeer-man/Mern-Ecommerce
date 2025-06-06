import mongoose from "mongoose";

interface IuserAddress extends Document {
  UserId: string;
  Address: string;
  PhoneNo: number;
  Pincode: number;
  City: string;
  Notes: string;
  verifyNumber: boolean;
  otp: string;
}

const addressSchema = new mongoose.Schema<IuserAddress>(
  {
    UserId: { type: String, ref: "user" },
    Address: String,
    PhoneNo: Number,
    Pincode: Number,
    City: String,
    Notes: String,
    otp: String,
    verifyNumber: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Address = mongoose.model("Address", addressSchema);
export default Address;
