import Joi from "joi";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import JwtServices from "../services/JwtServices.js";
import RefreshToken from "../models/token.js";
const passwordPattren =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ -/:-@\[-`{-~]).{6,64}$/;
const authController = {
  //create register method
  async register(req, res, next) {
    //validate user input
    const userRegisterSchema = Joi.object({
      username: Joi.string().min(5).max(30).required(),
      name: Joi.string().max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().pattern(passwordPattren).required(),
    });
    const { error } = userRegisterSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { username, name, email, password } = req.body;

    //password hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    //handle username and email conflict
    try {
      const emailInUse = await User.exists({ email });
      const usernameInUse = await User.exists({ username });

      if (emailInUse) {
        const error = {
          status: 409,
          message: "email is already in use please use an other email!!!",
        };
        return next(error);
      }
      if (usernameInUse) {
        const error = {
          status: 409,
          message:
            "username is not available please choose an other username!!!",
        };
        return next(error);
      }
    } catch (error) {
      return next(error);
    }
    //saving to the database
    let user;
    try {
      const userToRegister = new User({
        username,
        name,
        email,
        password: hashedPassword,
      });
      user = await userToRegister.save();
    } catch (error) {
      return next(error);
    }
    const accessToken = JwtServices.signAccessToken({ _id: user._id }, "30m");
    const refreshToken = JwtServices.signRefreshToken({ _id: user._id }, "60m");
    //store RefreshToken in database
    await JwtServices.storeRefreshToken({ _id: user._id, token: refreshToken });
    //sending tokens to the cookies
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
    //sending response
    res.status(201).json({ user, auth: true });
  },
  //login method
  async login(req, res, next) {
    //validate user input
    const userLoginSchema = Joi.object({
      username: Joi.string().min(5).max(30).required(),
      password: Joi.string().pattern(passwordPattren).required(),
    });
    const { error } = userLoginSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { username, password } = req.body;
    let user;
    try {
      user = await User.findOne({ username });
      if (!user) {
        const error = {
          status: 401,
          message: "invalid user!",
        };
        return next(error);
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        const error = {
          status: 401,
          message: "invalid password!",
        };
        return next(error);
      }
    } catch (error) {
      return next(error);
    }

    //genrate tokens
    const accessToken = JwtServices.signAccessToken({ _id: user._id }, "30m");
    const refreshToken = JwtServices.signRefreshToken({ _id: user._id }, "60m");
    //update refreshtoken to the database
    try {
      await RefreshToken.updateOne(
        { _id: user._id },
        { token: refreshToken },
        { upsert: true }
      );
    } catch (error) {
      return next(error);
    }
    //sending tokens to the database
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
    //sending response
    res.status(200).json({ user, auth: true });
  },
  //logout method
  async logout(req, res, next) {
    //fetching refreshToken from cookies
    const { refreshToken } = req.cookies;
    //delete refreshToken from database
    await RefreshToken.deleteOne({ token: refreshToken });
    //clearcookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    //sending response
    res.status(200).json({ user: null, auth: false });
  },

  //refresh method
  async refresh(req, res, next) {
    //fetching refreshToken from database
    const originalRefreshToken = req.cookies.refreshToken;
    let _id;
    try {
      _id = await JwtServices.verifyRefreshToken(originalRefreshToken)._id;
    } catch (error) {
      const e = {
        status: 401,
        message: "unAuthorized!!",
      };
      return next(e);
    }
    try {
      const match = await RefreshToken.findOne({
        _id,
        token: originalRefreshToken,
      });
      if (!match) {
        const error = {
          status: 401,
          message: "unAuthorized!!!",
        };
        return next(error);
      }
    } catch (error) {
      return next(error);
    }
    //gerate token
    const accessToken = JwtServices.signAccessToken({ _id }, "30m");
    const refreshToken = JwtServices.signRefreshToken({ _id }, "60m");
    //update refreshtoken
    await RefreshToken.updateOne({ _id }, { token: refreshToken });
    //sending Tokens to the cookies
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
    //sending response
    const user = await User.findOne({ _id });
    res.status(200).json({ user, auth: true });
  },
};
export default authController;
