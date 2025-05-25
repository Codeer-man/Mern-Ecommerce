import { NextFunction, Request, Response } from "express";
import Feature from "../../model/feature";

export const addFeatureImage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { image } = req.body;

    const upload = new Feature({
      image,
    });

    await upload.save();

    res
      .status(200)
      .json({ success: true, message: "Photo added", data: image });
  } catch (error) {
    next(error);
  }
};

export const getFeatureImage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const image = await Feature.find({});

    res
      .status(200)
      .json({ success: true, message: "Photo added", data: image });
  } catch (error) {
    next(error);
  }
};

export const deleteImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

    await Feature.findByIdAndDelete(id);
  } catch (error) {}
};
