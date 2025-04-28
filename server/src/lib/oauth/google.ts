import { Google } from "arctic";
import { ErrorHandler } from "../../utils/ErrorHandler";

if (!process.env.GOOGLE_CLIENT_ID) {
  throw new ErrorHandler("Env not found or required", 400, false);
}
if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new ErrorHandler("Env not found or required", 400, false);
}

export const google = new Google(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http://localhost:5173/google/callback" // create this route to verify after login
);
