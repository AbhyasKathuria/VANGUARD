"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
        language: "en",
      };

      if (role === "worker") {
        payload.profession = profession;
      } else if (role === "volunteer") {
        payload.organization = organization || "Community Volunteer";
        payload.area = area || location;
      }

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create account.");
        return;
      }

      // Redirect to role dashboard
      if (role === "worker") router.push("/worker/dashboard");
      else if (role === "volunteer") router.push("/volunteer/dashboard");
      else if (role === "authority") router.push("/authority/dashboard");
      else router.push("/citizen/dashboard");

      router.refresh();
    } catch (err) {
      console.error("Signup error:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const roleOptions: { id: UserRole; title: string; desc: string; icon: any }[] = [
    { id: "citizen", title: "Citizen", desc: "Submit and track service requests", icon: User },
    { id: "worker", title: "Worker", desc: "Accept & execute local service jobs", icon: UserCheck },
    { id: "volunteer", title: "Volunteer", desc: "Assist neighbors & handle emergency calls", icon: HeartHandshake },
    { id: "authority", title: "Local Authority", desc: "Review, triage, and dispatch requests", icon: ShieldCheck },
  ];

  return (
    <div className="max-w-lg mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-1.5">
        <div className="inline-flex p-2.5 rounded-2xl bg-[#404040] text-white mb-1 shadow-sm">
          <Shield className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-[#404040]">Create a VANGUARD Account</h1>
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
                      <Icon className={`w-4 h-4 ${isSelected ? "text-[#404040]" : "text-[#707070]"}`} />
                      <span className={`text-xs font-bold ${isSelected ? "text-[#262626]" : "text-[#404040]"}`}>
                        {r.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#707070] leading-tight">{r.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Standard Fields */}
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#404040] mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#a6a6a6] absolute left-3 top-3" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Sharma"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-[#dcdcdc] rounded-xl focus:border-[#404040] outline-none bg-[#f5f5f5] focus:bg-white text-[#404040]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#404040] mb-1">Phone Number</label>
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
                <label className="block text-xs font-semibold text-[#404040] mb-1">Location / Village</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#a6a6a6] absolute left-3 top-3" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Rampur"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-[#dcdcdc] rounded-xl focus:border-[#404040] outline-none bg-[#f5f5f5] focus:bg-white text-[#404040]"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#404040] mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#a6a6a6] absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-[#dcdcdc] rounded-xl focus:border-[#404040] outline-none bg-[#f5f5f5] focus:bg-white text-[#404040]"
                  required
                />
              </div>
            </div>
          </div>

          {/* Role-Specific Additional Fields */}
          {role === "worker" && (
            <div className="p-4 bg-[#f5f5f5] rounded-xl border border-[#dcdcdc] space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#404040]">
                <Briefcase className="w-4 h-4 text-[#707070]" />
                Worker Profile Details
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#404040] mb-1">Profession / Trade</label>
                <select
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#dcdcdc] rounded-xl bg-white focus:border-[#404040] outline-none text-[#404040]"
                >
                  <option value="Electrician">Electrician</option>
                  <option value="Plumber">Plumber</option>
                  <option value="Mason / Construction">Mason / Construction</option>
                  <option value="Carpenter">Carpenter</option>
                  <option value="Farm Labor">Farm Labor / Harvester</option>
                  <option value="Health Worker">Health Worker / First Aid</option>
                  <option value="Handyman / General">Handyman / General</option>
                </select>
                <p className="text-[11px] text-[#707070] mt-1">
                  Your profile will be auto-matched to requests in your location.
                </p>
              </div>
            </div>
          )}

          {role === "volunteer" && (
            <div className="p-4 bg-[#f5f5f5] rounded-xl border border-[#dcdcdc] space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#404040]">
                <Building className="w-4 h-4 text-[#707070]" />
                Volunteer Details
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#404040] mb-1">
                  Affiliated Organization / Group
                </label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. Rural Care NGO / Independent Volunteer"
                  className="w-full px-3 py-2 text-sm border border-[#dcdcdc] rounded-xl bg-white focus:border-[#404040] outline-none text-[#404040]"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-[#404040] hover:bg-[#262626] text-white font-bold text-sm rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                Complete Registration
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-1">
          <p className="text-xs text-[#707070]">
            Already have an account?{" "}
            <Link href="/login" className="text-[#404040] font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
