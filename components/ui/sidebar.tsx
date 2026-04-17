"use client";

import { links, navItems } from "@/lib/constants";
import { Icon } from "../dashboard/dashboard/Dashboard";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMe } from "@/hooks/useMe";
import cookies from "js-cookie";

const Sidebar = () => {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;
  const router = useRouter();
  const { me, isLoadingMe, refetchMe } = useMe();

  // console.log(me);
  //
  //
  const handleLogout = () => {
    cookies.remove(process.env.NEXT_PUBLIC_ACCESS_TOKEN!);

    router.push("/login");
  };

  const user = me?.data;
  return (
    <aside className=" hidden lg:flex w-52 bg-[#131620] border-r border-[#1e2330]  flex-col">
      <div className=" py-6 h-screen flex flex-col justify-between fixed top-0 left-0 bottom-0">
        {/* Logo */}
        <div>
          <div className="flex items-center gap-2 p-4 border-b border-[#1e2330]">
            <div style={{ lineHeight: 1.2 }}>
              <div className="text-[13px] font-bold text-white ">
                TRADER INTELIGENCE
              </div>
              <div className="text-[9px] text-[#6b7280] uppercase">
                YOUR TRADING BLUEPRINT
              </div>
            </div>
          </div>

          {/* Main nav */}
          <nav className="flex flex-col gap-1">
            {links.map((item) => (
              <Link
                key={item.href}
                className={`flex items-center gap-2 px-5 py-3 ${isActive(item.href) ? "bg-[#1a2744] text-[#60a5fa]" : "text-[#9ca3af]"} cursor-pointer hover:bg-[#1a2744] transition-all duration-300`}
                href={item.href}
              >
                <Icon
                  name={item.icon}
                  size={15}
                  color={isActive(item.href) ? "#60a5fa" : "#9ca3af"}
                />
                {item.title}
              </Link>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="mt-auto border-t border-[#1e2330] px-4 py-3">
          {isLoadingMe ? (
            <div className="italics">loading usier data</div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#374151] flex items-center justify-center text-sm font-semibold text-[#9ca3af] flex-shrink-0 uppercase">
                {user?.username?.split("")[0]}
              </div>
              <div>
                <div className="text-sm font-semibold text-[#e2e8f0] uppercase">
                  {user?.username}
                </div>
                <div className="text-xs text-[#6b7280]">{user?.email}</div>
              </div>
            </div>
          )}
          <button
            className="flex items-center justify-center py-2 px-4 rounded-sm bg-red-500 gap-2 text-white text-sm cursor-pointer mt-2 w-full"
            onClick={handleLogout}
          >
            <Icon name="signout" size={13} color="#ffff" />{" "}
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
