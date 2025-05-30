import mongoose, { Schema, Document, Model, Types } from "mongoose";
import bcrypt from "bcrypt";
import { string } from "zod";

enum UserRole {
  ADMIN = "admin",
  USER = "user",
}
enum Provider {
  LOCAL = "local",
  GOOGLE = "google",
}

export interface UserI extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password?: string;
  googleId?: string;
  provider: Provider;
  emailVerify: boolean;
  role: UserRole;
  avatar: string;
  verificationCode: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<UserI>(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: function (this: UserI) {
        return this.provider === "local"; // password only required for local
      },
      trim: true,
    },
    googleId: {
      type: String,
    },
    provider: {
      type: String,
      enum: Provider,
      required: true,
      default: Provider.LOCAL,
    },
    role: {
      type: String,
      enum: UserRole,
      default: UserRole.USER,
    },
    emailVerify: {
      type: Boolean,
      default: false,
    },
    verificationCode: String,
    avatar: String,
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre<UserI>("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    console.error("Hashing error:", error);
    next(error);
  }
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User: Model<UserI> = mongoose.model<UserI>("User", UserSchema);

export default User;
