import SignupPage from "@/components/auth/SignupPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  description:
    "Create a free account to start journaling trades and improving your performance.",
};
const Signup = () => {
  return <SignupPage />;
};

export default Signup;
