//! not required

// import { NextFunction, Request, Response } from "express";
// import Product from "../../model/Product";

// export const pagination = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const limit = parseInt(req.query.limit as string) || 10;
//     const page = parseInt(req.query.page as string) || 1;

//     const skip = (page - 1) * limit;
//     const total = await Product.countDocuments();
//     const product = await Product.find().skip(skip).limit(limit);

//     res.status(200).json({
//       product,
//       totalpage: Math.ceil(total / limit),
//       currentPage: page,
//     });
//   } catch (error) {}
// };
