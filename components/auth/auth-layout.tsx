"use client";

import bgimg1 from "@/public/images/bg1.jpg";
import bgimg2 from "@/public/images/bg-2.jpg";
import Image from "next/image";
import { useEffect, useState } from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const [image, setImage] = useState(bgimg1);
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setImage((prev) => (prev === bgimg1 ? bgimg2 : bgimg1));
  //   }, 50000);
  //   return () => clearInterval(interval);
  // }, []);
  //
  //
  return (
    <div>
      <div className="h-screen w-full relative bg-black/10 backdrop-blur-sm">
        <Image
          src={image}
          alt="background"
          fill
          className=" w-full h-full object-contain"
          objectFit="cover"
        />
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
