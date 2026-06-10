import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { Plus, Search, Edit, Trash2, Briefcase, Filter } from "lucide-react";

const STATUS_STYLES = {
  open: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  draft: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  closed: "bg-slate-500/20 text-slate-300 border-slate-500/30",
};

const DEPARTMENTS = ["Engineering", "Product", "Sales", "Design", "Operations", "Marketing"];

export default function CareersList() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState(null);
  const limit = 15;

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (statusFilter) params.status = statusFilter;
      if (deptFilter) params.department = deptFilter;
      const res = await api.get("/api/admin/careers", { params });
      setJobs(res.data.jobs || []);
      setTotal(res.data.total || 0);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, deptFilter]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const handleDelete = async (job) => {
    if (!window.confirm(`Delete "${job.title}"? This cannot be undone.`)) return;
    setDeleting(job.id);
    try {
      await api.delete(`/api/admin/careers/${job.id}`);
      fetchJobs();
    } finally {
      setDeleting(null);
    }
  };

  const filtered = search
    ? jobs.filter((j) =>
        j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.department?.toLowerCase().includes(search.toLowerCase())
      )
    : jobs;

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6" data-testid="careers-list-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Careers</h1>
          <p className="text-slate-500 text-sm mt-1">{total} job listings</p>
        </div>
        <Link
          to="/admin/careers/new"
          className="flex items-center gap-2 bg-[#002FA7] hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          data-testid="careers-new-btn"
        >
          <Plus className="w-4 h-4" />
          New Listing
        </Link>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search listings..."
            className="w-full bg-[#0f1117] border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-slate-700"
            data-testid="careers-search"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <select
            value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="bg-[#0f1117] border border-slate-800 rounded-lg pl-9 pr-8 py-2 text-sm text-white focus:outline-none appearance-none"
            data-testid="careers-status-filter"
          >
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="draft">Draft</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <select
          value={deptFilter} onChange={(e) => { setDeptFilter(e.target.value); setPage(1); }}
          className="bg-[#0f1117] border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
          data-testid="careers-dept-filter"
        >
          <option value="">All Departments</option>
          {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div className="bg-[#0f1117] border border-slate-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-6 h-6 border-2 border-[#002FA7] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <Briefcase className="w-8 h-8 text-slate-700 mb-3" />
            <p className="text-slate-500">No job listings found</p>
          </div>
        ) : (
          <table className="w-full" data-testid="careers-table">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left text-xs text-slate-500 font-semibold uppercase tracking-wide px-5 py-3">Title</th>
                <th className="text-left text-xs text-slate-500 font-semibold uppercase tracking-wide px-4 py-3 hidden sm:table-cell">Department</th>
                <th className="text-left text-xs text-slate-500 font-semibold uppercase tracking-wide px-4 py-3 hidden md:table-cell">Location</th>
                <th className="text-left text-xs text-slate-500 font-semibold uppercase tracking-wide px-4 py-3">Status</th>
                <th className="text-left text-xs text-slate-500 font-semibold uppercase tracking-wide px-4 py-3 hidden lg:table-cell">Posted</th>
                <th className="px-4 py-3 w-24" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filtered.map((job) => (
                <tr key={job.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="text-white text-sm font-medium">{job.title}</p>
                    <p className="text-slate-600 text-xs mt-0.5">{job.type} · {job.experience_level}</p>
                  </td>
                  <td className="px-4 py-3.5 hidden sm:table-cell">
                    <span className="text-slate-400 text-sm">{job.department}</span>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <span className="text-slate-400 text-sm">{job.location}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_STYLES[job.status] || STATUS_STYLES.draft}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 hidden lg:table-cell">
                    <span className="text-slate-500 text-xs">
                      {job.posted_at ? new Date(job.posted_at).toLocaleDateString() : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => navigate(`/admin/careers/${job.id}`)}
                        className="p-1.5 text-slate-500 hover:text-blue-400 transition-colors rounded"
                        data-testid={`edit-job-${job.id}`}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(job)}
                        disabled={deleting === job.id}
                        className="p-1.5 text-slate-500 hover:text-red-400 transition-colors rounded disabled:opacity-50"
                        data-testid={`delete-job-${job.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1.5 text-xs bg-slate-800 text-slate-300 rounded disabled:opacity-50 hover:bg-slate-700">Previous</button>
              <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1.5 text-xs bg-slate-800 text-slate-300 rounded disabled:opacity-50 hover:bg-slate-700">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
