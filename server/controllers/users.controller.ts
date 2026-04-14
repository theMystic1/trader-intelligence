import { NextRequest, NextResponse } from "next/server";
import {
  sendStaffVerificationCodeEmail,
  sendStaffWelcomeEmail,
} from "../email/staffs.emails";
import { errorResponse, handleMongooseError } from "../lib/app-error";
import { catchAsync } from "../lib/catch-async";
import { getBearerToken, sendToken, signToken, verifyJwt } from "../lib/jwt";
import User from "../models/user.schema";
import crypto from "crypto";
import Instrument from "../models/instrument.schema";
import { ALL_INSTRUMENTS } from "@/lib/pair-seed";

export const signup = async (req: NextRequest) => {
  try {
    // get the body
    const body = await req.json();
    const { username, email, password } = body;
    // create a new user

    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "Email, username and password are required fields" },
        { status: 400 },
      );
    }

    const user = await User.create({ username, email, password });

    const resetToken = user.generateOTP(true);
    await user.save({ validateBeforeSave: false });

    // const await

    await sendStaffWelcomeEmail({
      to: email,
      schoolName: "Trader Intelligence",
      staffName: `${username}`,
      email: email,
      password: password,
      portalUrl: process.env.PORTAL_LINK as string,
    });

    // Send resetToken via email in real app
    await sendStaffVerificationCodeEmail({
      to: user.email,
      schoolName: "Trader Intelligence",
      staffName: user.username ?? "User",
      code: resetToken,
      expiresIn: "10 minutes",
    });

    return NextResponse.json({
      status: "success",
      message: "Verification code sent successfully",
      // user,
    });
  } catch (err: unknown) {
    const formatted = handleMongooseError(err);
    return errorResponse(formatted);
  }
};
export const verifyOTP = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const otp = body?.otp;
    const email = body?.email;

    // =========================
    // VALIDATION (MUST RETURN)
    // =========================
    if (!otp || !email) {
      return NextResponse.json(
        { message: "OTP and email are required" },
        { status: 400 },
      );
    }

    // =========================
    // HASH OTP
    // =========================
    const hashedOTP = crypto
      .createHash("sha256")
      .update(String(otp))
      .digest("hex");

    // =========================
    // FIND USER
    // =========================
    const user = await User.findOne({
      email,
      passwordResetToken: hashedOTP,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired OTP" },
        { status: 401 },
      );
    }

    // =========================
    // VERIFY OTP METHOD
    // =========================
    const isOTPValid = await user.verifyOTP(String(otp), true);

    if (!isOTPValid) {
      return NextResponse.json({ message: "Invalid OTP" }, { status: 401 });
    }

    // =========================
    // UPDATE USER
    // =========================
    user.emailVerified = true;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    (user as any).password = undefined;

    // =========================
    // TOKEN
    // =========================
    const token = signToken(String(user._id));

    // =========================
    // SUCCESS RESPONSE
    // =========================
    return NextResponse.json({
      status: "success",
      token,
      data: user,
    });
  } catch (error) {
    const formatted = handleMongooseError(error);
    return errorResponse(formatted);
  }
};

export const resendToken = async (req: NextRequest) => {
  try {
    const { email } = await req.json();
    const user = await User.findOne({ email });
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    const hashed = user.generateOTP(true);
    await user.save();

    // console.log(hashed);
    await sendStaffVerificationCodeEmail({
      to: user.email,
      schoolName: "Trader Intelligence",
      staffName: user.username ?? "User",
      code: hashed,
      expiresIn: "10 minutes",
    });

    return NextResponse.json({ message: "Token resent successfully" });
  } catch (error) {
    const formatted = handleMongooseError(error);
    return errorResponse(formatted);
  }
};

export const signIn = async (req: NextRequest) => {
  try {
    const { email, password } = await req.json();

    if (!email || !password)
      return NextResponse.json(
        { message: "Email & Password is required" },
        { status: 400 },
      );

    const user = await User.findOne({ email: email }).select("+password");
    if (!user)
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 },
      );

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid)
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 },
      );

    // Option A: sign token here
    const token = signToken(String(user._id));

    // Remove password from output
    (user as any).password = undefined;

    return sendToken(token, user);
  } catch (error: unknown) {
    const formatted = handleMongooseError(error);
    return errorResponse(formatted);
  }
};

export const forgotPassword = async (req: NextRequest) => {
  try {
    const { email } = await req.json();

    if (!email)
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 },
      );

    const user = await User.findOne({ email });
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    const resetToken = user.generateOTP(true);

    await sendStaffVerificationCodeEmail({
      to: user.email,
      schoolName: "Trader Intelligence",
      staffName: user.username ?? "User",
      code: resetToken,
      expiresIn: "10 minutes",
    });

    await user.save();

    return NextResponse.json(
      { message: "Password reset token sent", resetToken },
      { status: 200 },
    );
  } catch (error: unknown) {
    const formatted = handleMongooseError(error);
    return errorResponse(formatted);
  }
};

export const changePassword = async (req: NextRequest) => {
  try {
    const { otp, email, newPassword } = await req.json();

    if (!otp || !email || !newPassword)
      return NextResponse.json(
        { message: "OTP, email, and new password are required" },
        { status: 400 },
      );

    const user = await User.findOne({ email });
    if (!user)
      return NextResponse.json(
        { message: "Invalid OTP or email" },
        { status: 400 },
      );

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    return NextResponse.json({ message: "Password updated" }, { status: 200 });
  } catch (error: unknown) {
    const formatted = handleMongooseError(error);
    return errorResponse(formatted);
  }
};

export const protect = (handler: Function) => {
  return async (req: NextRequest, context?: any) => {
    try {
      const token = getBearerToken(req);

      // console.log(token);

      if (!token) {
        return NextResponse.json(
          { message: "Not authenticated" },
          { status: 401 },
        );
      }

      const decoded = await verifyJwt(token, process.env.JWT_SECRET as string);

      if (!decoded?.id) {
        return NextResponse.json({ message: "Invalid token" }, { status: 401 });
      }

      const user = await User.findById(decoded.id);

      if (!user) {
        return NextResponse.json(
          { message: "User no longer exists" },
          { status: 401 },
        );
      }

      // attach user to request
      (req as any).user = user;

      return handler(req, context);
    } catch (error) {
      return NextResponse.json(
        { message: "Authentication failed" },
        { status: 401 },
      );
    }
  };
};
