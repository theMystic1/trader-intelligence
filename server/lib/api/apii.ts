import { UserType } from "@/types";
import { post, get, del, patch } from "./api-client";

const baseUrl = "api/auth";

export const handleSignup = async (payload: UserType) =>
  post<UserType, any>(`${baseUrl}/signup`, payload);

export const handleLogin = async (payload: {
  email: string;
  password: string;
}) =>
  post<{ email: string; password: string }, any>(`${baseUrl}/login`, payload);

export const handleVerifyOtp = async (payload: {
  email: string;
  otp: string;
}) =>
  post<{ email: string; otp: string }, any>(`${baseUrl}/verifyOtp`, payload);

export const handleResendOtp = async (payload: { email: string }) =>
  post<{ email: string }, any>(`${baseUrl}/resendOtp`, payload);

export const handleForgotPassword = async (payload: { email: string }) =>
  post<{ email: string }, any>(`${baseUrl}/forgotPassword`, payload);

export const handleChangePassword = async (payload: {
  email: string;
  otp: string;
  newPassword: string;
}) =>
  post<{ email: string; otp: string; newPassword: string }, any>(
    `${baseUrl}/changePassword`,
    payload,
  );
