import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { dbConnect } from "@/server/server";
import { Toaster } from "react-hot-toast";
import QueryProviders from "@/contexts/react-query";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://your-domain.com"),
  title: {
    default: "Trading Intelligence",
    template: "%s | Trading Intelligence",
  },
  description:
    "Advanced trading journal, backtesting, and performance analytics platform for traders.",
  keywords: [
    "trading journal",
    "backtesting",
    "forex trading",
    "crypto trading",
    "trade analytics",
  ],
  openGraph: {
    type: "website",
    siteName: "Trading Intelligence",
    title: "Trading Intelligence",
    description:
      "Track, analyze, and improve your trading performance with advanced tools.",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const connected = await dbConnect();

  // console.log(connected);
  return (
    <html lang="en">
      <body className="bg-[#0B0F1A] text-white font-sans">
        <QueryProviders>{children}</QueryProviders>

        <Toaster
          toastOptions={{
            style: {
              fontSize: "12px",
              fontWeight: "700",
            },

            success: {
              iconTheme: {
                primary: "black",
                secondary: "white",
              },
            },
          }}
          containerStyle={{ zIndex: 2147483647 }}
        />
      </body>
    </html>
  );
}
