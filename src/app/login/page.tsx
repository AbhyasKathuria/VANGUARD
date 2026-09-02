"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DemoLoginButtons from "@/components/DemoLoginButtons";
import DashboardLanguageBanner from "@/components/DashboardLanguageBanner";
import { useLanguage } from "@/lib/i18n/context";
import { Shield, Lock, Phone, ArrowRight, Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!phone || !password) {
      setError("Please enter both phone number and password.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed. Check your phone or password.");
        return;
      }

      // Redirect based on user role with clean page navigation
      const role = data.user?.role;
      let target = "/citizen/dashboard";
      if (role === "super_admin") target = "/superadmin/dashboard";
      else if (role === "worker") target = "/worker/dashboard";
      else if (role === "volunteer") target = "/volunteer/dashboard";
      else if (role === "authority") target = "/authority/dashboard";

      window.location.href = target;
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 space-y-6">
      {/* 1-Click Multi-Lingual Switcher */}
      <DashboardLanguageBanner />

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 rounded-2xl bg-[#404040] text-white mb-1 shadow-sm">
          <Shield className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-[#404040]">{t.common.signIn}</h1>
        <p className="text-xs text-[#707070]">
          Enter your registered mobile number and password to access your role dashboard.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#dcdcdc] shadow-xs space-y-4">
        {error && (
          <div className="p-3.5 bg-[#fef2f2] text-[#991b1b] border border-[#fecaca] rounded-xl text-xs space-y-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
            {phone && (
              <div className="pt-1">
                <Link
                  href={`/signup?phone=${encodeURIComponent(phone)}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#991b1b] hover:bg-[#7f1d1d] text-white font-bold rounded-lg transition-colors cursor-pointer text-xs"
                >
                  Create New Account with {phone}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#404040] mb-1.5">
              Mobile Phone Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#a6a6a6] absolute left-3.5 top-3" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full pl-10 pr-4 py-2.5 text-xs border border-[#dcdcdc] rounded-xl focus:border-[#404040] outline-none text-[#404040] transition-colors"
                autoComplete="tel"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#404040] mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#a6a6a6] absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-xs border border-[#dcdcdc] rounded-xl focus:border-[#404040] outline-none text-[#404040] transition-colors"
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#404040] hover:bg-[#262626] text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t.common.loading}</span>
              </>
            ) : (
              <>
                <span>{t.common.signIn}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-[#f0f0f0]">
          <p className="text-xs text-[#707070]">
            Don&apos;t have an account yet?{" "}
            <Link href="/signup" className="text-[#404040] font-bold hover:underline">
              {t.common.signUp}
            </Link>
          </p>
        </div>
      </div>

      {/* Instant Demo Launcher */}
      <div className="bg-white p-5 rounded-2xl border border-[#dcdcdc] shadow-xs">
        <DemoLoginButtons />
      </div>
    </div>
  );
}
