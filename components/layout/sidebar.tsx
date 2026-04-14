import { links } from "@/lib/constants";
import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-[#121826] p-4 flex flex-col gap-4">
      <h1 className="text-xl font-bold text-blue-400">TradeIQ</h1>
      {links.map((link) => (
        <Link
          key={link?.href}
          className="hover:bg-[#1B2233] p-2 rounded cursor-pointer transition"
          href={link?.href}
        >
          {link?.title}
        </Link>
      ))}
    </div>
  );
}
