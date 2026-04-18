import mongoose, { HydratedDocument, Model } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { UserMethods, UserType } from "@/types";

const passwordValidationOption = {
  minLength: 8,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1,
};
// user.schema.ts — add these fields to your existing schema
const userSchema = new mongoose.Schema<UserType>(
  {
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      // No longer required — OAuth users won't have one
      validate: [
        (v: string) => {
          if (!v) return true; // skip validation for OAuth users
          return validator.isStrongPassword(v, passwordValidationOption);
        },
        "Please provide a strong password",
      ],
      select: false,
    },
    username: {
      type: String,
      trim: true,
      required: [true, "Please provide a username"],
      unique: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    // ── OAuth fields ──
    provider: {
      type: String,
      enum: ["credentials", "google", "github"],
      default: "credentials",
    },
    providerId: {
      type: String, // the OAuth provider's user ID
    },
    avatar: {
      type: String, // profile picture URL from provider
    },
    // existing fields
    token: String,
    signinTokenExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;
  const safePassword =
    this.password ?? crypto.randomBytes(6).toString("base64url"); // temporary
  const hashedPassword = await bcrypt.hash(safePassword, 10);
  this.password = hashedPassword;
});

// 1) Compare password: only needs the candidate password
userSchema.methods.comparePassword = function (
  this: HydratedDocument<UserType>,
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, String(this.password));
};

// 2) Generate OTP (6 digits), store hashed + expiry, return raw OTP
userSchema.methods.generateOTP = function (
  this: HydratedDocument<UserType>,
  forgotPass?: boolean,
) {
  const otp = crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");

  if (forgotPass) {
    this.passwordResetToken = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");
    this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
  } else {
    this.token = crypto.createHash("sha256").update(otp).digest("hex");
    this.signinTokenExpires = new Date(Date.now() + 10 * 60 * 1000);
  }
  return otp;
};

// 3) Optional: verify OTP helper (highly recommended)
userSchema.methods.verifyOTP = function (
  this: HydratedDocument<UserType>,
  otp: string,
  forgotPass?: boolean,
): boolean {
  if (forgotPass) {
    if (!this.passwordResetToken || !this.passwordResetExpires) return false;
    if (this.passwordResetExpires.getTime() < Date.now()) return false;
    const hashed = crypto.createHash("sha256").update(otp).digest("hex");
    return hashed === this.passwordResetToken;
  } else {
    if (!this.token || !this.signinTokenExpires) return false;
    if (this.signinTokenExpires.getTime() < Date.now()) return false;
    const hashed = crypto.createHash("sha256").update(otp).digest("hex");
    return hashed === this.token;
  }
};

const User =
  mongoose.models.User ||
  mongoose.model<UserType, Model<UserType, {}, UserMethods>>(
    "User",
    userSchema,
  );

export default User;
