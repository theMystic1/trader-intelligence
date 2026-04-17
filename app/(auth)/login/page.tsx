import LoginPage from "@/components/auth/LoginPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description:
    "Sign in to access your trading dashboard, journal, and analytics.",
  robots: {
    index: false,
    follow: false,
  },
};
const SignIn = () => {
  return <LoginPage />;
};

export default SignIn;
