import React from "react";
import Link from "next/link";
import DemoLoginButtons from "@/components/DemoLoginButtons";
import {
  Shield,
  ArrowRight,
  User,
  UserCheck,
  HeartHandshake,
  ShieldCheck,
  Zap,
  Route,
  History,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto py-8 space-y-10">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#dcdcdc] border border-[#a6a6a6] text-[#404040] text-xs font-bold uppercase tracking-wider shadow-2xs">
          <Zap className="w-3.5 h-3.5" />
          Frozen Scope MVP Live
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#404040] tracking-tight leading-tight">
          Rural Service Routing Platform
        </h1>
        <p className="text-base sm:text-lg text-[#707070] max-w-2xl mx-auto leading-relaxed">
          A rural citizen shouldn&apos;t need to know which department to contact — they describe their problem in plain text, and the system automatically routes it to the nearest available verified person.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/login"
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#404040] hover:bg-[#262626] shadow-sm transition-all flex items-center gap-2"
          >
            Sign In to Account
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/signup"
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-[#404040] bg-[#dcdcdc] hover:bg-[#c5c5c5] border border-[#a6a6a6] shadow-2xs transition-all"
          >
            Create New Account
          </Link>
        </div>
      </div>

      {/* 1-Click Instant Demo Box */}
      <div className="bg-white p-6 rounded-2xl border border-[#dcdcdc] shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="bg-[#404040] text-white p-2 rounded-xl shadow-xs">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#404040]">Instant Role Demo Launcher</h2>
            <p className="text-xs text-[#707070]">
              Click any button below to instantly log in as a pre-seeded test user with simulated workflow data.
            </p>
          </div>
        </div>

        <DemoLoginButtons />
      </div>

      {/* 4 User Roles Grid */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#707070] text-center">
          Platform User Roles &amp; Permissions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#dcdcdc] shadow-2xs space-y-2 hover:border-[#a6a6a6] transition-colors">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#f5f5f5] text-[#404040] border border-[#dcdcdc]">
                <User className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#404040]">1. Citizen</h3>
            </div>
            <p className="text-xs text-[#707070] leading-relaxed">
              Submit plain text requests (Health, Civic, Emergency, Farming), view own request history, and track real-time status updates and resolution notes.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#dcdcdc] shadow-2xs space-y-2 hover:border-[#a6a6a6] transition-colors">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#f5f5f5] text-[#404040] border border-[#dcdcdc]">
                <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#404040]">2. Worker</h3>
            </div>
            <p className="text-xs text-[#707070] leading-relaxed">
              View jobs auto-assigned by the routing engine, accept tasks, update progress status to <em>In Progress</em>, and mark requests as <em>Resolved</em>.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#dcdcdc] shadow-2xs space-y-2 hover:border-[#a6a6a6] transition-colors">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#f5f5f5] text-[#404040] border border-[#dcdcdc]">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#404040]">3. Volunteer</h3>
            </div>
            <p className="text-xs text-[#707070] leading-relaxed">
              Handle emergency and community assignments, submit requests on behalf of other citizens, and claim unassigned open tasks from the community pool.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#dcdcdc] shadow-2xs space-y-2 hover:border-[#a6a6a6] transition-colors">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#f5f5f5] text-[#404040] border border-[#dcdcdc]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#404040]">4. Local Authority</h3>
            </div>
            <p className="text-xs text-[#707070] leading-relaxed">
              View all requests across the district, manually assign or reassign open issues to verified workers/volunteers, verify personnel, and track aggregate resolution metrics.
            </p>
          </div>
        </div>
      </div>

      {/* Key Principles */}
      <div className="bg-white rounded-2xl p-6 border border-[#dcdcdc] shadow-2xs grid grid-cols-1 md:grid-cols-3 gap-6 text-center sm:text-left">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[#404040] font-bold text-sm">
            <Route className="w-4 h-4 text-[#707070]" />
            Rule-Based Routing
          </div>
          <p className="text-xs text-[#707070]">
            Category-to-priority mapping and verified local worker matching without opaque ML dependencies.
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[#404040] font-bold text-sm">
            <History className="w-4 h-4 text-[#707070]" />
            In-App Audit Trail
          </div>
          <p className="text-xs text-[#707070]">
            Every status change logs an immutable timestamped event with the actor&apos;s role and explanation.
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[#404040] font-bold text-sm">
            <Shield className="w-4 h-4 text-[#707070]" />
            Strict API Role Checks
          </div>
          <p className="text-xs text-[#707070]">
            Permissions are guarded at the API and database levels, ensuring strict privacy and access isolation.
          </p>
        </div>
      </div>
    </div>
  );
}
