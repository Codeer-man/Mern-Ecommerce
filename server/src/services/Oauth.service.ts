import User, { UserI } from "../model/User";
import { ErrorHandler } from "../utils/ErrorHandler";
import { tokenGenerate } from "../utils/tokenGenerator";

interface UserData {
  email: string;
  provider: "google" | "github";
  username: string;
  oauthId: string;
}

interface OauthResponse {
  user: UserI;
  accessToken: string;
  refreshAccessToken: string;
}

export const getUserWithOauthId = async ({
  email,
  provider,
  username,
  oauthId,
}: UserData): Promise<OauthResponse> => {
  if (!email || !provider || !username || !oauthId) {
    throw new ErrorHandler("Missing required OAuth fields", 400, false);
  }

  let user = await User.findOne({ email, provider });
  if (user) {
    const { accessToken, refreshAccessToken } = tokenGenerate({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    return { user, accessToken, refreshAccessToken };
  }

  const existingUser = await User.findOne({ email, provider: "local" });
  if (existingUser) {
    throw new ErrorHandler(
      "An account with this email already exists. Please login with email and password!",
      400,
      false
    );
  }

  const createdUser = await User.create({
    username,
    provider,
    email,
    [`${provider}Id`]: oauthId,
    role: "user",
  });

  const { accessToken, refreshAccessToken } = tokenGenerate({
    id: createdUser._id,
    email: createdUser.email,
    role: createdUser.role,
  });

  return { user: createdUser, accessToken, refreshAccessToken };
};
