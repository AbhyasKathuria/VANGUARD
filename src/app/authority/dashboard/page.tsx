"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import PriorityBadge from "@/components/PriorityBadge";
import CategoryBadge from "@/components/CategoryBadge";
import {
  Shield,
  ShieldCheck,
  Clock,
  CheckCircle2,
  RefreshCw,
  Loader2,
  Users,
  Search,
  X,
  Send,
  Eye,
} from "lucide-react";

export default function AuthorityDashboard() {
  const [stats, setStats] = useState<any>({
    total: 0,
    open: 0,
    assigned: 0,
    inProgress: 0,
    resolved: 0,
    verifiedWorkers: 0,
    verifiedVolunteers: 0,
  });

  const [activeMainTab, setActiveMainTab] = useState<"requests" | "personnel">("requests");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [requests, setRequests] = useState<any[]>([]);
  const [assignees, setAssignees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Manual Assignment Modal
  const [assigningReq, setAssigningReq] = useState<any | null>(null);
  const [selectedAssigneeId, setSelectedAssigneeId] = useState("");
  const [assignmentNote, setAssignmentNote] = useState("");
  const [submittingAssign, setSubmittingAssign] = useState(false);

  // Verification Toggle State
  const [togglingVerifyId, setTogglingVerifyId] = useState<string | null>(null);

  const fetchAuthorityData = async () => {
    try {
      const [statsRes, reqsRes, assigneesRes] = await Promise.all([
        fetch("/api/authority/stats"),
        fetch(`/api/requests?status=${statusFilter}&category=${categoryFilter}`),
        fetch("/api/authority/assignees"),
      ]);

      if (statsRes.ok) {
        const d = await statsRes.json();
        setStats(d.stats);
      }
      if (reqsRes.ok) {
        const d = await reqsRes.json();
        setRequests(d.requests || []);
      }
      if (assigneesRes.ok) {
        const d = await assigneesRes.json();
        setAssignees(d.assignees || []);
      }
    } catch (err) {
      console.error("Authority data fetch error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchAuthorityData();
  }, [statusFilter, categoryFilter]);

  const handleManualAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningReq || !selectedAssigneeId) return;

    try {
      setSubmittingAssign(true);
      const res = await fetch(`/api/requests/${assigningReq.id}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assigneeId: selectedAssigneeId,
          note: assignmentNote,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to assign request");
        return;
      }

      setAssigningReq(null);
      setSelectedAssigneeId("");
      setAssignmentNote("");
      fetchAuthorityData();
    } catch (err) {
      console.error("Assign error:", err);
      alert("Network error during assignment.");
    } finally {
      setSubmittingAssign(false);
    }
  };

  const handleToggleVerification = async (userId: string, role: string, currentVerified: boolean) => {
    try {
      setTogglingVerifyId(userId);
      const res = await fetch("/api/authority/verify", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          role,
          verified: !currentVerified,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to update verification status.");
        return;
      }

      fetchAuthorityData();
    } catch (err) {
      console.error("Verify toggle error:", err);
    } finally {
      setTogglingVerifyId(null);
    }
  };

  const filteredRequests = requests.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.description?.toLowerCase().includes(q) ||
      r.location?.toLowerCase().includes(q) ||
      r.user?.name?.toLowerCase().includes(q) ||
      r.assignedTo?.name?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#dcdcdc] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#404040] bg-[#f5f5f5] px-2.5 py-1 rounded-md border border-[#dcdcdc]">
            Local Authority Command Center
          </span>
          <h1 className="text-2xl font-extrabold text-[#404040] mt-2">Civic Triage &amp; Dispatch</h1>
          <p className="text-xs text-[#707070] mt-0.5">
            Monitor all village service requests, resolve bottlenecks, and manage verified local personnel.
          </p>
        </div>

        <button
          onClick={() => {
            setRefreshing(true);
            fetchAuthorityData();
          }}
          disabled={refreshing}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#dcdcdc] hover:bg-[#f5f5f5] text-[#404040] text-xs font-semibold transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
          Refresh Data
        </button>
      </div>

      {/* Aggregate Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-xl border border-[#dcdcdc] shadow-2xs">
          <span className="text-[11px] font-semibold text-[#707070] uppercase tracking-wider block">Total Raised</span>
          <span className="text-2xl font-extrabold text-[#404040]">{stats.total}</span>
        </div>

        <div className="bg-[#f5f5f5] p-4 rounded-xl border border-[#dcdcdc] shadow-2xs">
          <span className="text-[11px] font-bold text-[#707070] uppercase tracking-wider block">Open / Queued</span>
          <span className="text-2xl font-extrabold text-[#404040]">{stats.open}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#dcdcdc] shadow-2xs">
          <span className="text-[11px] font-bold text-[#707070] uppercase tracking-wider block">Assigned</span>
          <span className="text-2xl font-extrabold text-[#404040]">{stats.assigned}</span>
        </div>

        <div className="bg-[#f5f5f5] p-4 rounded-xl border border-[#dcdcdc] shadow-2xs">
          <span className="text-[11px] font-bold text-[#707070] uppercase tracking-wider block">In Progress</span>
          <span className="text-2xl font-extrabold text-[#404040]">{stats.inProgress}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#dcdcdc] shadow-2xs">
          <span className="text-[11px] font-bold text-[#707070] uppercase tracking-wider block">Resolved</span>
          <span className="text-2xl font-extrabold text-[#404040]">{stats.resolved}</span>
        </div>

        <div className="bg-[#404040] text-white p-4 rounded-xl shadow-2xs border border-[#262626]">
          <span className="text-[11px] font-bold text-[#dcdcdc] uppercase tracking-wider block">Verified Staff</span>
          <span className="text-2xl font-extrabold">{stats.verifiedWorkers + stats.verifiedVolunteers}</span>
        </div>
      </div>

      {/* Main View Switcher */}
      <div className="flex items-center gap-2 border-b border-[#dcdcdc] pb-2">
        <button
          onClick={() => setActiveMainTab("requests")}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeMainTab === "requests"
              ? "bg-[#404040] text-white shadow-xs"
              : "bg-white text-[#707070] hover:bg-[#f5f5f5] border border-[#dcdcdc]"
          }`}
        >
          <Shield className="w-4 h-4" />
          All Service Requests ({requests.length})
        </button>

        <button
          onClick={() => setActiveMainTab("personnel")}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeMainTab === "personnel"
              ? "bg-[#404040] text-white shadow-xs"
              : "bg-white text-[#707070] hover:bg-[#f5f5f5] border border-[#dcdcdc]"
          }`}
        >
          <Users className="w-4 h-4" />
          Manage Personnel Verification ({assignees.length})
        </button>
      </div>

      {/* VIEW 1: REQUESTS TABLE */}
      {activeMainTab === "requests" && (
        <div className="bg-white rounded-2xl border border-[#dcdcdc] shadow-xs overflow-hidden space-y-4 p-5">
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#a6a6a6] absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search description, citizen, location..."
                  className="pl-8 pr-3 py-1.5 text-xs border border-[#dcdcdc] rounded-lg outline-none focus:border-[#404040] w-56 sm:w-64 bg-[#f5f5f5] text-[#404040]"
                />
              </div>

              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs border border-[#dcdcdc] rounded-lg bg-white outline-none focus:border-[#404040] text-[#404040]"
              >
                <option value="all">All Statuses</option>
                <option value="open">Open (Unassigned)</option>
                <option value="assigned">Assigned</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>

              {/* Category filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs border border-[#dcdcdc] rounded-lg bg-white outline-none focus:border-[#404040] text-[#404040]"
              >
                <option value="all">All Categories</option>
                <option value="civic">Civic / Infra</option>
                <option value="health">Health</option>
                <option value="emergency">Emergency</option>
                <option value="farming">Farming</option>
                <option value="other">Other</option>
              </select>
            </div>

            <span className="text-xs text-[#707070]">
              Showing {filteredRequests.length} of {requests.length} requests
            </span>
          </div>

          {/* Table */}
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-[#707070] gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#404040]" />
              <span className="text-xs">Loading requests table...</span>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="py-12 text-center text-[#707070] text-xs italic">
              No matching service requests found for selected filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#404040]">
                <thead className="bg-[#f5f5f5] border-b border-[#dcdcdc] text-[#707070] font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-3">Category &amp; Priority</th>
                    <th className="py-3 px-3">Description</th>
                    <th className="py-3 px-3">Location &amp; Citizen</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Assigned Handler</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f5f5f5] font-medium">
                  {filteredRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-[#fafafa] transition-colors">
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="flex flex-col gap-1 items-start">
                          <CategoryBadge category={req.category} showIcon={false} />
                          <PriorityBadge priority={req.priority} />
                        </div>
                      </td>

                      <td className="py-3 px-3 max-w-xs">
                        <p className="line-clamp-2 text-[#404040] font-semibold leading-relaxed">
                          {req.description}
                        </p>
                        <span className="text-[10px] text-[#a6a6a6] mt-0.5 block">
                          ID: {req.id} · {new Date(req.createdAt).toLocaleDateString("en-IN")}
                        </span>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="font-bold text-[#404040]">{req.location}</div>
                        <div className="text-[11px] text-[#707070]">
                          {req.user?.name} ({req.user?.phone})
                        </div>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <StatusBadge status={req.status} />
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        {req.assignedTo ? (
                          <div>
                            <div className="font-bold text-[#404040]">{req.assignedTo.name}</div>
                            <span className="text-[10px] uppercase tracking-wider text-[#707070]">
                              {req.assignedTo.role}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[#707070] font-bold text-[11px] italic">
                            Unassigned
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setAssigningReq(req);
                              setSelectedAssigneeId(req.assignedToId || "");
                            }}
                            className="px-2.5 py-1 bg-[#f5f5f5] hover:bg-[#eaeaea] text-[#404040] border border-[#dcdcdc] rounded-lg text-xs font-bold transition-colors cursor-pointer"
                          >
                            {req.assignedTo ? "Reassign" : "Assign"}
                          </button>

                          <Link
                            href={`/citizen/request/${req.id}`}
                            className="p-1 text-[#707070] hover:text-[#404040] rounded-lg hover:bg-[#f5f5f5] transition-colors"
                            title="View Timeline"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: PERSONNEL VERIFICATION MANAGER */}
      {activeMainTab === "personnel" && (
        <div className="bg-white rounded-2xl border border-[#dcdcdc] shadow-xs p-5 space-y-4">
          <div>
            <h2 className="text-base font-bold text-[#404040]">Registered Local Personnel</h2>
            <p className="text-xs text-[#707070]">
              Only verified personnel are eligible for automatic rule-based routing matches.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#404040]">
              <thead className="bg-[#f5f5f5] border-b border-[#dcdcdc] text-[#707070] font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-3">Name &amp; Role</th>
                  <th className="py-3 px-3">Details / Profession</th>
                  <th className="py-3 px-3">Location / Area</th>
                  <th className="py-3 px-3">Contact</th>
                  <th className="py-3 px-3">Verification Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f5f5f5] font-medium">
                {assignees.map((person) => (
                  <tr key={person.id} className="hover:bg-[#fafafa] transition-colors">
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="font-bold text-[#404040]">{person.name}</div>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#f5f5f5] text-[#707070] border border-[#dcdcdc]">
                        {person.role}
                      </span>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap text-[#404040]">{person.details}</td>

                    <td className="py-3 px-3 whitespace-nowrap text-[#707070]">{person.location}</td>

                    <td className="py-3 px-3 whitespace-nowrap font-mono text-[#707070]">{person.phone}</td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      {person.verified ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-[#404040] text-white">
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-[#f5f5f5] text-[#707070] border border-[#dcdcdc]">
                          <Clock className="w-3.5 h-3.5 text-[#707070]" />
                          Pending
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleToggleVerification(person.id, person.role, person.verified)}
                        disabled={togglingVerifyId === person.id}
                        className={`px-3 py-1 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                          person.verified
                            ? "bg-white text-[#707070] border-[#dcdcdc] hover:bg-[#f5f5f5]"
                            : "bg-[#404040] text-white hover:bg-[#262626] border-[#262626]"
                        }`}
                      >
                        {togglingVerifyId === person.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : person.verified ? (
                          "Revoke Verification"
                        ) : (
                          "Verify Personnel"
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Manual Assignment Modal */}
      {assigningReq && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-[#dcdcdc] space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#404040]">
                Manual Dispatch / Reassignment
              </h3>
              <button
                onClick={() => setAssigningReq(null)}
                className="p-1 rounded-lg text-[#707070] hover:text-[#404040]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-[#f5f5f5] rounded-xl text-xs space-y-1 border border-[#dcdcdc]">
              <p className="font-semibold text-[#404040]">{assigningReq.description}</p>
              <p className="text-[#707070]">
                Location: <span className="font-medium text-[#404040]">{assigningReq.location}</span> · Priority:{" "}
                <span className="font-bold text-[#404040] uppercase">{assigningReq.priority}</span>
              </p>
            </div>

            <form onSubmit={handleManualAssign} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#404040] mb-1">
                  Select Verified Worker or Volunteer
                </label>
                <select
                  value={selectedAssigneeId}
                  onChange={(e) => setSelectedAssigneeId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#dcdcdc] rounded-xl bg-white focus:border-[#404040] outline-none text-[#404040]"
                  required
                >
                  <option value="">-- Choose Personnel --</option>
                  {assignees
                    .filter((a) => a.verified)
                    .map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} [{a.role.toUpperCase()}] - {a.details} ({a.location})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#404040] mb-1">
                  Official Dispatch Note (Optional)
                </label>
                <textarea
                  value={assignmentNote}
                  onChange={(e) => setAssignmentNote(e.target.value)}
                  rows={2}
                  placeholder="e.g. Assigned to Sunil due to urgent power outage proximity..."
                  className="w-full p-2.5 text-xs border border-[#dcdcdc] rounded-xl focus:border-[#404040] outline-none text-[#404040] bg-[#f5f5f5] focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAssigningReq(null)}
                  className="px-4 py-2 text-xs font-semibold text-[#707070] hover:bg-[#f5f5f5] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingAssign || !selectedAssigneeId}
                  className="px-4 py-2 bg-[#404040] hover:bg-[#262626] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  {submittingAssign ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
