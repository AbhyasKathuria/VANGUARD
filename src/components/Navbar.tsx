"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { UserSession } from "@/lib/types";
import {
  Shield,
  LogOut,
  PlusCircle,
  ListOrdered,
  Users,
  CheckCircle,
  Menu,
  X,
  MapPin,
} from "lucide-react";

interface NavbarProps {
  user: UserSession | null;
}

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setLoggingOut(false);
    }
  };

  const getRoleBadge = (role?: string) => {
    if (!role) return null;
    switch (role) {
      case "authority":
        return (
          <span className="bg-[#262626] text-white text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-[#707070]">
            Authority
          </span>
        );
      case "worker":
        return (
          <span className="bg-[#545454] text-white text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-[#a6a6a6]">
            Worker
          </span>
        );
      case "volunteer":
        return (
          <span className="bg-[#404040] text-white text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-[#a6a6a6]">
            Volunteer
          </span>
        );
      case "citizen":
      default:
        return (
          <span className="bg-[#707070] text-white text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Citizen
          </span>
        );
    }
  };

  return (
    <header className="bg-[#404040] text-white border-b border-[#707070] sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="bg-[#f5f5f5] p-2 rounded-xl text-[#404040] font-black flex items-center justify-center shadow-xs group-hover:bg-white transition-colors">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
                  VANGUARD
                  <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 bg-white/15 text-[#dcdcdc] rounded border border-white/20">
                    MVP
                  </span>
                </span>
                <p className="text-[11px] text-[#dcdcdc] -mt-1 hidden sm:block">Rural Service Routing Platform</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          {user && (
            <nav className="hidden md:flex items-center gap-1.5">
              {user.role === "citizen" && (
                <>
                  <Link
                    href="/citizen/dashboard"
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      pathname === "/citizen/dashboard" ? "bg-[#262626] text-white" : "text-[#dcdcdc] hover:bg-white/10"
                    }`}
                  >
                    <ListOrdered className="w-4 h-4 text-[#dcdcdc]" />
                    My Requests
                  </Link>
                  <Link
                    href="/citizen/new-request"
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      pathname === "/citizen/new-request"
                        ? "bg-white text-[#404040] font-bold shadow-xs"
                        : "bg-white/15 text-white hover:bg-white/25 border border-white/20"
                    }`}
                  >
                    <PlusCircle className="w-4 h-4" />
                    Raise Request
                  </Link>
                </>
              )}

              {user.role === "worker" && (
                <Link
                  href="/worker/dashboard"
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    pathname === "/worker/dashboard" ? "bg-[#262626] text-white" : "text-[#dcdcdc] hover:bg-white/10"
                  }`}
                >
                  <CheckCircle className="w-4 h-4 text-[#dcdcdc]" />
                  Assigned Jobs
                </Link>
              )}

              {user.role === "volunteer" && (
                <>
                  <Link
                    href="/volunteer/dashboard"
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      pathname === "/volunteer/dashboard" ? "bg-[#262626] text-white" : "text-[#dcdcdc] hover:bg-white/10"
                    }`}
                  >
                    <Users className="w-4 h-4 text-[#dcdcdc]" />
                    Volunteer Hub
                  </Link>
                  <Link
                    href="/citizen/new-request"
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 text-[#dcdcdc] hover:bg-white/10"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Raise for Citizen
                  </Link>
                </>
              )}

              {user.role === "authority" && (
                <Link
                  href="/authority/dashboard"
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    pathname === "/authority/dashboard" ? "bg-[#262626] text-white" : "text-[#dcdcdc] hover:bg-white/10"
                  }`}
                >
                  <Shield className="w-4 h-4 text-[#dcdcdc]" />
                  Authority Command Center
                </Link>
              )}
            </nav>
          )}

          {/* User Profile Info & Logout */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col items-end text-right">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-white">{user.name}</span>
                    {getRoleBadge(user.role)}
                  </div>
                  <span className="text-[11px] text-[#dcdcdc] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#a6a6a6]" />
                    {user.location}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  title="Log out"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#dcdcdc] hover:text-white bg-[#262626] hover:bg-black border border-[#707070] rounded-lg transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#262626] hover:bg-black rounded-lg border border-[#707070] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-3.5 py-1.5 text-xs font-bold text-[#404040] bg-[#f5f5f5] hover:bg-white rounded-lg shadow-xs transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            {user && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 rounded-lg bg-[#262626] text-[#dcdcdc] hover:text-white border border-[#707070]"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {user && mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-[#707070] space-y-2">
            <div className="px-2 py-1.5 bg-[#262626] rounded-lg mb-2 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">{user.name}</p>
                <p className="text-[11px] text-[#dcdcdc]">{user.location}</p>
              </div>
              {getRoleBadge(user.role)}
            </div>

            {user.role === "citizen" && (
              <>
                <Link
                  href="/citizen/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-xs font-semibold text-[#dcdcdc] hover:bg-[#262626]"
                >
                  📋 My Requests
                </Link>
                <Link
                  href="/citizen/new-request"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-xs font-semibold bg-white text-[#404040] font-bold"
                >
                  ➕ Raise Request
                </Link>
              </>
            )}

            {user.role === "worker" && (
              <Link
                href="/worker/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-xs font-semibold text-[#dcdcdc] hover:bg-[#262626]"
              >
                🛠️ Assigned Jobs
              </Link>
            )}

            {user.role === "volunteer" && (
              <>
                <Link
                  href="/volunteer/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-xs font-semibold text-[#dcdcdc] hover:bg-[#262626]"
                >
                  🤝 Volunteer Hub &amp; Open Pool
                </Link>
                <Link
                  href="/citizen/new-request"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-xs font-semibold text-[#dcdcdc] hover:bg-[#262626]"
                >
                  ➕ Raise on behalf of Citizen
                </Link>
              </>
            )}

            {user.role === "authority" && (
              <Link
                href="/authority/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-xs font-semibold text-[#dcdcdc] hover:bg-[#262626]"
              >
                🏛️ Authority Command Center
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
