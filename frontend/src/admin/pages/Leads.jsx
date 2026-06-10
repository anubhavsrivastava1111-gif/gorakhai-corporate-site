import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { Mail, Search, Eye, Filter, MessageSquare } from "lucide-react";

const STATUS_STYLES = {
  new: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  reviewed: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  replied: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  archived: "bg-slate-500/20 text-slate-300 border-slate-500/30",
};

const STATUSES = ["new", "reviewed", "replied", "archived"];

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const limit = 20;

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (statusFilter) params.status = statusFilter;
      const res = await api.get("/api/admin/leads", { params });
      setLeads(res.data.leads || []);
      setTotal(res.data.total || 0);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const handleStatusChange = async (lead, newStatus) => {
    try {
      await api.patch(`/api/admin/leads/${lead.id}/status`, { status: newStatus });
      fetchLeads();
      if (selected?.id === lead.id) {
        setSelected((s) => s ? { ...s, status: newStatus } : null);
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const filtered = search
    ? leads.filter((l) =>
        l.name?.toLowerCase().includes(search.toLowerCase()) ||
        l.email?.toLowerCase().includes(search.toLowerCase()) ||
        l.subject?.toLowerCase().includes(search.toLowerCase())
      )
    : leads;

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6" data-testid="leads-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Leads</h1>
          <p className="text-slate-500 text-sm mt-1">{total} contact submissions</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email..."
            className="w-full bg-[#0f1117] border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-white placeholder-slate-600 text-sm focus:outline-none"
            data-testid="leads-search"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <select
            value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="bg-[#0f1117] border border-slate-800 rounded-lg pl-9 pr-8 py-2 text-sm text-white focus:outline-none appearance-none"
            data-testid="leads-filter"
          >
            <option value="">All Status</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Table */}
        <div className="xl:col-span-2 bg-[#0f1117] border border-slate-800 rounded-xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-6 h-6 border-2 border-[#002FA7] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48">
              <Mail className="w-8 h-8 text-slate-700 mb-3" />
              <p className="text-slate-500">No leads found</p>
            </div>
          ) : (
            <>
              <table className="w-full" data-testid="leads-table">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left text-xs text-slate-500 font-semibold uppercase tracking-wide px-5 py-3">Contact</th>
                    <th className="text-left text-xs text-slate-500 font-semibold uppercase tracking-wide px-4 py-3 hidden md:table-cell">Subject</th>
                    <th className="text-left text-xs text-slate-500 font-semibold uppercase tracking-wide px-4 py-3">Status</th>
                    <th className="text-left text-xs text-slate-500 font-semibold uppercase tracking-wide px-4 py-3 hidden sm:table-cell">Date</th>
                    <th className="px-4 py-3 w-12" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {filtered.map((lead) => (
                    <tr
                      key={lead.id}
                      className={`hover:bg-slate-800/20 transition-colors cursor-pointer ${selected?.id === lead.id ? "bg-slate-800/30" : ""}`}
                      onClick={() => setSelected(lead)}
                    >
                      <td className="px-5 py-3.5">
                        <p className="text-white text-sm font-medium">{lead.name || "—"}</p>
                        <p className="text-slate-500 text-xs">{lead.email}</p>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <span className="text-slate-400 text-sm line-clamp-1">{lead.subject || "—"}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_STYLES[lead.status] || STATUS_STYLES.new}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 hidden sm:table-cell">
                        <span className="text-slate-500 text-xs">
                          {lead.created_at ? new Date(lead.created_at).toLocaleDateString() : "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelected(lead); }}
                          className="p-1.5 text-slate-500 hover:text-blue-400"
                        >
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

        {/* Detail panel */}
        <div className="bg-[#0f1117] border border-slate-800 rounded-xl p-5">
          {selected ? (
            <div className="space-y-4" data-testid="lead-detail">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white font-semibold">{selected.name}</p>
                  <p className="text-slate-400 text-sm">{selected.email}</p>
                  {selected.company && <p className="text-slate-500 text-xs mt-0.5">{selected.company}</p>}
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_STYLES[selected.status] || STATUS_STYLES.new}`}>
                  {selected.status}
                </span>
              </div>

              {selected.subject && (
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1">Subject</p>
                  <p className="text-slate-300 text-sm">{selected.subject}</p>
                </div>
              )}

              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">Message</p>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{selected.message || "—"}</p>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <p className="text-xs text-slate-500 font-medium mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(selected, s)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                        selected.status === s
                          ? STATUS_STYLES[s] || ""
                          : "border-slate-700 text-slate-500 hover:text-white hover:border-slate-500"
                      }`}
                      data-testid={`lead-status-${s}`}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-600">
                Received {selected.created_at ? new Date(selected.created_at).toLocaleString() : "—"}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <MessageSquare className="w-8 h-8 text-slate-700 mb-3" />
              <p className="text-slate-500 text-sm">Select a lead to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
