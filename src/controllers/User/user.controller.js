import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { User } from "../../models/user.model.js";
import { uploadOnCloudinary } from "../../utils/cloudinaryFileUpload.js";
import { redisClient } from "../../utils/init_redis.js";
import {
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
} from "../../utils/jwtHelper.js";
import { deleteCookie, setCookie } from "../../utils/setCookie.js";
import { sendEmail } from "../../utils/mailer.js";

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, userName, password } = req.body;
  const files = req.files;

  let existingUsr = await User.findOne({
    $or: [{ email }, { userName }],
  });

  if (existingUsr) {
    res.status(400).json(new ApiError(400, "User already exists"));
  }
  //upload the photo on cloudinary
  let remoteAvatar = {
    url: "",
  };
  let remoteCover = {
    url: "",
  };
  if (files === undefined) {
    const avatarPath = files.avatar[0].path;
    const coverImagePath = files.coverImage[0].path;
    remoteAvatar = await uploadOnCloudinary(avatarPath);
    remoteCover = await uploadOnCloudinary(coverImagePath);
  }

  const adminRole = email === "shishirgaire35@gmail.com" ? "admin" : "user";
  const usr = await User.create({
    fullName,
    email,
    userName,
    password,
    role: adminRole,
    avatar: remoteAvatar.url,
    coverImage: remoteCover.url,
  });

  const createdUser = await User.findById(usr._id).select("-password");
  if (usr) {
    res.status(201).json(
      new ApiResponse(
        201,
        {
          ...createdUser._doc,
        },
        "User registered successfully"
      )
    );
  } else {
    res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const searchedUser = await User.findOne({ email });
  if (!searchedUser) {
    res.status(400).json(new ApiError(400, "User with that email not found"));
    return;
  } else {
    const isPasswordCorrect = await searchedUser.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
      res.status(400).json(new ApiError(400, "Invalid credentials"));
      return;
    } else if (!searchedUser.isVerified) {
      res.status(401).json(new ApiError(401, "Please verify your email first"));
      return;
    } else {
      //generate access token and refresh token
      let aToken = generateAccessToken(searchedUser._id);
      let rToken = await generateRefreshToken(searchedUser._id);
      if (aToken === null || rToken === null) {
        res.status(500).json(new ApiError(500, "Internal Server Error"));
      } else {
        setCookie(res, "refreshToken", rToken);
        setCookie(res, "accessToken", aToken);
        res.status(200).json(
          new ApiResponse(200, {
            accessToken: aToken,
            refreshToken: rToken,
            user: searchedUser,
          })
        );
        return;
      }
    }
  }
});

const sendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const searchedUser = await User.findOne({ email });
  if (!searchedUser) {
    res.status(400).json(new ApiError(400, "User with that email not found"));
    return;
  } else if (searchedUser.isVerified) {
    res
      .status(400)
      .json(new ApiError(400, "User with that email already verified"));
    return;
  } else {
    try {
      await sendEmail({ email: email });
      res.status(200).json(new ApiResponse(200, "Otp sent successfully"));
    } catch (error) {
      res.status(500).json(new ApiError(500, "Failed to send otp."));
    }
  }
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const searchedUser = await User.findOne({ email });
  if (!searchedUser) {
    res.status(400).json(new ApiError(400, "User with that email not found"));
    return;
  } else if (searchedUser.isVerified) {
    res
      .status(400)
      .json(new ApiError(400, "User with that email already verified"));
    return;
  } else {
    let redisOtp = await redisClient.get(`otp:${email}`);
    if (redisOtp === otp) {
      searchedUser.isVerified = true;
      await redisClient.del(`otp:${email}`);
      await searchedUser.save();
      res.status(200).json(new ApiResponse(200, "User verified successfully"));
    } else {
      res.status(400).json(new ApiError(400, "Invalid otp"));
    }
  }
});

const generateNewRefreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies ?? req.body;
  const userId = await verifyRefreshToken(refreshToken);
  if (userId === null) {
    res.status(401).json({
      message: new ApiError(401, "Unauthorized").message,
    });
  } else {
    const aToken = generateAccessToken(userId);
    const rToken = await generateRefreshToken(userId);
    if (aToken === null || rToken === null) {
      res.status(500).json(new ApiError(500, "Internal Server Error"));
    } else {
      setCookie(res, "refreshToken", rToken);
      setCookie(res, "accessToken", aToken);
      res.json({
        accessToken: aToken,
        refreshToken: rToken,
      });
    }
  }
});

const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies ?? req.body;
  if (!refreshToken) {
    res.status(401).json(new ApiError(401, "Unauthorized"));
    return;
  }
  const userId = await verifyRefreshToken(refreshToken);
  if (userId === null) {
    res.status(401).json(new ApiError(401, "Unauthorized"));
    return;
  } else {
    try {
      await redisClient.del(userId.toString());
      deleteCookie(res, "refreshToken");
      deleteCookie(res, "accessToken");
      res.json(new ApiResponse(200, "User logged out successfully"));
    } catch (error) {
      res.status(500).json(new ApiError(500, "Failed to log out user."));
    }
  }
});

const checkLoggedIn = asyncHandler(async (req, res) => {
  const { accessToken } = req.cookies ?? req.body;
  if (!accessToken) {
    res.status(401).json(new ApiError(401, "Unauthorized"));
    return;
  }
  const userId = await verifyAccessToken(accessToken);
  if (userId === null) {
    res.status(401).json(new ApiError(401, "Unauthorized"));
    return;
  } else {
    res.status(200).json(
      new ApiResponse(200, {
        isLoggedIn: true,
      })
    );
  }
});
export {
  registerUser,
  loginUser,
  generateNewRefreshToken,
  logout,
  sendOtp,
  verifyOtp,
  checkLoggedIn,
};
