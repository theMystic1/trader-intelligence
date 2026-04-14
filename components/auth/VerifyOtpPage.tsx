"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { handleResendOtp, handleVerifyOtp } from "@/server/lib/api/apii";
import { toApiError } from "@/server/lib/api-error";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { setCookie } from "@/lib/helpers";
import Logo from "../ui/logo";

const OTP_LENGTH = 6;

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const srchPm = useSearchParams();
  const router = useRouter();
  const email = srchPm.get("email");

  // countdown
  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const handleChange = (index: number, val: string) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    setError("");
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const next = [...otp];
        next[index] = "";
        setOtp(next);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
    if (e.key === "ArrowLeft" && index > 0)
      inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1)
      inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    const next = [...otp];
    pasted.split("").forEach((ch, i) => {
      next[i] = ch;
    });
    setOtp(next);
    const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIdx]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < OTP_LENGTH) {
      setError("Please enter all 6 digits.");
      return;
    }
    setLoading(true);
    try {
      const result = await handleVerifyOtp({ email: String(email), otp: code });
      setVerified(true);
      if (result?.token) {
        setCookie(
          process.env.NEXT_PUBLIC_ACCESS_TOKEN ?? "intelluser",
          result.token,
          { expires: 365, path: "/" },
        );
      }
      // console.log(result);
      router.push("/dashboard");
      toast.success("OTP verified successfully.");
    } catch (error) {
      const { message } = toApiError(error);
      toast.error(message);
      setError(message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setResending(true);
    setOtp(Array(OTP_LENGTH).fill(""));
    setError("");
    inputRefs.current[0]?.focus();

    try {
      await handleResendOtp({ email: email ?? "" });
      toast.success("OTP resent successfully.");
    } catch (error) {
      const { message } = toApiError(error);
      toast.error(message);
      setError(message);
      console.error(error);
    } finally {
      setResending(false);
      setResendTimer(30);
      setLoading(false);
    }
  };

  const filled = otp.filter(Boolean).length;

  if (verified) {
    return (
      <div className="min-h-screen bg-[#0f1117] flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg width%3D%2240%22 height%3D%2240%22 viewBox%3D%220 0 40 40%22 xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg fill%3D%22none%22 fill-rule%3D%22evenodd%22%3E%3Cg fill%3D%22%231e2a3a%22 fill-opacity%3D%220.4%22%3E%3Cpath d%3D%22M0 0h1v1H0z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-40 pointer-events-none" />
        <div className="relative w-full max-w-md text-center">
          <div className="bg-[#131620] border border-[#1e2a3a] rounded-2xl p-10 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mb-2">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#22c55e"
                strokeWidth="2.5"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white">Email verified!</h2>
            <p className="text-sm text-gray-500">
              Your account has been successfully verified. You can now sign in.
            </p>
            <Link
              href="/login"
              className="mt-2 w-full h-11 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors flex items-center justify-center"
            >
              Continue to sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center p-4">
      {/* Dot grid */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg width%3D%2240%22 height%3D%2240%22 viewBox%3D%220 0 40 40%22 xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg fill%3D%22none%22 fill-rule%3D%22evenodd%22%3E%3Cg fill%3D%22%231e2a3a%22 fill-opacity%3D%220.4%22%3E%3Cpath d%3D%22M0 0h1v1H0z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-40 pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <Logo />

        {/* Card */}
        <div className="bg-[#131620] border border-[#1e2a3a] rounded-2xl p-8">
          {/* Icon */}
          <div className="flex justify-center mb-5">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="1.8"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
          </div>

          <div className="text-center mb-7">
            <h1 className="text-xl font-bold text-white mb-1">
              Check your email
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              We sent a 6-digit verification code to{" "}
              <span className="text-gray-300 font-medium">{email}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* OTP inputs */}
            <div>
              <div
                className="flex gap-2.5 justify-center"
                onPaste={handlePaste}
              >
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      inputRefs.current[i] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className={`
                      w-12 h-14 text-center text-xl font-bold rounded-xl border bg-[#0f1117] outline-none
                      transition-all duration-150 caret-blue-400
                      ${
                        error
                          ? "border-red-500/60 text-red-400"
                          : digit
                            ? "border-blue-500/60 text-white"
                            : "border-[#1e2a3a] text-white focus:border-blue-500/60 focus:bg-[#0f1621]"
                      }
                    `}
                  />
                ))}
              </div>

              {/* Progress dots */}
              <div className="flex justify-center gap-1.5 mt-4">
                {otp.map((d, i) => (
                  <div
                    key={i}
                    className={`h-1 rounded-full transition-all duration-200 ${d ? "w-5 bg-blue-500" : "w-3 bg-[#1e2a3a]"}`}
                  />
                ))}
              </div>

              {error && (
                <p className="text-center text-xs text-red-400 mt-3">{error}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || filled < OTP_LENGTH}
              className="w-full h-11 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Verifying...
                </>
              ) : (
                <>
                  Verify email
                  {filled === OTP_LENGTH && (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  )}
                </>
              )}
            </button>
          </form>

          {/* Resend */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-500 mb-2">
              Didn&apos;t receive the code?
            </p>
            <button
              onClick={handleResend}
              disabled={resendTimer > 0 || resending}
              className="text-sm font-medium transition-colors disabled:cursor-not-allowed"
              style={{ color: resendTimer > 0 ? "#4b5563" : "#3b82f6" }}
            >
              {resending
                ? "Sending..."
                : resendTimer > 0
                  ? `Resend in ${resendTimer}s`
                  : "Resend code"}
            </button>
          </div>

          <div className="flex items-center gap-2 mt-6 pt-5 border-t border-[#1e2a3a]">
            <Link
              href="/login"
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back to sign in
            </Link>
            <span className="ml-auto text-xs text-gray-600">
              Code expires in 10 min
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
