import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api, { formatError } from "@/lib/api";
import { ArrowLeft, Save, Plus, Trash2, Loader } from "lucide-react";

const DEPARTMENTS = ["Engineering", "Product", "Sales", "Design", "Operations", "Marketing"];
const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Remote"];
const EXP_LEVELS = ["Junior", "Mid", "Senior", "Lead", "Principal", "Director"];
const STATUSES = ["open", "draft", "closed"];

function slugify(t) {
  return t.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/-+/g, "-").trim();
}

export default function CareersEditor() {
  const { id } = useParams();
  const isNew = !id || id === "new";
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "", slug: "", department: "", location: "", type: "Full-time",
    experience_level: "Senior", salary_range: "", description: "",
    requirements: [""], responsibilities: [""], status: "open",
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);

  useEffect(() => {
    if (!isNew) {
      api.get(`/api/admin/careers/${id}`)
        .then((res) => {
          const j = res.data;
          setForm({
            title: j.title || "",
            slug: j.slug || "",
            department: j.department || "",
            location: j.location || "",
            type: j.type || "Full-time",
            experience_level: j.experience_level || "Senior",
            salary_range: j.salary_range || "",
            description: j.description || "",
            requirements: j.requirements?.length ? j.requirements : [""],
            responsibilities: j.responsibilities?.length ? j.responsibilities : [""],
            status: j.status || "open",
          });
          setSlugEdited(true);
        })
        .catch(() => navigate("/admin/careers"))
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

  const handleListChange = (field, idx, value) => {
    setForm((f) => {
      const arr = [...f[field]];
      arr[idx] = value;
      return { ...f, [field]: arr };
    });
  };

  const addListItem = (field) => {
    setForm((f) => ({ ...f, [field]: [...f[field], ""] }));
  };

  const removeListItem = (field, idx) => {
    setForm((f) => ({ ...f, [field]: f[field].filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        requirements: form.requirements.filter((r) => r.trim()),
        responsibilities: form.responsibilities.filter((r) => r.trim()),
      };
      if (isNew) {
        const res = await api.post("/api/admin/careers", payload);
        navigate(`/admin/careers/${res.data.id}`);
      } else {
        await api.put(`/api/admin/careers/${id}`, payload);
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

  const ListEditor = ({ field, label, placeholder }) => (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs text-slate-500 font-medium">{label}</label>
        <button
          type="button"
          onClick={() => addListItem(field)}
          className="flex items-center gap-1 text-xs text-[#002FA7] hover:text-blue-400 transition-colors"
        >
          <Plus className="w-3 h-3" /> Add
        </button>
      </div>
      <div className="space-y-2">
        {form[field].map((item, idx) => (
          <div key={idx} className="flex gap-2">
            <input
              value={item}
              onChange={(e) => handleListChange(field, idx, e.target.value)}
              placeholder={placeholder}
              className="flex-1 bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#002FA7]"
            />
            {form[field].length > 1 && (
              <button
                type="button"
                onClick={() => removeListItem(field, idx)}
                className="p-2 text-slate-600 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6" data-testid="careers-editor">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/careers")}
          className="p-2 text-slate-500 hover:text-white transition-colors rounded-lg hover:bg-slate-800"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="flex-1 text-xl font-bold text-white">
          {isNew ? "New Job Listing" : "Edit Listing"}
        </h1>
        <button
          form="careers-form" type="submit" disabled={saving}
          className="flex items-center gap-2 bg-[#002FA7] hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          data-testid="careers-save-btn"
        >
          {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving…" : "Save"}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <form id="careers-form" onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-[#0f1117] border border-slate-800 rounded-xl p-5 space-y-4">
              <div>
                <label className="text-xs text-slate-500 font-medium block mb-1.5">Job Title *</label>
                <input name="title" value={form.title} onChange={handleChange} required
                  placeholder="Senior Software Engineer"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#002FA7]"
                  data-testid="careers-title"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 font-medium block mb-1.5">Slug</label>
                <input name="slug" value={form.slug} onChange={handleChange}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-[#002FA7]"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 font-medium block mb-1.5">Description *</label>
                <textarea name="description" value={form.description} onChange={handleChange} required rows={5}
                  placeholder="Role overview and context..."
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#002FA7] resize-none"
                  data-testid="careers-description"
                />
              </div>
            </div>

            <div className="bg-[#0f1117] border border-slate-800 rounded-xl p-5 space-y-5">
              <ListEditor field="requirements" label="Requirements" placeholder="e.g. 5+ years of experience" />
              <ListEditor field="responsibilities" label="Responsibilities" placeholder="e.g. Design and build core APIs" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-[#0f1117] border border-slate-800 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-semibold text-white">Job Details</h3>
              {[
                { name: "status", label: "Status", options: STATUSES },
                { name: "department", label: "Department", options: DEPARTMENTS },
                { name: "type", label: "Type", options: JOB_TYPES },
                { name: "experience_level", label: "Experience Level", options: EXP_LEVELS },
              ].map(({ name, label, options }) => (
                <div key={name}>
                  <label className="text-xs text-slate-500 font-medium block mb-1.5">{label}</label>
                  <select name={name} value={form[name]} onChange={handleChange}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#002FA7]"
                    data-testid={`careers-${name}`}
                  >
                    <option value="">Select {label}</option>
                    {options.map((o) => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
                  </select>
                </div>
              ))}
              <div>
                <label className="text-xs text-slate-500 font-medium block mb-1.5">Location</label>
                <input name="location" value={form.location} onChange={handleChange}
                  placeholder="San Francisco, CA / Remote"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#002FA7]"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 font-medium block mb-1.5">Salary Range</label>
                <input name="salary_range" value={form.salary_range} onChange={handleChange}
                  placeholder="$120,000 — $180,000"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#002FA7]"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
