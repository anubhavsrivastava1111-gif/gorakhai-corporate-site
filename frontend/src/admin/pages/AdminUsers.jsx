import { useState, useEffect } from "react";
import api, { formatError } from "@/lib/api";
import { Shield, Plus, Edit, Trash2, X, Save, User } from "lucide-react";

const ROLES = ["super_admin", "content_admin", "community_admin", "expert_network_admin"];
const ROLE_LABELS = {
  super_admin: "Super Admin",
  content_admin: "Content Admin",
  community_admin: "Community Admin",
  expert_network_admin: "Expert Network Admin",
};
const ROLE_COLORS = {
  super_admin: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  content_admin: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  community_admin: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  expert_network_admin: "bg-amber-500/20 text-amber-300 border-amber-500/30",
};

const EMPTY_FORM = { email: "", name: "", password: "", role: "content_admin" };

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/admin/users");
      setUsers(res.data.users || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
    setError("");
    setShowModal(true);
  };

  const openEdit = (user) => {
    setForm({ email: user.email, name: user.name, password: "", role: user.role });
    setEditId(user.id);
    setError("");
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editId) {
        const payload = { name: form.name, role: form.role };
        if (form.password) payload.password = form.password;
        await api.put(`/api/admin/users/${editId}`, payload);
      } else {
        await api.post("/api/admin/users", form);
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      setError(formatError(err.response?.data?.detail));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete admin user "${user.email}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/api/admin/users/${user.id}`);
      fetchUsers();
    } catch (err) {
      alert(formatError(err.response?.data?.detail));
    }
  };

  return (
    <div className="space-y-6" data-testid="admin-users-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Users</h1>
          <p className="text-slate-500 text-sm mt-1">{users.length} admin accounts</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#002FA7] hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          data-testid="create-user-btn"
        >
          <Plus className="w-4 h-4" />
          Add Admin
        </button>
      </div>

      <div className="bg-[#0f1117] border border-slate-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-6 h-6 border-2 border-[#002FA7] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <table className="w-full" data-testid="users-table">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left text-xs text-slate-500 font-semibold uppercase tracking-wide px-5 py-3">User</th>
                <th className="text-left text-xs text-slate-500 font-semibold uppercase tracking-wide px-4 py-3">Role</th>
                <th className="text-left text-xs text-slate-500 font-semibold uppercase tracking-wide px-4 py-3 hidden sm:table-cell">Status</th>
                <th className="text-left text-xs text-slate-500 font-semibold uppercase tracking-wide px-4 py-3 hidden md:table-cell">Last Login</th>
                <th className="px-4 py-3 w-20" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#002FA7]/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-[#002FA7]" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{user.name}</p>
                        <p className="text-slate-500 text-xs">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${ROLE_COLORS[user.role] || ""}`}>
                      {ROLE_LABELS[user.role] || user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 hidden sm:table-cell">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                      user.is_active
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                        : "bg-slate-500/20 text-slate-300 border-slate-500/30"
                    }`}>
                      {user.is_active ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <span className="text-slate-500 text-xs">
                      {user.last_login ? new Date(user.last_login).toLocaleDateString() : "Never"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(user)}
                        className="p-1.5 text-slate-500 hover:text-blue-400 transition-colors"
                        data-testid={`edit-user-${user.id}`}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                        data-testid={`delete-user-${user.id}`}
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
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0f1117] border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <h3 className="text-white font-semibold">
                {editId ? "Edit Admin User" : "Add Admin User"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">
                  {error}
                </div>
              )}
              {!editId && (
                <div>
                  <label className="text-xs text-slate-500 font-medium block mb-1.5">Email *</label>
                  <input
                    type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    required placeholder="admin@gorakhai.com"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#002FA7]"
                    data-testid="user-email"
                  />
                </div>
              )}
              <div>
                <label className="text-xs text-slate-500 font-medium block mb-1.5">Name *</label>
                <input
                  value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required placeholder="Full name"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#002FA7]"
                  data-testid="user-name"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 font-medium block mb-1.5">
                  {editId ? "New Password (leave blank to keep current)" : "Password *"}
                </label>
                <input
                  type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  required={!editId} minLength={6} placeholder="••••••••"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#002FA7]"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 font-medium block mb-1.5">Role *</label>
                <select
                  value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#002FA7]"
                  data-testid="user-role"
                >
                  {ROLES.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button" onClick={() => setShowModal(false)}
                  className="flex-1 border border-slate-700 text-slate-300 py-2 rounded-lg text-sm hover:border-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit" disabled={saving}
                  className="flex-1 bg-[#002FA7] hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  data-testid="user-save-btn"
                >
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? "Saving…" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
