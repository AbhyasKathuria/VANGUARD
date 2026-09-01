"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Compass,
  ArrowRight,
  CheckCircle2,
  Play,
  Users,
  ShieldCheck,
  Sliders,
  MessageSquare,
  Sparkles,
} from "lucide-react";

export default function GuidedTour() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "Step 1: Citizen Issue Submission & Priority Mapping",
      role: "citizen",
      phone: "9876543210",
      targetPath: "/citizen/new-request",
      actor: "Ramesh Sharma (Citizen, Rampur UP)",
      description:
        "Log in as Citizen Ramesh. Submit a service request in plain text (e.g. 'Broken electrical wire near village school'). The engine evaluates the category and maps it to MEDIUM Priority.",
      actionLabel: "Launch Step 1 Demo (Citizen Portal)",
    },
    {
      title: "Step 2: Deterministic Nearest-Candidate Dispatch",
      role: "citizen",
      phone: "9876543210",
      targetPath: "/citizen/request/req_101",
      actor: "Deterministic Routing Engine & Geocoder",
      description:
        "Observe how the engine computes Haversine distance (< 15km) and auto-assigns the nearest verified worker (Sunil Electrician). Inspect the live Leaflet GIS map with dispatch coverage radius.",
      actionLabel: "View Live Request Timeline & GIS Pin",
    },
    {
      title: "Step 3: Worker Progress & Site Resolution",
      role: "worker",
      phone: "9876543211",
      targetPath: "/worker/dashboard",
      actor: "Sunil Electrician (Verified Field Worker)",
      description:
        "Log in as Sunil Electrician. Check the live weather advisory for storm risks, click 'Start Work' (IN_PROGRESS), and then 'Mark Complete' (RESOLVED) with an on-site resolution note.",
      actionLabel: "Launch Step 3 Demo (Worker Dashboard)",
    },
    {
      title: "Step 4: Local Authority Triage & Verification Gate",
      role: "authority",
      phone: "9876543213",
      targetPath: "/authority/dashboard",
      actor: "Officer Suresh Verma (Local Authority, Rampur)",
      description:
        "Log in as Local Authority. Review open requests awaiting triage, manually assign staff across villages, and toggle personnel verification status (enforcing the Hard Gate).",
      actionLabel: "Launch Step 4 Demo (Authority Center)",
    },
    {
      title: "Step 5: Super Admin State Oversight & API Diagnostics",
      role: "super_admin",
      phone: "9876543200",
      targetPath: "/superadmin/dashboard",
      actor: "Officer Rajeshwar Rao (Super Admin, State HQ)",
      description:
        "Log in as Super Admin. Monitor aggregate resolution rates across all 6 districts (Rampur, Sitapur, Mandya, Shivamogga, Kolar, Belagavi) and inspect real-time API adapter diagnostics.",
      actionLabel: "Launch Step 5 Demo (Super Admin HQ)",
    },
    {
      title: "Step 6: Low-Bandwidth WhatsApp Bot Workflow",
      role: "bot",
      phone: "",
      targetPath: "",
      actor: "Meta Cloud API / In-Browser WhatsApp Simulator",
      description:
        "Click the green 'WhatsApp Bot Demo' button in the bottom right corner. Type 'HI', select category '1', provide issue details, and observe instant bot dispatch & worker SMS resolution.",
      actionLabel: "Open WhatsApp Simulator",
      isSimulatorTrigger: true,
    },
  ];

  const handleStepAction = async (step: (typeof steps)[0]) => {
    if (step.isSimulatorTrigger) {
      // Trigger whatsapp simulator modal by clicking floating button
      const floatingBtn = document.querySelector('button[title="Open WhatsApp Bot Simulator"]') as HTMLButtonElement;
      if (floatingBtn) floatingBtn.click();
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: step.phone, password: "password123" }),
      });

      if (res.ok) {
        router.push(step.targetPath);
        router.refresh();
      }
    } catch (err) {
      console.error("Tour jump error:", err);
    }
  };

  const current = steps[activeStep];

  return (
    <div className="bg-white rounded-3xl border border-[#dcdcdc] p-6 sm:p-7 shadow-xs space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#262626] text-white">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#262626] flex items-center gap-1.5">
              2-Minute Evaluator Guided Tour
              <Sparkles className="w-4 h-4 text-[#25D366]" />
            </h2>
            <p className="text-xs text-[#707070]">
              Step-by-step walkthrough demonstrating the full end-to-end rural dispatch lifecycle.
            </p>
          </div>
        </div>

        {/* Step counter */}
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#f0f0f0] text-[#404040]">
          Step {activeStep + 1} of {steps.length}
        </span>
      </div>

      {/* Step Indicators */}
      <div className="grid grid-cols-6 gap-1.5">
        {steps.map((s, idx) => (
          <button
            key={idx}
            onClick={() => setActiveStep(idx)}
            className={`h-2 rounded-full transition-all cursor-pointer ${
              idx === activeStep
                ? "bg-[#262626] w-full"
                : idx < activeStep
                ? "bg-[#25D366]"
                : "bg-[#e5e5e5]"
            }`}
            title={s.title}
          />
        ))}
      </div>

      {/* Active Step Content Card */}
      <div className="bg-[#f9f9f9] p-5 rounded-2xl border border-[#e5e5e5] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-[#262626]">{current.title}</h3>
          <span className="text-[11px] font-semibold text-[#707070] bg-white px-2 py-0.5 rounded-md border border-[#dcdcdc]">
            Actor: {current.actor}
          </span>
        </div>

        <p className="text-xs text-[#545454] leading-relaxed">{current.description}</p>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
              disabled={activeStep === 0}
              className="px-3 py-1.5 rounded-xl border border-[#dcdcdc] text-xs font-semibold text-[#707070] disabled:opacity-30 bg-white hover:bg-[#f0f0f0] cursor-pointer"
            >
              Previous
            </button>
            <button
              onClick={() => setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))}
              disabled={activeStep === steps.length - 1}
              className="px-3 py-1.5 rounded-xl border border-[#dcdcdc] text-xs font-semibold text-[#707070] disabled:opacity-30 bg-white hover:bg-[#f0f0f0] cursor-pointer"
            >
              Next Step
            </button>
          </div>

          <button
            onClick={() => handleStepAction(current)}
            className="px-4 py-2 bg-[#262626] hover:bg-black text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            {current.actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
