import dotenv from "dotenv";
dotenv.config();
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";

import { errorHandler } from "./middleware/errorHandlin.middleware";
import authRoutes from "./routes/auth/auth.routes";
import adminProducts from "./routes/admin/product.routes";
import shopProductRoutes from "./routes/shop/products.routes";
import cookieParser from "cookie-parser";
import OauthRoutes from "./routes/oauth/google.routes";
import cartRoutes from "./routes/cart/Cart.Routes";
import addressRoutes from "./routes/shop/address.routes";
import orderRouter from "./routes/shop/order.routes";
import AdvertisementFeature from "./routes/admin/advertisement.routes";
import AdminOrderRouter from "./routes/admin/order.routes";
import productSearchRoutes from "./routes/shop/search.routes";
import productReview from "./routes/shop/review.route";
import AdminFeatureRoute from "./routes/admin/feature.route";
import ReviewRoutes from "./routes/admin/review.route";
import verifyEmailRoute from "./routes/auth/email.route";
import AdminOfferRoute from "./routes/admin/offer.route";

// db
import { connectdb } from "./lib/db";
import Redis from "ioredis";
import { RateLimiterRedis } from "rate-limiter-flexible";
import corsConfig from "./helpers/corsConfig";

const app = express();

app.use(corsConfig());
// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST", "DELETE", "PATCH", "PUT"],
//     allowedHeaders: [
//       "Content-Type",
//       "Authorization",
//       "Cache-Control",
//       "Expires",
//       "Pragma",
//     ],
//     credentials: true,
//   })
// );

app.use(express.json());
app.use(cookieParser());

const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
  console.error("REDIS_URL is not defined in the .env file!");
  process.exit(1);
}

export const redisClient = new Redis(redisUrl);

// ddos attack prevent
const rateLimiterRedis = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "my-app-rate-limiter",
  points: 10,
  duration: 1,
});

app.use((req: Request, res: Response, next: NextFunction) => {
  rateLimiterRedis
    .consume(req.ip as string)
    .then(() => next())
    .catch(() => {
      console.error(`Rate limit exceeded for ${req.ip} on ${req.originalUrl}`);
      res.status(429).json({ message: "Request limit exceeded" });
    });
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/email", verifyEmailRoute);
app.use("/api/admin/product", adminProducts);
app.use("/api/admin/order", AdminOrderRouter);
app.use("/api/admin/feature", AdminFeatureRoute);
app.use("/api/admin/ads", AdvertisementFeature);
app.use("/api/admin/review", ReviewRoutes);
app.use("/api/admin/offer", AdminOfferRoute);

app.use("/api/auth/o-auth", OauthRoutes);

app.use("/api/shop/product", shopProductRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/shop/address", addressRoutes);

app.use("/api/shop/order", orderRouter);

app.use("/api/product/search", productSearchRoutes);
app.use("/api/product/review", productReview);

connectdb();

app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening to PORT ${PORT}`);
});
