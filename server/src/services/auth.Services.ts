import { Types } from "mongoose";
import User from "../model/User";

export const compareEmailAndUserName = (username: string, email: string) => {
  return User.findOne({ $or: [{ username }, { email }] });
};

export const findUserById = (id: Types.ObjectId | string) => {
  return User.findById(id);
};
