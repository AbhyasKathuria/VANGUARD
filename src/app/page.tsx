"use client";

import React from "react";
import Link from "next/link";
import DemoLoginButtons from "@/components/DemoLoginButtons";
import GuidedTour from "@/components/GuidedTour";
import VanguardLogo from "@/components/VanguardLogo";
import { useLanguage } from "@/lib/i18n/context";
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
  Sliders,
  Layers,
  HelpCircle,
} from "lucide-react";

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-10">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-2">
          <div className="p-3 bg-white rounded-3xl border border-[#dcdcdc] shadow-xs inline-flex items-center justify-center">
            <VanguardLogo size={44} />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#dcdcdc] border border-[#a6a6a6] text-[#262626] text-xs font-extrabold uppercase tracking-wider shadow-2xs">
          <Zap className="w-3.5 h-3.5 text-[#25D366]" />
          {t.landing.badge}
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#262626] tracking-tight leading-tight">
          {t.landing.headline || "Where Tradition Meets Technology"}
        </h1>
        <p className="text-base sm:text-lg text-[#545454] max-w-2xl mx-auto leading-relaxed">
          {t.landing.subheadline}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/login"
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#262626] hover:bg-black shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            {t.landing.signInBtn}
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/services"
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-[#404040] bg-white hover:bg-[#f5f5f5] border border-[#dcdcdc] shadow-2xs transition-all flex items-center gap-1.5"
          >
            <Layers className="w-4 h-4 text-[#707070]" />
            {t.nav.services}
          </Link>
          <Link
            href="/faq"
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-[#404040] bg-white hover:bg-[#f5f5f5] border border-[#dcdcdc] shadow-2xs transition-all flex items-center gap-1.5"
          >
            <HelpCircle className="w-4 h-4 text-[#707070]" />
            {t.nav.faq}
          </Link>
        </div>
      </div>

      {/* Scripted 2-Minute Evaluator Guided Tour */}
      <GuidedTour />

      {/* 1-Click Instant Demo Box */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#dcdcdc] shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="bg-[#262626] text-white p-2 rounded-xl shadow-xs">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#262626]">{t.landing.demoLauncherTitle}</h2>
            <p className="text-xs text-[#707070]">{t.landing.demoLauncherDesc}</p>
          </div>
        </div>

        <DemoLoginButtons />
      </div>

      {/* 5 User Roles Grid */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#707070] text-center">
          {t.landing.rolesTitle}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#dcdcdc] shadow-2xs space-y-2 hover:border-[#a6a6a6] transition-colors">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#f5f5f5] text-[#404040] border border-[#dcdcdc]">
                <User className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#262626]">1. {t.citizen.portalBadge}</h3>
            </div>
            <p className="text-xs text-[#707070] leading-relaxed">
              {t.citizen.newRequestDesc}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#dcdcdc] shadow-2xs space-y-2 hover:border-[#a6a6a6] transition-colors">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#f5f5f5] text-[#404040] border border-[#dcdcdc]">
                <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#262626]">2. {t.worker.badge}</h3>
            </div>
            <p className="text-xs text-[#707070] leading-relaxed">
              {t.worker.pageDesc}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#dcdcdc] shadow-2xs space-y-2 hover:border-[#a6a6a6] transition-colors">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#f5f5f5] text-[#404040] border border-[#dcdcdc]">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#262626]">3. {t.volunteer.badge}</h3>
            </div>
            <p className="text-xs text-[#707070] leading-relaxed">
              {t.volunteer.pageDesc}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#dcdcdc] shadow-2xs space-y-2 hover:border-[#a6a6a6] transition-colors">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#f5f5f5] text-[#404040] border border-[#dcdcdc]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#262626]">4. {t.authority.badge}</h3>
            </div>
            <p className="text-xs text-[#707070] leading-relaxed">
              {t.authority.pageDesc}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#dcdcdc] shadow-2xs space-y-2 hover:border-[#a6a6a6] transition-colors sm:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#111827] text-[#53bdeb] border border-[#374151]">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#262626]">5. {t.nav.superAdminCenter}</h3>
            </div>
            <p className="text-xs text-[#707070] leading-relaxed">
              {t.authority.tabAllRequests} &amp; {t.authority.tabPersonnel}
            </p>
          </div>
        </div>
      </div>

      {/* Core Engineering Principles */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#dcdcdc] shadow-2xs grid grid-cols-1 md:grid-cols-3 gap-6 text-center sm:text-left">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[#262626] font-bold text-sm">
            <Route className="w-4 h-4 text-[#707070]" />
            {t.landing.feature1Title}
          </div>
          <p className="text-xs text-[#707070]">
            {t.landing.feature1Desc}
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[#262626] font-bold text-sm">
            <History className="w-4 h-4 text-[#707070]" />
            {t.landing.feature2Title}
          </div>
          <p className="text-xs text-[#707070]">
            {t.landing.feature2Desc}
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[#262626] font-bold text-sm">
            <Shield className="w-4 h-4 text-[#707070]" />
            {t.landing.feature3Title}
          </div>
          <p className="text-xs text-[#707070]">
            {t.landing.feature3Desc}
          </p>
        </div>
      </div>
    </div>
  );
}
