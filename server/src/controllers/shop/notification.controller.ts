import { NextFunction, Request, Response } from "express";
import Notification from "../../model/notification";
import { notificationI } from "../../model/notification";

export const getNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    const notification = await Notification.find({
      $or: [
        {
          type: "global",
        },
        {
          type: "private",
          userId: userId,
        },
      ],
    }).sort({ createAt: -1 });

    // const reult = notification.map((note) => ({
    //   ...note._doc,
    //   isRead: note.readBy.includes(userId),
    // }));
  } catch (error) {
    next(error);
  }
};
