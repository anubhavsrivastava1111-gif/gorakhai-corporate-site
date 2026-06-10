import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api, { formatError } from "@/lib/api";
import { useAuth } from "@/admin/context/AuthContext";
import { ArrowLeft, Save, Eye, Loader, Upload, X, Image } from "lucide-react";
import TipTapEditor from "@/components/editor/TipTapEditor";

const CATEGORIES = ["Case Studies", "Engineering", "AI Research", "Enterprise AI", "Product Updates", "Company News"];
const STATUS_OPTIONS = ["draft", "published", "archived"];

function slugify(text) {
  return text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/-+/g, "-").trim();
}

// ─── Cover Image Upload Zone ────────────────────────────────────────────────
function CoverImageUpload({ value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  const upload = useCallback(async (file) => {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("context", "blog_cover");
      form.append("alt_text", "Blog cover image");
      const res = await api.post("/api/admin/media/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onChange(`${process.env.REACT_APP_BACKEND_URL}${res.data.url}`);
    } catch (err) {
      setError(formatError(err.response?.data?.detail) || "Upload failed");
    } finally {
      setUploading(false);
    }
  }, [onChange]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    upload(e.dataTransfer.files[0]);
  };

  return (
    <div>
      {value ? (
        <div className="relative group">
          <img
            src={value}
            alt="Cover"
            className="w-full h-40 object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-1.5 rounded-lg backdrop-blur-sm transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="flex items-center gap-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs px-3 py-1.5 rounded-lg backdrop-blur-sm transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Remove
            </button>
          </div>
          {uploading && (
            <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
              <Loader className="w-6 h-6 text-white animate-spin" />
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            dragOver
              ? "border-[#002FA7] bg-[#002FA7]/10"
              : "border-slate-700 hover:border-slate-600"
          }`}
          data-testid="cover-image-dropzone"
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader className="w-5 h-5 text-[#002FA7] animate-spin" />
              <p className="text-slate-400 text-xs">Uploading…</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5">
              <Image className="w-5 h-5 text-slate-600" />
              <p className="text-slate-400 text-xs">Drop image or click to upload</p>
              <p className="text-slate-700 text-xs">JPG, PNG, WebP — max 10 MB</p>
            </div>
          )}
        </div>
      )}
      {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}

      {/* URL fallback input */}
      <div className="mt-2">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or enter image URL directly..."
          className="w-full bg-slate-800/40 border border-slate-700/50 rounded-lg px-3 py-2 text-white text-xs placeholder-slate-700 focus:outline-none focus:border-slate-600"
          data-testid="cover-image-url-input"
        />
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => upload(e.target.files?.[0])}
      />
    </div>
  );
}

// ─── Main Blog Editor ────────────────────────────────────────────────────────
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

  // Auto-generate slug from title
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

  const handleContentChange = useCallback((html) => {
    setForm((f) => ({ ...f, content: html }));
  }, []);

  const handleCoverImageChange = useCallback((url) => {
    setForm((f) => ({ ...f, cover_image_url: url }));
  }, []);

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
    <div className="max-w-5xl mx-auto space-y-6" data-testid="blog-editor">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/blog")}
          className="p-2 text-slate-500 hover:text-white transition-colors rounded-lg hover:bg-slate-800"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white">
            {isNew ? "New Blog Post" : "Edit Post"}
          </h1>
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

      <form id="blog-form" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* ── Main content ── */}
          <div className="lg:col-span-2 space-y-5">
            {/* Title + Slug */}
            <div className="bg-[#0f1117] border border-slate-800 rounded-xl p-5 space-y-4">
              <div>
                <label className="text-xs text-slate-500 font-medium block mb-1.5">Title *</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  placeholder="Post title…"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#002FA7]"
                  data-testid="blog-title"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 font-medium block mb-1.5">Slug</label>
                <input
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  placeholder="auto-generated-from-title"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-[#002FA7]"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 font-medium block mb-1.5">Excerpt *</label>
                <textarea
                  name="excerpt"
                  value={form.excerpt}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="Brief description for listing pages…"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#002FA7] resize-none"
                  data-testid="blog-excerpt"
                />
              </div>
            </div>

            {/* Rich Text Editor */}
            <div>
              <label className="text-xs text-slate-500 font-medium block mb-1.5">Content *</label>
              <TipTapEditor
                content={form.content}
                onChange={handleContentChange}
                placeholder="Start writing your post… Use the toolbar to format content."
                minHeight="450px"
              />
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-4">
            {/* Publish settings */}
            <div className="bg-[#0f1117] border border-slate-800 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-semibold text-white">Publish Settings</h3>
              <div>
                <label className="text-xs text-slate-500 font-medium block mb-1.5">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
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
                  name="author_name"
                  value={form.author_name}
                  onChange={handleChange}
                  placeholder={user?.name || "Author name"}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#002FA7]"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 font-medium block mb-1.5">Read Time (mins)</label>
                <input
                  type="number"
                  name="read_time_mins"
                  value={form.read_time_mins}
                  onChange={handleChange}
                  min={1}
                  max={60}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#002FA7]"
                />
              </div>
            </div>

            {/* Categorization */}
            <div className="bg-[#0f1117] border border-slate-800 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-semibold text-white">Categorization</h3>
              <div>
                <label className="text-xs text-slate-500 font-medium block mb-1.5">Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#002FA7]"
                  data-testid="blog-category"
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 font-medium block mb-1.5">
                  Tags <span className="text-slate-700">(comma-separated)</span>
                </label>
                <input
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  placeholder="AI, Enterprise, Strategy"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#002FA7]"
                />
              </div>
            </div>

            {/* Cover image */}
            <div className="bg-[#0f1117] border border-slate-800 rounded-xl p-5 space-y-3">
              <h3 className="text-sm font-semibold text-white">Cover Image</h3>
              <CoverImageUpload
                value={form.cover_image_url}
                onChange={handleCoverImageChange}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
