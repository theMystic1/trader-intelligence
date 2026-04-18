"use client";

import { useState } from "react";
import Link from "next/link";
import { toApiError } from "@/server/lib/api-error";
import toast from "react-hot-toast";
import { handleSignup } from "@/server/lib/api/apii";
import { useRouter } from "next/navigation";
import Logo from "../ui/logo";

export function EyeIcon({ open }: { open: boolean }) {
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

function InputField({
  label,
  type,
  placeholder,
  value,
  onChange,
  icon,
  error,
  showToggle,
  onToggle,
  showPassword,
}: {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  icon: React.ReactNode;
  error?: string;
  showToggle?: boolean;
  onToggle?: () => void;
  showPassword?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-300">{label}</label>
      <div
        className={`flex items-center gap-3 bg-[#0f1117] border rounded-lg px-3 h-11 transition-colors ${error ? "border-red-500/60" : "border-[#1e2a3a] focus-within:border-blue-500/60"}`}
      >
        <span className="text-gray-500 flex-shrink-0">{icon}</span>
        <input
          type={showToggle ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent  text-gray-200 placeholder-gray-600 outline-none"
        />
        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="text-gray-500 hover:text-gray-300 transition-colors flex-shrink-0"
          >
            <EyeIcon open={!!showPassword} />
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

export default function SignupPage() {
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const set = (key: string) => (val: string) =>
    setForm((p) => ({ ...p, [key]: val }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      e.email = "Enter a valid email address.";
    if (form.username.length < 3)
      e.username = "Username must be at least 3 characters.";
    if (form.password.length < 8)
      e.password = "Password must be at least 8 characters.";
    if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match.";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    try {
      setLoading(true);

      // trial

      const user = await handleSignup({
        email: form.email,
        username: form.username,
        password: form.password,
      });

      console.log(user);
      toast.success(user?.message || "Signup successful!");
      router.push(`/verifyOtp?email=${form.email}`);
    } catch (error: unknown) {
      const apiError = toApiError(error);
      setErrors({ server: apiError.message });

      toast.error(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  const strength = (() => {
    const p = form.password;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
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

  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center p-4">
      {/* Background subtle grid */}

      <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg width%3D%2240%22 height%3D%2240%22 viewBox%3D%220 0 40 40%22 xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg fill%3D%22none%22 fill-rule%3D%22evenodd%22%3E%3Cg fill%3D%22%231e2a3a%22 fill-opacity%3D%220.4%22%3E%3Cpath d%3D%22M0 0h1v1H0z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-40 pointer-events-none" />
      <div className="relative w-full max-w-md">
        {/* Logo */}
        <Logo />

        {/* Card */}
        <div className="bg-[#131620] border border-[#1e2a3a] rounded-2xl p-8">
          <div className="mb-7">
            <h1 className="text-xl font-bold text-white mb-1">
              Create your account
            </h1>
            <p className="text-sm text-gray-500">
              Start your trading journey today.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <InputField
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={set("email")}
              error={errors.email}
              icon={
                <svg
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
              }
            />

            <InputField
              label="Username"
              type="text"
              placeholder="e.g. traderjoe"
              value={form.username}
              onChange={set("username")}
              error={errors.username}
              icon={
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              }
            />

            <div className="flex flex-col gap-1.5">
              <InputField
                label="Password"
                type="password"
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={set("password")}
                error={errors.password}
                showToggle
                onToggle={() => setShowPw((v) => !v)}
                showPassword={showPw}
                icon={
                  <svg
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
                }
              />
              {form.password.length > 0 && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColor : "bg-[#1e2a3a]"}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">{strengthLabel}</span>
                </div>
              )}
            </div>

            <InputField
              label="Confirm password"
              type="password"
              placeholder="Re-enter your password"
              value={form.confirmPassword}
              onChange={set("confirmPassword")}
              error={errors.confirmPassword}
              showToggle
              onToggle={() => setShowCpw((v) => !v)}
              showPassword={showCpw}
              icon={
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              }
            />

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full h-11 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
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
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          By signing up, you agree to our{" "}
          <span className="text-gray-500 hover:text-gray-400 cursor-pointer transition-colors">
            Terms of Service
          </span>{" "}
          and{" "}
          <span className="text-gray-500 hover:text-gray-400 cursor-pointer transition-colors">
            Privacy Policy
          </span>
        </p>
      </div>
    </div>
  );
}
