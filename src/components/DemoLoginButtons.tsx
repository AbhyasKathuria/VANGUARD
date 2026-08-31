"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { UserCheck, ShieldCheck, HeartHandshake, User, Loader2 } from "lucide-react";

export default function DemoLoginButtons() {
  const router = useRouter();
  const [loadingRole, setLoadingRole] = useState<string | null>(null);

  const demoAccounts = [
    {
      role: "citizen",
      title: "Citizen Demo",
      name: "Ramesh Sharma",
      phone: "9876543210",
      icon: User,
      bgColor: "bg-white hover:bg-[#fafafa] border-[#dcdcdc] text-[#404040]",
      accent: "text-[#707070] font-semibold",
      badge: "Submit & Track Requests",
    },
    {
      role: "worker",
      title: "Worker Demo",
      name: "Sunil Electrician",
      phone: "9876543211",
      icon: UserCheck,
      bgColor: "bg-white hover:bg-[#fafafa] border-[#dcdcdc] text-[#404040]",
      accent: "text-[#707070] font-semibold",
      badge: "Assigned Tasks & Updates",
    },
    {
      role: "volunteer",
      title: "Volunteer Demo",
      name: "Pooja (NGO)",
      phone: "9876543212",
      icon: HeartHandshake,
      bgColor: "bg-white hover:bg-[#fafafa] border-[#dcdcdc] text-[#404040]",
      accent: "text-[#707070] font-semibold",
      badge: "Community Pool & Claim",
    },
    {
      role: "authority",
      title: "Authority Demo",
      name: "Officer Suresh",
      phone: "9876543213",
      icon: ShieldCheck,
      bgColor: "bg-white hover:bg-[#fafafa] border-[#dcdcdc] text-[#404040]",
      accent: "text-[#707070] font-semibold",
      badge: "Full Triage & Dispatch",
    },
  ];

  const handleDemoLogin = async (phone: string, role: string) => {
    try {
      setLoadingRole(role);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password: "password123" }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to log in as demo user");
        return;
      }

      router.push(`/${role}/dashboard`);
      router.refresh();
    } catch (err) {
      console.error("Demo login error:", err);
      alert("Error logging into demo account.");
    } finally {
      setLoadingRole(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-[#707070]">
          ⚡ 1-Click Instant Demo Logins
        </span>
        <span className="text-[11px] text-[#a6a6a6]">Default password: password123</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {demoAccounts.map((acc) => {
          const Icon = acc.icon;
          const isLoading = loadingRole === acc.role;

          return (
            <button
              key={acc.role}
              type="button"
              disabled={loadingRole !== null}
              onClick={() => handleDemoLogin(acc.phone, acc.role)}
              className={`flex items-start gap-3 p-3 text-left rounded-xl border transition-all duration-150 ${acc.bgColor} ${
                loadingRole !== null ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:border-[#707070] active:scale-[0.98] shadow-2xs"
              }`}
            >
              <div className="p-2 rounded-lg bg-[#f5f5f5] text-[#404040] border border-[#dcdcdc] shrink-0 mt-0.5">
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#404040]" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#404040]">{acc.title}</span>
                  <span className="text-[10px] text-[#707070] font-mono">{acc.phone}</span>
                </div>
                <p className="text-xs text-[#707070] truncate mt-0.5">{acc.name}</p>
                <p className={`text-[11px] mt-1 ${acc.accent}`}>{acc.badge}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
