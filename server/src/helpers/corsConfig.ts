import cors from "cors";

const corsConfig = () => {
  return cors({
    origin: (origin, callback) => {
      const allowedOrigins = process.env.CLIENT_BASE_URL!;
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "DELETE", "PATCH", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
    preflightContinue: false,
  });
};

export default corsConfig;
