"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DemoLoginButtons from "@/components/DemoLoginButtons";
import { Shield, Lock, Phone, ArrowRight, Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
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

      // Redirect based on user role
      const role = data.user?.role;
      if (role === "worker") router.push("/worker/dashboard");
      else if (role === "volunteer") router.push("/volunteer/dashboard");
      else if (role === "authority") router.push("/authority/dashboard");
      else router.push("/citizen/dashboard");

      router.refresh();
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 rounded-2xl bg-[#404040] text-white mb-1 shadow-sm">
          <Shield className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-[#404040]">Sign in to VANGUARD</h1>
        <p className="text-xs text-[#707070]">
          Enter your registered phone number or select a demo role below.
        </p>
      </div>

      {/* Demo Quick Logins Box */}
      <div className="bg-white p-5 rounded-2xl border border-[#dcdcdc] shadow-xs">
        <DemoLoginButtons />
      </div>

      {/* Manual Login Form */}
      <div className="bg-white p-6 rounded-2xl border border-[#dcdcdc] shadow-xs space-y-5">
        <div className="relative flex items-center justify-center">
          <div className="border-t border-[#dcdcdc] w-full"></div>
          <span className="bg-white px-3 text-xs font-bold uppercase tracking-wider text-[#a6a6a6] absolute">
            Or Use Password
          </span>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-[#f5f5f5] border border-[#707070] flex items-start gap-2.5 text-[#404040] text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#404040]" />
            <span className="leading-tight">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#404040] mb-1">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#a6a6a6] absolute left-3 top-3" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full pl-9 pr-3 py-2 text-sm border border-[#dcdcdc] rounded-xl focus:border-[#404040] outline-none bg-[#f5f5f5] focus:bg-white text-[#404040]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#404040] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#a6a6a6] absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-sm border border-[#dcdcdc] rounded-xl focus:border-[#404040] outline-none bg-[#f5f5f5] focus:bg-white text-[#404040]"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-[#404040] hover:bg-[#262626] text-white font-bold text-sm rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing In...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-[#707070]">
            Don&apos;t have an account yet?{" "}
            <Link href="/signup" className="text-[#404040] font-bold hover:underline">
              Create New Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
