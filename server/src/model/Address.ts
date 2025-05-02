import mongoose from "mongoose";

interface IuserAddress extends Document {
  UserId: string;
  Address: string;
  PhoneNo: number;
  Pincode: number;
  City: string;
  Notes: string;
}

const addressSchema = new mongoose.Schema<IuserAddress>(
  {
    UserId: { type: String, ref: "user" },
    Address: String,
    PhoneNo: Number,
    Pincode: Number,
    City: String,
    Notes: String,
  },
  { timestamps: true }
);

const Address = mongoose.model("Address", addressSchema);
export default Address;
