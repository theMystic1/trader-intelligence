import AuthLayout from "@/components/auth/auth-layout";

const Auth_Layout = ({ children }: { children: React.ReactNode }) => {
  return <AuthLayout>{children}</AuthLayout>;
};

export default Auth_Layout;
