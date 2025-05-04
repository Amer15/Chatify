import User, { IUser } from "@/models/user.model";
import { validateSchema } from "@/utils/validation";
import { Request, Response } from "express";
import { loginSchema, signupSchema, updateProfileSchema } from "./validators";
import { CustomError } from "@/utils/custom_error";
import brcypt from "bcryptjs";
import jwt from "jsonwebtoken";
import env from "@/env";
import { uploadToCloudinary } from "@/config/cloudinary";

export const getAllUsers = async (_: Request, res: Response) => {
  const users: IUser[] = await User.find().select("-password");

  res.status(200).json({
    message: "successfully fetched users",
    users,
  });
};

export const getOtherUsers = async (req: Request, res: Response) => {
  if (!req.user_id) {
    throw new CustomError("unauthorized", 403);
  }

  const page = Number(req.query.page) || 1;
  const limit = 15;
  const offset = limit * (page - 1);
  const totalRecords = await User.countDocuments({
    _id: { $ne: req.user_id },
  });
  const total_pages = Math.ceil(totalRecords / limit);

  const users = await User.find({ _id: { $ne: req.user_id } })
    .skip(offset)
    .limit(limit);

  res.status(200).json({
    message: "fetched users",
    total_pages,
    current_page: page,
    items_per_page: limit,
    current_page_items: users.length,
    users,
  });
};

export const signup = async (req: Request, res: Response) => {
  const { email, fullName, password } = validateSchema(signupSchema, req.body);

  const user = await User.findOne({ email });

  if (user) {
    throw new CustomError("account already exist with this email", 400);
  }

  const hashedPassword = await brcypt.hash(password, 10);

  const newUser = new User({
    fullName,
    email,
    password: hashedPassword,
  });

  await newUser.save();

  res.status(201).json({
    message: "signup successful",
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = validateSchema(loginSchema, req.body);

  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError("no account exist with this email", 400);
  }

  const isMatched = await brcypt.compare(password, user.password);

  if (!isMatched) {
    throw new CustomError("invalid credentials", 400);
  }

  const accessToken = jwt.sign({ user_id: user._id }, env.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });

  const refreshToken = jwt.sign(
    { user_id: user._id },
    env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );

  res.cookie("accessToken", accessToken, {
    sameSite: "lax",
    httpOnly: true,
    maxAge: 60 * 60 * 1000,
    secure: env.NODE_ENV === "production",
  });

  res.cookie("refreshToken", refreshToken, {
    sameSite: "lax",
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    secure: env.NODE_ENV === "production",
  });

  const { password: userPassword, ...otherData } = user.toObject();

  res.status(200).json({
    message: "login successful",
    user: otherData,
  });
};

export const logout = async (_: Request, res: Response) => {
  res.clearCookie("accessToken", {
    sameSite: "strict",
    httpOnly: true,
    secure: env.NODE_ENV === "production",
  });

  res.clearCookie("refreshToken", {
    sameSite: "strict",
    httpOnly: true,
    secure: env.NODE_ENV === "production",
  });

  res.status(200).json({
    message: "logout successful",
  });
};

export const getUserById = async (req: Request, res: Response) => {
  const id = req.query.id;

  const user = await User.findById(id).select("-password");

  if (!user) {
    throw new CustomError("no account exist", 400);
  }

  res.status(200).json({
    message: "successfully fetched user",
    user,
  });
};

export const updateProfile = async (req: Request, res: Response) => {
  const payload = validateSchema(updateProfileSchema, {
    ...req.body,
    profile_image: req.file,
  });

  const { profile_image } = payload;

  if (!req.user_id) {
    throw new CustomError("unauthorized", 403);
  }

  const user = await User.findById(req.user_id);

  if (!user) {
    throw new CustomError("no user exist", 400);
  }

  const profile_url = await uploadToCloudinary(
    profile_image.buffer,
    profile_image.filename
  );

  user.profileImage = profile_url;
  await user.save();

  res.status(200).json({
    message: "upload success",
    profileImage: profile_url,
  });
};
