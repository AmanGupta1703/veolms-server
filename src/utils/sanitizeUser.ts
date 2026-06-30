import { IUser } from "../models/User";

export const sanitizeUser = (user: IUser) => {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    isVerified: user.isVerified,
  };
};
