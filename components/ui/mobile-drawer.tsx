"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GiCancel } from "react-icons/gi";
import Logo from "../ui/logo";
import { links } from "@/lib/constants";
import { Icon } from "../dashboard/dashboard/Dashboard";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (typeof window === "undefined") return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`
          fixed inset-0 bg-black/60 backdrop-blur-sm
          transition-opacity duration-300 ease-in-out
          lg:hidden
          ${isOpen ? "opacity-100 pointer-events-auto flex" : "opacity-0 pointer-events-none hidden"}
        `}
        style={{ zIndex: 9998 }}
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`
          fixed top-0 left-0 right-0 w-full
          transition-transform duration-300 ease-in-out
          lg:hidden
          ${isOpen ? "block" : "hidden"}
        `}
        style={{ zIndex: 9999 }}
      >
        <div className="bg-[#131620] border-b border-[#1e2a3a] shadow-2xl rounded-b-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e2a3a]">
            <Logo />
            <button
              onClick={onClose}
              aria-label="Close menu"
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1e2a3a] hover:bg-[#2a3a50] transition-colors"
            >
              <GiCancel size={16} color="#e2e8f0" />
            </button>
          </div>

          {/* Links */}
          <nav className="px-3 py-3 flex flex-col gap-1">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl
                  transition-all duration-200 text-sm font-medium
                  ${
                    isActive(item.href)
                      ? "bg-[#1a2744] text-[#60a5fa]"
                      : "text-[#9ca3af] hover:bg-[#1e2a3a] hover:text-white"
                  }
                `}
              >
                <Icon
                  name={item.icon}
                  size={16}
                  color={isActive(item.href) ? "#60a5fa" : "currentColor"}
                />
                {item.title}
              </Link>
            ))}
          </nav>

          <div className="h-4" />
        </div>
      </div>
    </>,
    document.body, // ← renders outside all layout divs
  );
}
