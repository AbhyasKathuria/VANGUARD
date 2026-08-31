import React from "react";
import StatusBadge from "./StatusBadge";
import { CheckCircle2, Clock, PlayCircle, UserCheck } from "lucide-react";

export interface TimelineUpdate {
  id: string;
  message: string;
  status: string;
  timestamp: string | Date;
  user?: {
    id?: string;
    name: string;
    role: string;
  };
}

interface TimelineProps {
  updates: TimelineUpdate[];
}

export default function Timeline({ updates }: TimelineProps) {
  if (!updates || updates.length === 0) {
    return <p className="text-sm text-[#707070] italic">No status updates recorded yet.</p>;
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "resolved":
        return <CheckCircle2 className="w-5 h-5 text-[#404040]" />;
      case "in_progress":
        return <PlayCircle className="w-5 h-5 text-[#707070]" />;
      case "assigned":
        return <UserCheck className="w-5 h-5 text-[#404040]" />;
      case "open":
      default:
        return <Clock className="w-5 h-5 text-[#a6a6a6]" />;
    }
  };

  const getRoleBadge = (role?: string) => {
    if (!role) return null;
    const r = role.toLowerCase();
    switch (r) {
      case "authority":
        return (
          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#404040] text-white">
            Authority
          </span>
        );
      case "worker":
        return (
          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#707070] text-white">
            Worker
          </span>
        );
      case "volunteer":
        return (
          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#a6a6a6] text-black font-semibold">
            Volunteer
          </span>
        );
      case "citizen":
      default:
        return (
          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#f5f5f5] text-[#404040] border border-[#dcdcdc]">
            Citizen
          </span>
        );
    }
  };

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#dcdcdc]">
      {updates.map((upd, idx) => {
        const dateObj = new Date(upd.timestamp);
        const formattedDate = dateObj.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
        const formattedTime = dateObj.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          <div key={upd.id || idx} className="relative group">
            {/* Circle Node Icon */}
            <div className="absolute -left-6 top-0.5 bg-white rounded-full p-0.5 shadow-xs border border-[#dcdcdc]">
              {getStatusIcon(upd.status)}
            </div>

            {/* Content Card */}
            <div className="bg-white p-4 rounded-xl border border-[#dcdcdc] shadow-2xs hover:border-[#a6a6a6] transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <StatusBadge status={upd.status} />
                  {upd.user && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-[#404040]">{upd.user.name}</span>
                      {getRoleBadge(upd.user.role)}
                    </div>
                  )}
                </div>
                <span className="text-xs text-[#707070] font-medium">
                  {formattedDate} · {formattedTime}
                </span>
              </div>
              <p className="text-sm text-[#404040] leading-relaxed font-normal">{upd.message}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
