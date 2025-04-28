import mongoose, { Schema, Document, Model, Types } from "mongoose";
import bcrypt from "bcrypt";

enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

export interface UserI extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password?: string;
  googleId?: string;
  githubId?: string;
  provider: "local" | "github" | "google";
  role: UserRole;
  avatar?: string;
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
        return this.provider === "local"; // required only for local users
      },
      trim: true,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    githubId: {
      type: String,
    },
    googleId: {
      type: String,
    },
    provider: {
      type: String,
      enum: ["local", "google", "github"],
      required: true,
      default: "local",
    },
    avatar: {
      type: String,
    },
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
