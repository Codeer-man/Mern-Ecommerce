import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../../utils/ErrorHandler";
import { NOT_FOUND } from "../../constants/http";
import Address from "../../model/Address";
import User from "../../model/User";

export const addAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      UserId,
      Address: addressField,
      PhoneNo,
      Pincode,
      City,
      Notes,
    } = req.body;

    if (!UserId || !Address || !PhoneNo || !Pincode || !City || !Notes) {
      throw new ErrorHandler("All the fields are required", NOT_FOUND, false);
    }

    const findUser = await User.findById(UserId);

    const newAddress = new Address({
      UserId,
      email: findUser?.email,
      Address: addressField,
      PhoneNo,
      Pincode,
      City,
      Notes,
    });

    await newAddress.save();

    res.status(200).json({
      success: true,
      message: "new address has been added",
      data: newAddress,
    });
  } catch (error) {
    next(error);
  }
};

export const fetchAllAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!userId) {
      throw new ErrorHandler("User Id is required", NOT_FOUND, false);
    }

    const findUser = await Address.find({ UserId: userId });

    if (!findUser) {
      throw new ErrorHandler("user not found", 404, false);
    }

    res.status(200).json({
      success: true,
      message: "address data",
      data: findUser,
    });
  } catch (error) {
    next(error);
  }
};

export const editAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { addressId, userId } = req.params;
    const formdata = req.body;

    if (!userId || !addressId) {
      throw new ErrorHandler("user id and address id is require", 404, false);
    }

    const updateUserAddress = await Address.findOneAndUpdate(
      { _id: addressId, UserId: userId },
      formdata,
      { new: true }
    );

    if (!updateUserAddress) {
      throw new ErrorHandler(
        "User address id or user Id not found",
        404,
        false
      );
    }

    res.status(200).json({
      success: true,
      message: "address updated",
      data: updateUserAddress,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { addressId, userId } = req.params;

    if (!userId || !addressId) {
      throw new ErrorHandler("user id and address id is require", 404, false);
    }

    const deleteUserAddress = await Address.findOneAndDelete({
      _id: addressId,
      UserId: userId,
    });

    if (!deleteUserAddress) {
      throw new ErrorHandler(
        "User address id or user Id not found",
        404,
        false
      );
    }

    res.status(200).json({
      success: true,
      message: "address updated",
      data: deleteUserAddress,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyNumber = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { addressId } = req.params;

    const findAddress = await Address.findById(addressId);

    if (!findAddress) {
      throw new ErrorHandler("User address data not found", 404, false);
    }

    const otp = Math.ceil(100000 + Math.random() * 90000).toString();
    findAddress.otp = otp;
    await findAddress.save();
  } catch (error) {}
};
