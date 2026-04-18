"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { toApiError } from "@/server/lib/api-error";
import toast from "react-hot-toast";
import {
  handleChangePassword,
  handleForgotPassword,
  handleResendOtp,
  handleVerifyOtp,
} from "@/server/lib/api/apii";
import Logo from "../ui/logo";

type Step = "request" | "sent" | "reset" | "success";

function DotGrid() {
  return (
    <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg width%3D%2240%22 height%3D%2240%22 viewBox%3D%220 0 40 40%22 xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg fill%3D%22none%22 fill-rule%3D%22evenodd%22%3E%3Cg fill%3D%22%231e2a3a%22 fill-opacity%3D%220.4%22%3E%3Cpath d%3D%22M0 0h1v1H0z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-40 pointer-events-none" />
  );
}

function BackToLogin() {
  return (
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
  );
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

/* ── Step 1: Enter email ── */
function RequestStep({ onSent }: { onSent: (email: string) => void }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await handleForgotPassword({ email });
      toast.success("OTP successfully sent.");

      onSent(email);
    } catch (error) {
      const { message } = toApiError(error);
      // setError("Failed to send reset link.");
      toast.error(message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
      </div>

      <div className="text-center mb-7">
        <h1 className="text-xl font-bold text-white mb-1">
          Forgot your password?
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          No worries. Enter your email and we&apos;ll send you a 6-digit OTP.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-300">
            Email address
          </label>
          <div
            className={`flex items-center gap-3 bg-[#0f1117] border rounded-lg px-3 h-11 transition-colors ${error ? "border-red-500/60" : "border-[#1e2a3a] focus-within:border-blue-500/60"}`}
          >
            <svg
              className="text-gray-500 flex-shrink-0"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              className="flex-1 bg-transparent  text-gray-200 placeholder-gray-600 outline-none"
            />
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-1 w-full h-11 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
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
              Sending OTP...
            </>
          ) : (
            "Send OTP"
          )}
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-[#1e2a3a]">
        <BackToLogin />
      </div>
    </>
  );
}

/* ── Step 2: OTP verification ── */
const OTP_LENGTH = 6;

function OtpStep({
  email,
  onVerified,
}: {
  email: string;
  onVerified: (otp: string) => void;
}) {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

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
    if (digit && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
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
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
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

      // console.log(result);
      // router.push("/dashboard");
      toast.success("OTP verified successfully.");
      onVerified(code);
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

  return (
    <>
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
        <h1 className="text-xl font-bold text-white mb-1">Check your email</h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          We sent a 6-digit code to{" "}
          <span className="text-gray-300 font-medium">{email}</span>.
          <br />
          Enter it below to continue.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          {/* OTP inputs */}
          <div className="flex gap-2.5 justify-center" onPaste={handlePaste}>
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
                  w-12 h-14 text-center text-xl font-bold rounded-xl border bg-[#0f1117]
                  outline-none transition-all duration-150 caret-blue-400
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
              Verify code
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

      <div className="text-center mt-5">
        <p className="text-xs text-gray-600 mb-2">
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

      <div className="flex items-center justify-between mt-6 pt-5 border-t border-[#1e2a3a]">
        <BackToLogin />
        <span className="text-xs text-gray-600">Expires in 10 min</span>
      </div>
    </>
  );
}

/* ── Step 3: New password form ── */
function ResetStep({
  onSuccess,
  otp,
  email,
}: {
  onSuccess: () => void;
  otp: string;
  email: string;
}) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const strength = (() => {
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = [
    "",
    "bg-red-500",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-green-500",
  ][strength];

  const validate = () => {
    const e: Record<string, string> = {};
    if (password.length < 8)
      e.password = "Password must be at least 8 characters.";
    if (password !== confirm) e.confirm = "Passwords do not match.";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    try {
      await handleChangePassword({ email, otp, newPassword: password });
      onSuccess();
      toast.success("Password changed successfully.");
    } catch (e) {
      const { message } = toApiError(e);
      toast.error(message);
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const requirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One number", met: /[0-9]/.test(password) },
    { label: "One special character", met: /[^A-Za-z0-9]/.test(password) },
  ];

  return (
    <>
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
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
      </div>

      <div className="text-center mb-7">
        <h1 className="text-xl font-bold text-white mb-1">Set new password</h1>
        <p className="text-sm text-gray-500">
          Must be different from your previous password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* New password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-300">
            New password
          </label>
          <div
            className={`flex items-center gap-3 bg-[#0f1117] border rounded-lg px-3 h-11 transition-colors ${errors.password ? "border-red-500/60" : "border-[#1e2a3a] focus-within:border-blue-500/60"}`}
          >
            <svg
              className="text-gray-500 flex-shrink-0"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <input
              type={showPw ? "text" : "password"}
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((p) => ({ ...p, password: "" }));
              }}
              className="flex-1 bg-transparent text-sm text-gray-200 placeholder-gray-600 outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="text-gray-500 hover:text-gray-300 transition-colors flex-shrink-0"
            >
              <EyeIcon open={showPw} />
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-400">{errors.password}</p>
          )}

          {/* Strength bar */}
          {password.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex gap-1 flex-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColor : "bg-[#1e2a3a]"}`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-400 w-10 text-right">
                  {strengthLabel}
                </span>
              </div>

              {/* Requirements checklist */}
              <div className="grid grid-cols-2 gap-1.5 mt-3">
                {requirements.map((r) => (
                  <div key={r.label} className="flex items-center gap-1.5">
                    <div
                      className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${r.met ? "bg-green-500/20" : "bg-[#1e2a3a]"}`}
                    >
                      {r.met && (
                        <svg
                          width="8"
                          height="8"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#22c55e"
                          strokeWidth="3"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                    <span
                      className={`text-xs transition-colors ${r.met ? "text-green-400" : "text-gray-600"}`}
                    >
                      {r.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Confirm password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-300">
            Confirm new password
          </label>
          <div
            className={`flex items-center gap-3 bg-[#0f1117] border rounded-lg px-3 h-11 transition-colors ${errors.confirm ? "border-red-500/60" : "border-[#1e2a3a] focus-within:border-blue-500/60"}`}
          >
            <svg
              className="text-gray-500 flex-shrink-0"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <input
              type={showCpw ? "text" : "password"}
              placeholder="Re-enter your password"
              value={confirm}
              onChange={(e) => {
                setConfirm(e.target.value);
                setErrors((p) => ({ ...p, confirm: "" }));
              }}
              className="flex-1 bg-transparent text-sm text-gray-200 placeholder-gray-600 outline-none"
            />
            <button
              type="button"
              onClick={() => setShowCpw((v) => !v)}
              className="text-gray-500 hover:text-gray-300 transition-colors flex-shrink-0"
            >
              <EyeIcon open={showCpw} />
            </button>
          </div>
          {errors.confirm && (
            <p className="text-xs text-red-400">{errors.confirm}</p>
          )}
          {!errors.confirm && confirm && password === confirm && (
            <p className="text-xs text-green-400 flex items-center gap-1">
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Passwords match
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-1 w-full h-11 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
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
              Updating password...
            </>
          ) : (
            "Update password"
          )}
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-[#1e2a3a]">
        <BackToLogin />
      </div>
    </>
  );
}

/* ── Step 4: Success ── */
function SuccessStep() {
  return (
    <div className="text-center flex flex-col items-center gap-4">
      <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
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
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Password updated!</h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          Your password has been changed successfully.
          <br />
          You can now sign in with your new password.
        </p>
      </div>

      <div className="w-full mt-2 flex flex-col gap-3">
        <Link
          href="/login"
          className="w-full h-11 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
        >
          Sign in now
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
        </Link>
      </div>

      {/* Security note */}
      <div className="w-full bg-[#0f1117] border border-[#1e2a3a] rounded-xl p-3 flex items-start gap-3 text-left mt-1">
        <svg
          className="flex-shrink-0 mt-0.5"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#6b7280"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <p className="text-xs text-gray-600 leading-relaxed">
          For your security, all active sessions have been signed out.
          You&apos;ll need to sign in again on all devices.
        </p>
      </div>
    </div>
  );
}

/* ── Progress stepper ── */
function Stepper({ step }: { step: Step }) {
  const steps: Step[] = ["request", "sent", "reset", "success"];
  const current = steps.indexOf(step);
  const labels = ["Request", "Verify code", "New password", "Done"];

  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center">
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                i < current
                  ? "bg-green-500 text-white"
                  : i === current
                    ? "bg-blue-600 text-white ring-2 ring-blue-500/30"
                    : "bg-[#1e2a3a] text-gray-600"
              }`}
            >
              {i < current ? (
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            <span
              className={`text-[10px] font-medium whitespace-nowrap transition-colors ${i === current ? "text-blue-400" : i < current ? "text-green-400" : "text-gray-600"}`}
            >
              {labels[i]}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`w-10 h-px mx-1 mb-4 transition-colors ${i < current ? "bg-green-500/40" : "bg-[#1e2a3a]"}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Main page ── */
export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("request");

  const [otp, setOtp] = useState<string>("");
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center p-4">
      <DotGrid />

      <div className="relative w-full max-w-md">
        <Logo />
        <Stepper step={step} />

        <div className="bg-[#131620] border border-[#1e2a3a] rounded-2xl p-8">
          {step === "request" && (
            <RequestStep
              onSent={(e) => {
                setEmail(e);
                setStep("sent");
              }}
            />
          )}
          {step === "sent" && (
            <OtpStep
              email={email}
              onVerified={(otp) => {
                setOtp(otp);
                setStep("reset");
              }}
            />
          )}
          {step === "reset" && (
            <ResetStep
              onSuccess={() => setStep("success")}
              otp={otp}
              email={email}
            />
          )}
          {step === "success" && <SuccessStep />}
        </div>
      </div>
    </div>
  );
}
