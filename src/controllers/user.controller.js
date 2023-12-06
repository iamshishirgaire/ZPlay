import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinaryFileUpload.js";
import { redisClient } from "../utils/init_redis.js";
import {
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwtHelper.js";

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, userName, password } = req.body;
  const files = req.files;

  let existingUsr = await User.findOne({
    $or: [{ email }, { userName }],
  });

  if (existingUsr) {
    throw new ApiError(400, "User already exists");
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
    const accToken = generateAccessToken(usr._id);
    const refToken = await generateRefreshToken(usr._id);
    if (accToken === null || refToken === null) {
      res.status(500).json(new ApiError(500, "Internal Server Error"));
    } else {
      res.status(201).json(
        new ApiResponse(
          201,
          {
            ...createdUser._doc,
            accToken,
            refToken,
          },
          "User registered successfully"
        )
      );
    }
  } else {
    throw new ApiError(400, "User creation failed");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const searchedUser = await User.findOne({ email });
  if (!searchedUser) {
    res.json({
      message: new ApiError(400, "User with that email not found").message,
    });
  } else {
    const isPasswordCorrect = await searchedUser.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
      throw new ApiError(400, "Either email or password is incorrect");
    } else {
      //generate access token and refresh token
      let aToken = generateAccessToken(searchedUser._id);
      let rToken = await generateRefreshToken(searchedUser._id);
      if (aToken === null || rToken === null) {
        res.status(500).json(new ApiError(500, "Internal Server Error"));
      } else {
        res.json({
          message: "User logged in successfully",
          data: {
            accessToken: aToken,
            refreshToken: rToken,
          },
        });
      }
    }
  }
});

const generateNewRefreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const userId = await verifyRefreshToken(refreshToken);
  console.log(`userId: ${userId}`);
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
      res.json({
        accessToken: aToken,
        refreshToken: rToken,
      });
    }
  }
});

const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const userId = await verifyRefreshToken(refreshToken);
  if (userId === null) {
    res.status(401).json({
      message: new ApiError(401, "Unauthorized").message,
    });
  } else {
    try {
      await redisClient.del(userId.toString());
      res.json({
        message: "User logged out successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to logout",
      });
    }
  }
});

export { registerUser, loginUser, generateNewRefreshToken, logout };
