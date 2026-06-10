import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { Activity, Search, Filter } from "lucide-react";

const ACTION_STYLES = {
  create: "text-emerald-400",
  update: "text-blue-400",
  delete: "text-red-400",
  approve: "text-emerald-400",
  reject: "text-red-400",
  status_change: "text-amber-400",
  login: "text-slate-400",
  logout: "text-slate-400",
};

const RESOURCE_TYPES = [
  "blog_post", "job_listing", "lead", "newsletter_subscriber",
  "expert", "waitlist_subscriber", "admin_user", "auth",
];

const ACTIONS = ["create", "update", "delete", "approve", "reject", "status_change", "login", "logout"];

function timeAgo(iso) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [resourceFilter, setResourceFilter] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [expanded, setExpanded] = useState(null);
  const limit = 30;

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (resourceFilter) params.resource_type = resourceFilter;
      if (actionFilter) params.action = actionFilter;
      const res = await api.get("/api/admin/audit-logs", { params });
      setLogs(res.data.logs || []);
      setTotal(res.data.total || 0);
    } finally {
      setLoading(false);
    }
  }, [page, resourceFilter, actionFilter]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6" data-testid="activity-logs-page">
      <div>
        <h1 className="text-2xl font-bold text-white">Activity Logs</h1>
        <p className="text-slate-500 text-sm mt-1">{total} audit log entries</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <select
            value={resourceFilter} onChange={(e) => { setResourceFilter(e.target.value); setPage(1); }}
            className="bg-[#0f1117] border border-slate-800 rounded-lg pl-9 pr-8 py-2 text-sm text-white focus:outline-none appearance-none"
            data-testid="logs-resource-filter"
          >
            <option value="">All Resources</option>
            {RESOURCE_TYPES.map((r) => (
              <option key={r} value={r}>{r.replace(/_/g, " ")}</option>
            ))}
          </select>
        </div>
        <select
          value={actionFilter} onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
          className="bg-[#0f1117] border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
          data-testid="logs-action-filter"
        >
          <option value="">All Actions</option>
          {ACTIONS.map((a) => (
            <option key={a} value={a}>{a.charAt(0).toUpperCase() + a.slice(1)}</option>
          ))}
        </select>
      </div>

      <div className="bg-[#0f1117] border border-slate-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-6 h-6 border-2 border-[#002FA7] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48">
            <Activity className="w-8 h-8 text-slate-700 mb-3" />
            <p className="text-slate-500">No activity logs</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/50">
            {logs.map((log) => (
              <div key={log.id} className="px-5 py-3.5 hover:bg-slate-800/20 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-slate-800 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Activity className={`w-3.5 h-3.5 ${ACTION_STYLES[log.action] || "text-slate-400"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-sm text-white font-medium">{log.user_email}</span>
                      <span className={`text-sm ${ACTION_STYLES[log.action] || "text-slate-400"}`}>
                        {log.action}
                      </span>
                      <span className="text-sm text-slate-400">
                        {log.resource_type?.replace(/_/g, " ")}
                      </span>
                      {log.resource_id && (
                        <span className="text-xs text-slate-600 font-mono truncate max-w-[120px]">
                          #{log.resource_id.slice(-6)}
                        </span>
                      )}
                    </div>

                    {log.changes && Object.keys(log.changes).length > 0 && (
                      <button
                        onClick={() => setExpanded(expanded === log.id ? null : log.id)}
                        className="text-xs text-slate-600 hover:text-slate-400 mt-0.5 transition-colors"
                      >
                        {expanded === log.id ? "Hide" : "Show"} changes
                      </button>
                    )}

                    {expanded === log.id && log.changes && (
                      <div className="mt-2 bg-slate-900/60 rounded-lg p-3 text-xs font-mono">
                        {Object.entries(log.changes).map(([field, change]) => (
                          <div key={field} className="flex items-baseline gap-2">
                            <span className="text-slate-500">{field}:</span>
                            <span className="text-red-400">{String(change?.from ?? "—")}</span>
                            <span className="text-slate-600">→</span>
                            <span className="text-emerald-400">{String(change?.to ?? "—")}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-slate-600">{timeAgo(log.created_at)}</span>
                      {log.ip_address && (
                        <span className="text-xs text-slate-700 font-mono">{log.ip_address}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
