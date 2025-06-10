import mongoose, { Types, Schema } from "mongoose";

enum msgType {
  GLOBAL = "global",
  PRIVATE = "private",
}

export interface notificationI {
  message: string;
  userId: Types.ObjectId[];
  type: msgType;
  readBy: [Types.ObjectId];
}

const notificationSchema = new Schema<notificationI>(
  {
    message: {
      type: String,
      required: true,
    },
    userId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    type: {
      type: String,
      enum: msgType,
      default: msgType.GLOBAL,
    },
    readBy: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model<notificationI>(
  "notification",
  notificationSchema
);

export default Notification;
