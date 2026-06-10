import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { Send, Search, Download, Trash2, Users } from "lucide-react";

export default function Newsletter() {
  const [subscribers, setSubscribers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const limit = 50;

  const fetchSubs = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (statusFilter) params.status = statusFilter;
      const res = await api.get("/api/admin/newsletter", { params });
      setSubscribers(res.data.subscribers || []);
      setTotal(res.data.total || 0);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { fetchSubs(); }, [fetchSubs]);

  const handleUnsubscribe = async (sub) => {
    if (!window.confirm(`Unsubscribe ${sub.email}?`)) return;
    try {
      await api.delete(`/api/admin/newsletter/${sub.id}`);
      fetchSubs();
    } catch (err) {
      console.error(err);
    }
  };

  const exportCSV = () => {
    const rows = [["Email", "Name", "Status", "Subscribed At", "Source"]];
    subscribers.forEach((s) => {
      rows.push([s.email, s.name || "", s.status, s.subscribed_at || "", s.source || ""]);
    });
    const csv = rows.map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = search
    ? subscribers.filter(
        (s) =>
          s.email.toLowerCase().includes(search.toLowerCase()) ||
          s.name?.toLowerCase().includes(search.toLowerCase())
      )
    : subscribers;

  const totalPages = Math.ceil(total / limit);
  const activeCount = subscribers.filter((s) => s.status === "active").length;

  return (
    <div className="space-y-6" data-testid="newsletter-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Newsletter</h1>
          <p className="text-slate-500 text-sm mt-1">
            {total} total · <span className="text-emerald-400">{activeCount} active</span>
          </p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 text-sm px-4 py-2 rounded-lg transition-colors"
          data-testid="newsletter-export-btn"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email or name..."
            className="w-full bg-[#0f1117] border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-white placeholder-slate-600 text-sm focus:outline-none"
            data-testid="newsletter-search"
          />
        </div>
        <select
          value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="bg-[#0f1117] border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
          data-testid="newsletter-filter"
        >
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="unsubscribed">Unsubscribed</option>
        </select>
      </div>

      <div className="bg-[#0f1117] border border-slate-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-6 h-6 border-2 border-[#002FA7] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48">
            <Send className="w-8 h-8 text-slate-700 mb-3" />
            <p className="text-slate-500">No subscribers found</p>
          </div>
        ) : (
          <table className="w-full" data-testid="newsletter-table">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left text-xs text-slate-500 font-semibold uppercase tracking-wide px-5 py-3">Email</th>
                <th className="text-left text-xs text-slate-500 font-semibold uppercase tracking-wide px-4 py-3 hidden sm:table-cell">Name</th>
                <th className="text-left text-xs text-slate-500 font-semibold uppercase tracking-wide px-4 py-3">Status</th>
                <th className="text-left text-xs text-slate-500 font-semibold uppercase tracking-wide px-4 py-3 hidden md:table-cell">Source</th>
                <th className="text-left text-xs text-slate-500 font-semibold uppercase tracking-wide px-4 py-3 hidden lg:table-cell">Subscribed</th>
                <th className="px-4 py-3 w-12" />
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
                  <td className="px-4 py-3.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                      sub.status === "active"
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                        : "bg-slate-500/20 text-slate-300 border-slate-500/30"
                    }`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <span className="text-slate-500 text-xs">{sub.source || "—"}</span>
                  </td>
                  <td className="px-4 py-3.5 hidden lg:table-cell">
                    <span className="text-slate-500 text-xs">
                      {sub.subscribed_at ? new Date(sub.subscribed_at).toLocaleDateString() : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    {sub.status === "active" && (
                      <button
                        onClick={() => handleUnsubscribe(sub)}
                        className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                        title="Unsubscribe"
                      >
                        <Trash2 className="w-4 h-4" />
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
