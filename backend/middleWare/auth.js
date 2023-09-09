import JwtServices from "../services/JwtServices.js";
import User from "../models/user.js";

const auth = async (req, res, next) => {
  //fetching accessToken and refreshToken from cookies
  const { accessToken, refreshToken } = req.cookies;

  if (!accessToken || !refreshToken) {
    const error = {
      status: 401,
      message: "unAuthorized!!!!",
    };
    return next(error);
  }
  //verifying accessToken
  let id;
  try {
    id = await JwtServices.verifyAccessToken(accessToken)._id;
  } catch (error) {
    return next(error);
  }
  let user;
  try {
    user = await User.findOne({ _id: id });
  } catch (error) {
    return next(error);
  }
  req.user = user;
  next();
};
export default auth;
