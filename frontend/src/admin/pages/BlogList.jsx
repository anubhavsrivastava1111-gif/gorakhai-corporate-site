import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { Plus, Search, Edit, Trash2, Eye, FileText, Filter } from "lucide-react";

const STATUS_STYLES = {
  published: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  draft: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  archived: "bg-slate-500/20 text-slate-300 border-slate-500/30",
};

export default function BlogList() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState(null);
  const limit = 15;

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (statusFilter) params.status = statusFilter;
      const res = await api.get("/api/admin/blog", { params });
      setPosts(res.data.posts || []);
      setTotal(res.data.total || 0);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const handleDelete = async (post) => {
    if (!window.confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    setDeleting(post.id);
    try {
      await api.delete(`/api/admin/blog/${post.id}`);
      fetchPosts();
    } finally {
      setDeleting(null);
    }
  };

  const filtered = search
    ? posts.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.category?.toLowerCase().includes(search.toLowerCase())
      )
    : posts;

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6" data-testid="blog-list-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Blog</h1>
          <p className="text-slate-500 text-sm mt-1">{total} posts total</p>
        </div>
        <Link
          to="/admin/blog/new"
          className="flex items-center gap-2 bg-[#002FA7] hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          data-testid="blog-new-btn"
        >
          <Plus className="w-4 h-4" />
          New Post
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts..."
            className="w-full bg-[#0f1117] border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-slate-700"
            data-testid="blog-search"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="bg-[#0f1117] border border-slate-800 rounded-lg pl-9 pr-8 py-2 text-sm text-white focus:outline-none focus:border-slate-700 appearance-none"
            data-testid="blog-status-filter"
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0f1117] border border-slate-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-6 h-6 border-2 border-[#002FA7] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <FileText className="w-8 h-8 text-slate-700 mb-3" />
            <p className="text-slate-500">No posts found</p>
            <Link to="/admin/blog/new" className="text-[#002FA7] text-sm mt-2 hover:underline">
              Create your first post
            </Link>
          </div>
        ) : (
          <table className="w-full" data-testid="blog-table">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left text-xs text-slate-500 font-semibold uppercase tracking-wide px-5 py-3">Title</th>
                <th className="text-left text-xs text-slate-500 font-semibold uppercase tracking-wide px-4 py-3 hidden sm:table-cell">Category</th>
                <th className="text-left text-xs text-slate-500 font-semibold uppercase tracking-wide px-4 py-3 hidden md:table-cell">Author</th>
                <th className="text-left text-xs text-slate-500 font-semibold uppercase tracking-wide px-4 py-3">Status</th>
                <th className="text-left text-xs text-slate-500 font-semibold uppercase tracking-wide px-4 py-3 hidden lg:table-cell">Published</th>
                <th className="px-4 py-3 w-28" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filtered.map((post) => (
                <tr key={post.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="text-white text-sm font-medium line-clamp-1">{post.title}</p>
                    <p className="text-slate-600 text-xs mt-0.5 truncate">/{post.slug}</p>
                  </td>
                  <td className="px-4 py-3.5 hidden sm:table-cell">
                    <span className="text-slate-400 text-sm">{post.category || "—"}</span>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <span className="text-slate-400 text-sm">{post.author_name || "—"}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_STYLES[post.status] || STATUS_STYLES.draft}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 hidden lg:table-cell">
                    <span className="text-slate-500 text-xs">
                      {post.published_at ? new Date(post.published_at).toLocaleDateString() : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      {post.status === "published" && (
                        <a
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-slate-500 hover:text-slate-300 transition-colors rounded"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        onClick={() => navigate(`/admin/blog/${post.id}`)}
                        className="p-1.5 text-slate-500 hover:text-blue-400 transition-colors rounded"
                        title="Edit"
                        data-testid={`edit-post-${post.id}`}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(post)}
                        disabled={deleting === post.id}
                        className="p-1.5 text-slate-500 hover:text-red-400 transition-colors rounded disabled:opacity-50"
                        title="Delete"
                        data-testid={`delete-post-${post.id}`}
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-800">
            <span className="text-xs text-slate-500">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1.5 text-xs bg-slate-800 text-slate-300 rounded disabled:opacity-50 hover:bg-slate-700 transition-colors"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 text-xs bg-slate-800 text-slate-300 rounded disabled:opacity-50 hover:bg-slate-700 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
