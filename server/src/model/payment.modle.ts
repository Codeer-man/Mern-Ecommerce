import mongoose from "mongoose";

const paymentschema = new mongoose.Schema({
  transactionId: {
    type: String,
    unique: true,
  },
  pidx: {
    type: String,
    unique: true,
  },
});
