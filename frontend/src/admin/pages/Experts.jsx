import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { Users, Search, Eye, CheckCircle, XCircle, Filter, Clock } from "lucide-react";

const STATUS_STYLES = {
  pending: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  approved: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  rejected: "bg-red-500/20 text-red-300 border-red-500/30",
};

export default function Experts() {
  const [experts, setExperts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [notes, setNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const limit = 20;

  const fetchExperts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (statusFilter) params.status = statusFilter;
      const res = await api.get("/api/admin/experts", { params });
      setExperts(res.data.experts || []);
      setTotal(res.data.total || 0);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { fetchExperts(); }, [fetchExperts]);

  const handleStatusChange = async (expert, newStatus) => {
    setActionLoading(true);
    try {
      const res = await api.patch(`/api/admin/experts/${expert.id}/status`, {
        status: newStatus,
        notes: notes || undefined,
      });
      setSelected(res.data);
      fetchExperts();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = search
    ? experts.filter((e) => {
        const name = `${e.first_name || ""} ${e.last_name || ""}`.toLowerCase();
        return (
          name.includes(search.toLowerCase()) ||
          e.email?.toLowerCase().includes(search.toLowerCase())
        );
      })
    : experts;

  const totalPages = Math.ceil(total / limit);
  const pendingCount = experts.filter((e) => e.status === "pending").length;

  return (
    <div className="space-y-6" data-testid="experts-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Expert Applications</h1>
          <p className="text-slate-500 text-sm mt-1">
            {total} total · {pendingCount > 0 && (
              <span className="text-amber-400">{pendingCount} pending review</span>
            )}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full bg-[#0f1117] border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-white placeholder-slate-600 text-sm focus:outline-none"
            data-testid="experts-search"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <select
            value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="bg-[#0f1117] border border-slate-800 rounded-lg pl-9 pr-8 py-2 text-sm text-white focus:outline-none appearance-none"
            data-testid="experts-filter"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 bg-[#0f1117] border border-slate-800 rounded-xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-6 h-6 border-2 border-[#002FA7] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48">
              <Users className="w-8 h-8 text-slate-700 mb-3" />
              <p className="text-slate-500">No applications found</p>
            </div>
          ) : (
            <>
              <table className="w-full" data-testid="experts-table">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left text-xs text-slate-500 font-semibold uppercase tracking-wide px-5 py-3">Applicant</th>
                    <th className="text-left text-xs text-slate-500 font-semibold uppercase tracking-wide px-4 py-3 hidden md:table-cell">Expertise</th>
                    <th className="text-left text-xs text-slate-500 font-semibold uppercase tracking-wide px-4 py-3 hidden sm:table-cell">Experience</th>
                    <th className="text-left text-xs text-slate-500 font-semibold uppercase tracking-wide px-4 py-3">Status</th>
                    <th className="px-4 py-3 w-12" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {filtered.map((expert) => (
                    <tr
                      key={expert.id}
                      onClick={() => { setSelected(expert); setNotes(expert.notes || ""); }}
                      className={`hover:bg-slate-800/20 transition-colors cursor-pointer ${selected?.id === expert.id ? "bg-slate-800/30" : ""}`}
                    >
                      <td className="px-5 py-3.5">
                        <p className="text-white text-sm font-medium">
                          {expert.first_name} {expert.last_name}
                        </p>
                        <p className="text-slate-500 text-xs">{expert.email}</p>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <span className="text-slate-400 text-sm line-clamp-1">
                          {(expert.expertise_areas || []).join(", ") || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 hidden sm:table-cell">
                        <span className="text-slate-400 text-sm">
                          {expert.years_of_experience ? `${expert.years_of_experience}y` : "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_STYLES[expert.status] || STATUS_STYLES.pending}`}>
                          {expert.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <button className="p-1.5 text-slate-500 hover:text-blue-400">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-5 py-3 border-t border-slate-800">
                  <span className="text-xs text-slate-500">Page {page} of {totalPages}</span>
                  <div className="flex gap-2">
                    <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1.5 text-xs bg-slate-800 text-slate-300 rounded disabled:opacity-50">Previous</button>
                    <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1.5 text-xs bg-slate-800 text-slate-300 rounded disabled:opacity-50">Next</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Detail */}
        <div className="bg-[#0f1117] border border-slate-800 rounded-xl p-5">
          {selected ? (
            <div className="space-y-4" data-testid="expert-detail">
              <div>
                <p className="text-white font-semibold text-lg">
                  {selected.first_name} {selected.last_name}
                </p>
                <p className="text-slate-400 text-sm">{selected.email}</p>
                {selected.linkedin_url && (
                  <a href={selected.linkedin_url} target="_blank" rel="noreferrer"
                    className="text-xs text-[#002FA7] hover:underline mt-0.5 inline-block">
                    LinkedIn Profile
                  </a>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_STYLES[selected.status] || STATUS_STYLES.pending}`}>
                  {selected.status}
                </span>
                {selected.years_of_experience && (
                  <span className="text-xs text-slate-500">
                    <Clock className="w-3 h-3 inline mr-1" />{selected.years_of_experience} years exp.
                  </span>
                )}
              </div>

              {selected.expertise_areas?.length > 0 && (
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1.5">Expertise</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.expertise_areas.map((area) => (
                      <span key={area} className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selected.bio && (
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1">Bio</p>
                  <p className="text-slate-300 text-sm leading-relaxed">{selected.bio}</p>
                </div>
              )}

              {selected.status === "pending" && (
                <div className="pt-3 border-t border-slate-800 space-y-3">
                  <div>
                    <label className="text-xs text-slate-500 font-medium block mb-1.5">Review Notes</label>
                    <textarea
                      value={notes} onChange={(e) => setNotes(e.target.value)}
                      rows={3} placeholder="Optional notes..."
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none resize-none"
                      data-testid="expert-notes"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusChange(selected, "approved")}
                      disabled={actionLoading}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-sm py-2 rounded-lg transition-colors disabled:opacity-50"
                      data-testid="expert-approve-btn"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusChange(selected, "rejected")}
                      disabled={actionLoading}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm py-2 rounded-lg transition-colors disabled:opacity-50"
                      data-testid="expert-reject-btn"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              )}

              {selected.reviewed_by && (
                <p className="text-xs text-slate-600">
                  Reviewed by {selected.reviewed_by} on{" "}
                  {selected.reviewed_at ? new Date(selected.reviewed_at).toLocaleDateString() : "—"}
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <Users className="w-8 h-8 text-slate-700 mb-3" />
              <p className="text-slate-500 text-sm">Select an applicant to review</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
