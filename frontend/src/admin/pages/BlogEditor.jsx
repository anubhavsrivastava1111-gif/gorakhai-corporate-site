import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api, { formatError } from "@/lib/api";
import { useAuth } from "@/admin/context/AuthContext";
import { ArrowLeft, Save, Eye, Loader } from "lucide-react";

const CATEGORIES = ["Case Studies", "Engineering", "AI Research", "Enterprise AI", "Product Updates", "Company News"];
const STATUS_OPTIONS = ["draft", "published", "archived"];

function slugify(text) {
  return text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/-+/g, "-").trim();
}

export default function BlogEditor() {
  const { id } = useParams();
  const isNew = !id || id === "new";
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    title: "", slug: "", excerpt: "", content: "", author_name: "",
    status: "draft", category: "", tags: "", cover_image_url: "",
    read_time_mins: 5,
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);

  useEffect(() => {
    if (!isNew) {
      api.get(`/api/admin/blog/${id}`)
        .then((res) => {
          const p = res.data;
          setForm({
            title: p.title || "",
            slug: p.slug || "",
            excerpt: p.excerpt || "",
            content: p.content || "",
            author_name: p.author_name || "",
            status: p.status || "draft",
            category: p.category || "",
            tags: (p.tags || []).join(", "),
            cover_image_url: p.cover_image_url || "",
            read_time_mins: p.read_time_mins || 5,
          });
          setSlugEdited(true);
        })
        .catch(() => navigate("/admin/blog"))
        .finally(() => setLoading(false));
    }
  }, [id, isNew, navigate]);

  useEffect(() => {
    if (!slugEdited && form.title) {
      setForm((f) => ({ ...f, slug: slugify(f.title) }));
    }
  }, [form.title, slugEdited]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "slug") setSlugEdited(true);
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        read_time_mins: parseInt(form.read_time_mins) || 5,
        author_name: form.author_name || user?.name,
      };
      if (isNew) {
        const res = await api.post("/api/admin/blog", payload);
        navigate(`/admin/blog/${res.data.id}`);
      } else {
        await api.put(`/api/admin/blog/${id}`, payload);
      }
    } catch (err) {
      setError(formatError(err.response?.data?.detail));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#002FA7] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6" data-testid="blog-editor">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/blog")}
          className="p-2 text-slate-500 hover:text-white transition-colors rounded-lg hover:bg-slate-800"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white">{isNew ? "New Blog Post" : "Edit Post"}</h1>
        </div>
        <div className="flex items-center gap-3">
          {!isNew && form.status === "published" && (
            <a
              href={`/blog/${form.slug}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-white border border-slate-700 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
              Preview
            </a>
          )}
          <button
            form="blog-form"
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-[#002FA7] hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            data-testid="blog-save-btn"
          >
            {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <form id="blog-form" onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-[#0f1117] border border-slate-800 rounded-xl p-5 space-y-4">
              <div>
                <label className="text-xs text-slate-500 font-medium block mb-1.5">Title *</label>
                <input
                  name="title" value={form.title} onChange={handleChange} required
                  placeholder="Post title..."
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#002FA7]"
                  data-testid="blog-title"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 font-medium block mb-1.5">Slug</label>
                <input
                  name="slug" value={form.slug} onChange={handleChange}
                  placeholder="auto-generated-from-title"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-[#002FA7]"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 font-medium block mb-1.5">Excerpt *</label>
                <textarea
                  name="excerpt" value={form.excerpt} onChange={handleChange} required rows={3}
                  placeholder="Brief description for listing pages..."
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#002FA7] resize-none"
                  data-testid="blog-excerpt"
                />
              </div>
            </div>

            <div className="bg-[#0f1117] border border-slate-800 rounded-xl p-5">
              <label className="text-xs text-slate-500 font-medium block mb-1.5">
                Content (HTML) *
              </label>
              <textarea
                name="content" value={form.content} onChange={handleChange} required rows={20}
                placeholder="<p>Write your post content here using HTML...</p>"
                className="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-[#002FA7] resize-y"
                data-testid="blog-content"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-[#0f1117] border border-slate-800 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-semibold text-white">Publish Settings</h3>
              <div>
                <label className="text-xs text-slate-500 font-medium block mb-1.5">Status</label>
                <select
                  name="status" value={form.status} onChange={handleChange}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#002FA7]"
                  data-testid="blog-status"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 font-medium block mb-1.5">Author</label>
                <input
                  name="author_name" value={form.author_name} onChange={handleChange}
                  placeholder={user?.name || "Author name"}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#002FA7]"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 font-medium block mb-1.5">Read Time (mins)</label>
                <input
                  type="number" name="read_time_mins" value={form.read_time_mins} onChange={handleChange}
                  min={1} max={60}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#002FA7]"
                />
              </div>
            </div>

            <div className="bg-[#0f1117] border border-slate-800 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-semibold text-white">Categorization</h3>
              <div>
                <label className="text-xs text-slate-500 font-medium block mb-1.5">Category</label>
                <select
                  name="category" value={form.category} onChange={handleChange}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#002FA7]"
                  data-testid="blog-category"
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 font-medium block mb-1.5">
                  Tags <span className="text-slate-600">(comma-separated)</span>
                </label>
                <input
                  name="tags" value={form.tags} onChange={handleChange}
                  placeholder="AI, Enterprise, Strategy"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#002FA7]"
                />
              </div>
            </div>

            <div className="bg-[#0f1117] border border-slate-800 rounded-xl p-5">
              <label className="text-xs text-slate-500 font-medium block mb-1.5">Cover Image URL</label>
              <input
                name="cover_image_url" value={form.cover_image_url} onChange={handleChange}
                placeholder="https://images.pexels.com/..."
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#002FA7]"
              />
              {form.cover_image_url && (
                <img src={form.cover_image_url} alt="Cover preview" className="mt-3 w-full h-28 object-cover rounded-lg opacity-80" />
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
