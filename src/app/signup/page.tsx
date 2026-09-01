"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DashboardLanguageBanner from "@/components/DashboardLanguageBanner";
import { useLanguage } from "@/lib/i18n/context";
import {
  Shield,
  User,
  UserCheck,
  HeartHandshake,
  ShieldCheck,
  Lock,
  Phone,
  MapPin,
  ArrowRight,
  Loader2,
  AlertCircle,
  Briefcase,
  Building,
} from "lucide-react";
import { UserRole } from "@/lib/types";

export default function SignupPage() {
  const router = useRouter();
  const { locale, t } = useLanguage();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const [role, setRole] = useState<UserRole>("citizen");

  // Role-specific fields
  const [profession, setProfession] = useState("Electrician");
  const [organization, setOrganization] = useState("");
  const [area, setArea] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !phone || !password || !location) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      const payload: any = {
        name,
        phone,
        password,
        role,
        location,
        language: locale || "en",
      };

      if (role === "worker") {
        payload.profession = profession;
      } else if (role === "volunteer") {
        payload.organization = organization;
        payload.area = area || location;
      }

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Signup failed. Mobile number may already be registered.");
        return;
      }

      // Redirect based on role with clean page navigation
      let target = "/citizen/dashboard";
      if (role === "worker") target = "/worker/dashboard";
      else if (role === "volunteer") target = "/volunteer/dashboard";
      else if (role === "authority") target = "/authority/dashboard";

      window.location.href = target;
    } catch (err) {
      console.error("Signup error:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const roleOptions: { id: UserRole; title: string; desc: string; icon: any }[] = [
    { id: "citizen", title: t.citizen.portalBadge, desc: t.citizen.newRequestDesc, icon: User },
    { id: "worker", title: t.worker.badge, desc: t.worker.pageDesc, icon: UserCheck },
    { id: "volunteer", title: t.volunteer.badge, desc: t.volunteer.pageDesc, icon: HeartHandshake },
    { id: "authority", title: t.authority.badge, desc: t.authority.pageDesc, icon: ShieldCheck },
  ];

  return (
    <div className="max-w-lg mx-auto py-6 space-y-6">
      {/* 1-Click Multi-Lingual Switcher */}
      <DashboardLanguageBanner />

      {/* Header */}
      <div className="text-center space-y-1.5">
        <div className="inline-flex p-2.5 rounded-2xl bg-[#404040] text-white mb-1 shadow-sm">
          <Shield className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-[#404040]">{t.common.signUp}</h1>
        <p className="text-xs text-[#707070]">
          Select your role to configure your permissions and local service scope.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#dcdcdc] shadow-xs space-y-6">
        {error && (
          <div className="p-3.5 rounded-xl bg-[#f5f5f5] border border-[#707070] flex items-start gap-2.5 text-[#404040] text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#404040]" />
            <span className="leading-tight">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Role Selection Tabs */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#707070] mb-2">
              Select Your Role
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {roleOptions.map((r) => {
                const Icon = r.icon;
                const isSelected = role === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#dcdcdc] border-[#404040] shadow-xs"
                        : "bg-[#f5f5f5] border-[#dcdcdc] hover:bg-[#eaeaea]"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-4 h-4 text-[#404040]" />
                      <span className="text-xs font-bold text-[#404040]">{r.title}</span>
                    </div>
                    <p className="text-[11px] text-[#707070] line-clamp-2 leading-tight">{r.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-[#404040] mb-1.5">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-[#a6a6a6] absolute left-3.5 top-3" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Sharma"
                className="w-full pl-10 pr-4 py-2.5 text-xs border border-[#dcdcdc] rounded-xl focus:border-[#404040] outline-none text-[#404040] transition-colors"
              />
            </div>
          </div>

          {/* Phone Number */}
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
              />
            </div>
          </div>

          {/* Location / Village */}
          <div>
            <label className="block text-xs font-semibold text-[#404040] mb-1.5">
              Village / Town / Ward Location
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-[#a6a6a6] absolute left-3.5 top-3" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Rampur (or Mandya)"
                className="w-full pl-10 pr-4 py-2.5 text-xs border border-[#dcdcdc] rounded-xl focus:border-[#404040] outline-none text-[#404040] transition-colors"
              />
            </div>
          </div>

          {/* Worker Profession Field */}
          {role === "worker" && (
            <div>
              <label className="block text-xs font-semibold text-[#404040] mb-1.5">
                Trade / Profession Specialization
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-[#a6a6a6] absolute left-3.5 top-3" />
                <select
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs border border-[#dcdcdc] rounded-xl focus:border-[#404040] outline-none text-[#404040] bg-white transition-colors"
                >
                  <option value="Electrician">Electrician (Power &amp; Wiring)</option>
                  <option value="Plumber">Plumber (Water Supply &amp; Drainage)</option>
                  <option value="Mason">Mason / Field Worker (Canal &amp; Irrigation)</option>
                  <option value="Health Worker">Health Worker / First Responder</option>
                  <option value="General Handyman">General Handyman</option>
                </select>
              </div>
            </div>
          )}

          {/* Volunteer Organization Field */}
          {role === "volunteer" && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#404040] mb-1.5">
                  Affiliated NGO / Organization (Optional)
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-[#a6a6a6] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. Red Cross, Gram Vikas NGO"
                    className="w-full pl-10 pr-4 py-2.5 text-xs border border-[#dcdcdc] rounded-xl focus:border-[#404040] outline-none text-[#404040] transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Password */}
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
                <span>{t.common.signUp}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-[#f0f0f0]">
          <p className="text-xs text-[#707070]">
            Already have an account?{" "}
            <Link href="/login" className="text-[#404040] font-bold hover:underline">
              {t.common.signIn}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
