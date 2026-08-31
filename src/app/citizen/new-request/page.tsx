"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  HeartPulse,
  Wrench,
  Siren,
  Sprout,
  Layers,
  MapPin,
  FileText,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { RequestCategory } from "@/lib/types";

export default function NewRequestPage() {
  const router = useRouter();

  const [category, setCategory] = useState<RequestCategory>("civic");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [routedResult, setRoutedResult] = useState<any>(null);

  const categories: { id: RequestCategory; label: string; desc: string; icon: any; priority: string; badgeColor: string }[] = [
    {
      id: "civic",
      label: "Civic / Infrastructure",
      desc: "Electricity, broken wire, drainage, water supply, roads",
      icon: Wrench,
      priority: "MEDIUM Priority",
      badgeColor: "bg-[#dcdcdc] text-[#404040] border-[#a6a6a6]",
    },
    {
      id: "health",
      label: "Health / Medical",
      desc: "First aid, primary care visit, medication delivery",
      icon: HeartPulse,
      priority: "HIGH Priority",
      badgeColor: "bg-[#404040] text-white border-[#262626] font-bold",
    },
    {
      id: "emergency",
      label: "Emergency",
      desc: "Immediate hazard, accident, fire, sudden danger",
      icon: Siren,
      priority: "HIGH Priority",
      badgeColor: "bg-[#262626] text-white border-[#707070] font-black animate-pulse",
    },
    {
      id: "farming",
      label: "Farming / Agriculture",
      desc: "Harvest labor, irrigation channel leak, equipment assistance",
      icon: Sprout,
      priority: "LOW Priority",
      badgeColor: "bg-[#f5f5f5] text-[#707070] border-[#dcdcdc]",
    },
    {
      id: "other",
      label: "General / Other",
      desc: "Community assistance or miscellaneous public need",
      icon: Layers,
      priority: "MEDIUM Priority",
      badgeColor: "bg-[#f5f5f5] text-[#404040] border-[#dcdcdc]",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!location.trim() || !description.trim()) {
      setError("Please specify both location and problem description.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          location: location.trim(),
          description: description.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to submit request.");
        return;
      }

      setRoutedResult(data);
      // Wait 1.5s to let user view routing match result before redirecting
      setTimeout(() => {
        router.push(`/citizen/request/${data.request.id}`);
      }, 1500);
    } catch (err) {
      console.error("Submission error:", err);
      setError("Network error. Could not submit request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-6">
      {/* Back button */}
      <Link
        href="/citizen/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#707070] hover:text-[#404040] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to My Requests
      </Link>

      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#dcdcdc] shadow-xs space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#404040] bg-[#f5f5f5] px-2 py-0.5 rounded border border-[#dcdcdc]">
            Rule-Based Routing
          </span>
          <h1 className="text-2xl font-extrabold text-[#404040] mt-2">Submit Service Request</h1>
          <p className="text-xs text-[#707070] mt-1">
            Describe your problem in plain text. The system maps priority and auto-routes to verified personnel in your area.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-[#f5f5f5] border border-[#707070] flex items-start gap-2.5 text-[#404040] text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-tight">{error}</span>
          </div>
        )}

        {routedResult && (
          <div className="p-4 rounded-xl bg-[#f5f5f5] border border-[#404040] text-[#404040] text-xs space-y-2 animate-in fade-in">
            <div className="flex items-center gap-2 font-bold text-sm text-[#262626]">
              <CheckCircle2 className="w-5 h-5 text-[#404040]" />
              Request Submitted &amp; Routed Successfully!
            </div>
            <p className="text-[#545454] leading-relaxed font-medium">
              {routedResult.routing?.auditMessage}
            </p>
            <p className="text-[11px] text-[#707070] italic">Redirecting to status timeline...</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#707070] mb-2">
              1. Select Problem Category
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {categories.map((c) => {
                const Icon = c.icon;
                const isSelected = category === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(c.id)}
                    className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#dcdcdc] border-[#404040] shadow-xs"
                        : "bg-[#f5f5f5] border-[#dcdcdc] hover:bg-[#eaeaea]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${isSelected ? "text-[#404040]" : "text-[#707070]"}`} />
                        <span className={`text-xs font-bold ${isSelected ? "text-[#262626]" : "text-[#404040]"}`}>
                          {c.label}
                        </span>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border font-semibold ${c.badgeColor}`}>
                        {c.priority}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#707070] leading-tight">{c.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#707070] mb-1">
              2. Location / Village / Ward
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-[#a6a6a6] absolute left-3 top-3" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Rampur (or Rampur Ward 4)"
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-[#dcdcdc] rounded-xl focus:border-[#404040] outline-none bg-[#f5f5f5] focus:bg-white text-[#404040]"
                required
              />
            </div>
            <p className="text-[11px] text-[#a6a6a6] mt-1">
              Tip: Enter &quot;Rampur&quot; to auto-match with the demo verified worker or volunteer in Rampur.
            </p>
          </div>

          {/* Plain Text Description Textarea */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#707070] mb-1">
              3. Describe the Problem
            </label>
            <div className="relative">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Describe what happened, where the issue is, and what help is needed..."
                className="w-full p-3 text-sm border border-[#dcdcdc] rounded-xl focus:border-[#404040] outline-none bg-[#f5f5f5] focus:bg-white text-[#404040] leading-relaxed"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || routedResult !== null}
            className="w-full py-3 px-4 bg-[#404040] hover:bg-[#262626] text-white font-bold text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Routing &amp; Submitting...
              </>
            ) : (
              <>
                Submit &amp; Route Request
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
