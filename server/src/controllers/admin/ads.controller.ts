import { NextFunction, Request, Response } from "express";
import Ads from "../../model/Advertisement";
import { ErrorHandler } from "../../utils/ErrorHandler";
import { deleteFromCloudinary } from "../../helpers/upload-cloudinary";

export const createAds = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      title,
      targetUrl,
      imageUrl,
      description,
      isActive,
      endDate,
      publicId,
    } = req.body;

    if (!title || !targetUrl || !imageUrl || !publicId) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const ads = new Ads({
      title,
      targetUrl,
      imageUrl,
      description,
      isActive,
      endDate,
      publicId,
    });
    await ads.save();
    res
      .status(201)
      .json({ success: true, message: "Ads created successfully" });
  } catch (error) {
    console.error("Invalid server error", error);
    next(error);
  }
};

export const getAllAds = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const ads = await Ads.find().sort({ createdAt: -1 });

    res.status(200).json({ ads });
  } catch (error) {
    console.error("Invallid server error", error);
    next(error);
  }
};

export const updateAds = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const { title, targetUrl, imageUrl, description, isActive, endDate } =
      req.body;

    if (!id) {
      throw new ErrorHandler("Ads id is requried", 401, false);
    }

    let findAds = await Ads.findById(id);

    if (!findAds) {
      throw new ErrorHandler("No ads found with this id", 404, false);
    }

    findAds.title = title || findAds.title;
    findAds.targetUrl = targetUrl || findAds.targetUrl;
    findAds.imageUrl = imageUrl || findAds.imageUrl;
    findAds.description = description || findAds.description;
    findAds.isActive = isActive !== null ? isActive : findAds.isActive;
    findAds.endDate = endDate || findAds.endDate;
    await findAds.save();

    res
      .status(200)
      .json({ success: true, message: "Ads updated successfully" });
  } catch (error) {
    console.error("Invalid server error", error);
    next(error);
  }
};

export const deleteAds = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

    if (!id) {
      return next(new ErrorHandler("Ads id is required", 400, false));
    }

    const findAds = await Ads.findById(id);

    if (!findAds) {
      return next(new ErrorHandler("Ads not found", 404, false));
    }

    if (findAds.publicId) {
      try {
        await deleteFromCloudinary(findAds.publicId);
      } catch (cloudError) {
        console.error("Cloudinary deletion failed:", cloudError);
        return next(new ErrorHandler("Failed to delete ad image", 500, false));
      }
    }

    await Ads.findByIdAndDelete(id);

    res
      .status(200)
      .json({ success: true, message: "Ads deleted successfully" });
  } catch (error) {
    console.error("Server error:", error);
    next(error);
  }
};

export const updateIsActive = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (!id) {
      throw new ErrorHandler("Ad id is required", 400, false);
    }

    const findAds = await Ads.findByIdAndUpdate(
      id,
      { isActive },
      {
        new: true,
      }
    );

    if (!findAds) {
      throw new ErrorHandler("No ads found with this id", 404, false);
    }

    res
      .status(200)
      .json({ success: true, message: "Ads status updated", data: findAds });
  } catch (error) {
    console.error("Invalid server error", error);

    next(error);
  }
};

export const adsForUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const ads = await Ads.aggregate([
      { $match: { isActive: true } },
      { $sample: { size: 1 } },
    ]);

    if (!ads || ads.length === 0) {
      throw new ErrorHandler("No active ads available", 404, false);
    }

    res
      .status(200)
      .json({ success: true, message: "Ads fetched for user", data: ads[0] });
  } catch (err) {
    console.error("Invalid serve rerror", err);
    next(err);
  }
};
