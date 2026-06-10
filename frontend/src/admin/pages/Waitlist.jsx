import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { Clock, Search, Filter, CheckCircle } from "lucide-react";

const STATUS_STYLES = {
  waitlisted: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  invited: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  converted: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
};

const STATUSES = ["waitlisted", "invited", "converted"];

export default function Waitlist() {
  const [subscribers, setSubscribers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const limit = 30;

  const fetchSubs = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (statusFilter) params.status = statusFilter;
      const res = await api.get("/api/admin/waitlist", { params });
      setSubscribers(res.data.subscribers || []);
      setTotal(res.data.total || 0);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { fetchSubs(); }, [fetchSubs]);

  const handleStatusChange = async (sub, newStatus) => {
    try {
      await api.patch(`/api/admin/waitlist/${sub.id}/status`, { status: newStatus });
      fetchSubs();
    } catch (err) {
      console.error(err);
    }
  };

  const exportCSV = () => {
    const rows = [["Email", "Name", "Product", "Company", "Status", "Joined"]];
    subscribers.forEach((s) => {
      rows.push([s.email, s.name || "", s.product || "", s.company || "", s.status, s.created_at || ""]);
    });
    const csv = rows.map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `waitlist-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = search
    ? subscribers.filter((s) =>
        s.email.toLowerCase().includes(search.toLowerCase()) ||
        s.name?.toLowerCase().includes(search.toLowerCase()) ||
        s.product?.toLowerCase().includes(search.toLowerCase())
      )
    : subscribers;

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6" data-testid="waitlist-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Waitlist</h1>
          <p className="text-slate-500 text-sm mt-1">{total} subscribers</p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 border border-slate-700 text-slate-300 hover:text-white text-sm px-4 py-2 rounded-lg transition-colors"
          data-testid="waitlist-export-btn"
        >
          Export CSV
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search waitlist..."
            className="w-full bg-[#0f1117] border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-white placeholder-slate-600 text-sm focus:outline-none"
            data-testid="waitlist-search"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <select
            value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="bg-[#0f1117] border border-slate-800 rounded-lg pl-9 pr-8 py-2 text-sm text-white focus:outline-none appearance-none"
          >
            <option value="">All Status</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-[#0f1117] border border-slate-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-6 h-6 border-2 border-[#002FA7] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48">
            <Clock className="w-8 h-8 text-slate-700 mb-3" />
            <p className="text-slate-500">No waitlist entries found</p>
          </div>
        ) : (
          <table className="w-full" data-testid="waitlist-table">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left text-xs text-slate-500 font-semibold uppercase tracking-wide px-5 py-3">Email</th>
                <th className="text-left text-xs text-slate-500 font-semibold uppercase tracking-wide px-4 py-3 hidden sm:table-cell">Name</th>
                <th className="text-left text-xs text-slate-500 font-semibold uppercase tracking-wide px-4 py-3 hidden md:table-cell">Product</th>
                <th className="text-left text-xs text-slate-500 font-semibold uppercase tracking-wide px-4 py-3">Status</th>
                <th className="text-left text-xs text-slate-500 font-semibold uppercase tracking-wide px-4 py-3 hidden lg:table-cell">Joined</th>
                <th className="px-4 py-3 w-32" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filtered.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="px-5 py-3.5">
                    <span className="text-white text-sm">{sub.email}</span>
                  </td>
                  <td className="px-4 py-3.5 hidden sm:table-cell">
                    <span className="text-slate-400 text-sm">{sub.name || "—"}</span>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <span className="text-slate-400 text-sm">{sub.product || "—"}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_STYLES[sub.status] || STATUS_STYLES.waitlisted}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 hidden lg:table-cell">
                    <span className="text-slate-500 text-xs">
                      {sub.created_at ? new Date(sub.created_at).toLocaleDateString() : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    {sub.status === "waitlisted" && (
                      <button
                        onClick={() => handleStatusChange(sub, "invited")}
                        className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 border border-purple-500/30 px-2.5 py-1 rounded-full transition-colors"
                        data-testid={`invite-btn-${sub.id}`}
                      >
                        <CheckCircle className="w-3 h-3" />
                        Invite
                      </button>
                    )}
                    {sub.status === "invited" && (
                      <button
                        onClick={() => handleStatusChange(sub, "converted")}
                        className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-full transition-colors"
                        data-testid={`convert-btn-${sub.id}`}
                      >
                        <CheckCircle className="w-3 h-3" />
                        Convert
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-800">
            <span className="text-xs text-slate-500">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1.5 text-xs bg-slate-800 text-slate-300 rounded disabled:opacity-50">Previous</button>
              <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1.5 text-xs bg-slate-800 text-slate-300 rounded disabled:opacity-50">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
