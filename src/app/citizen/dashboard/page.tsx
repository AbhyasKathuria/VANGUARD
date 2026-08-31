"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import PriorityBadge from "@/components/PriorityBadge";
import CategoryBadge from "@/components/CategoryBadge";
import { PlusCircle, Clock, MapPin, ArrowRight, Loader2, RefreshCw, AlertCircle } from "lucide-react";

export default function CitizenDashboard() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMyRequests = async () => {
    try {
      const res = await fetch("/api/requests");
      const data = await res.json();
      if (res.ok) {
        setRequests(data.requests || []);
      }
    } catch (err) {
      console.error("Failed to fetch citizen requests:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMyRequests();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-[#dcdcdc] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#404040] bg-[#f5f5f5] px-2.5 py-1 rounded-md border border-[#dcdcdc]">
            Citizen Portal
          </span>
          <h1 className="text-2xl font-extrabold text-[#404040] mt-2">My Service Requests</h1>
          <p className="text-xs text-[#707070] mt-0.5">
            Track real-time status changes and view response timelines for your reported issues.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => {
              setRefreshing(true);
              fetchMyRequests();
            }}
            disabled={refreshing}
            className="p-2.5 rounded-xl border border-[#dcdcdc] hover:bg-[#f5f5f5] text-[#404040] transition-colors"
            title="Refresh requests"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          </button>

          <Link
            href="/citizen/new-request"
            className="flex-1 sm:flex-none px-4 py-2.5 bg-[#404040] hover:bg-[#262626] text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Raise New Request
          </Link>
        </div>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="bg-white p-12 rounded-2xl border border-[#dcdcdc] flex flex-col items-center justify-center text-[#707070] gap-3">
          <Loader2 className="w-7 h-7 animate-spin text-[#404040]" />
          <span className="text-xs font-medium">Loading your requests...</span>
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-[#dcdcdc] text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#f5f5f5] text-[#404040] flex items-center justify-center mx-auto border border-[#dcdcdc]">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#404040]">No requests raised yet</h3>
            <p className="text-xs text-[#707070] max-w-sm mx-auto mt-1">
              Have a problem with electricity, water, health, or farming? Submit a request and our system will route it automatically.
            </p>
          </div>
          <Link
            href="/citizen/new-request"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#404040] hover:bg-[#262626] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            Raise Your First Request
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requests.map((req) => {
            const dateObj = new Date(req.createdAt);
            const formattedDate = dateObj.toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });

            return (
              <div
                key={req.id}
                className="bg-white p-5 rounded-2xl border border-[#dcdcdc] shadow-2xs hover:shadow-xs hover:border-[#a6a6a6] transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <CategoryBadge category={req.category} />
                    <div className="flex items-center gap-2">
                      <PriorityBadge priority={req.priority} />
                      <StatusBadge status={req.status} />
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm font-semibold text-[#404040] line-clamp-2 leading-relaxed">
                    {req.description}
                  </p>

                  {/* Metadata */}
                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-[#707070]">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#a6a6a6]" />
                      {req.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#a6a6a6]" />
                      {formattedDate}
                    </span>
                  </div>

                  {/* Assigned Person Tag */}
                  {req.assignedTo ? (
                    <div className="p-2.5 bg-[#f5f5f5] rounded-xl border border-[#dcdcdc] flex items-center justify-between text-xs">
                      <span className="text-[#707070] font-medium">Assigned to:</span>
                      <span className="font-bold text-[#404040]">
                        {req.assignedTo.name} ({req.assignedTo.role})
                      </span>
                    </div>
                  ) : (
                    <div className="p-2.5 bg-[#f5f5f5] rounded-xl border border-[#dcdcdc] flex items-center gap-1.5 text-xs text-[#707070]">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 text-[#707070]" />
                      <span>Queued for Local Authority assignment</span>
                    </div>
                  )}
                </div>

                {/* Footer Action */}
                <div className="pt-2 border-t border-[#f5f5f5] flex items-center justify-end">
                  <Link
                    href={`/citizen/request/${req.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#404040] hover:text-[#141414] group"
                  >
                    View Status History &amp; Timeline
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
