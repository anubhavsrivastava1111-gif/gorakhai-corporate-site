import { useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/admin/context/AuthContext";
import {
  LayoutDashboard, FileText, Briefcase, Mail, Send, Clock,
  Users, Activity, ChevronLeft, ChevronRight, LogOut, User,
  Brain, ShoppingBag, MessageCircle, Calendar, Handshake, Shield,
  Menu, X, AlertCircle,
} from "lucide-react";

const NAV_SECTIONS = [
  {
    label: "Overview",
    items: [
      { path: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
    ],
  },
  {
    label: "Content",
    roles: ["super_admin", "content_admin"],
    items: [
      { path: "/admin/blog", icon: FileText, label: "Blog" },
      { path: "/admin/careers", icon: Briefcase, label: "Careers" },
    ],
  },
  {
    label: "Community",
    roles: ["super_admin", "community_admin"],
    items: [
      { path: "/admin/leads", icon: Mail, label: "Leads" },
      { path: "/admin/newsletter", icon: Send, label: "Newsletter" },
      { path: "/admin/waitlist", icon: Clock, label: "Waitlist" },
    ],
  },
  {
    label: "Expert Network",
    roles: ["super_admin", "expert_network_admin"],
    items: [
      { path: "/admin/experts", icon: Users, label: "Expert Applications" },
    ],
  },
  {
    label: "System",
    roles: ["super_admin"],
    items: [
      { path: "/admin/users", icon: Shield, label: "Admin Users" },
      { path: "/admin/activity-logs", icon: Activity, label: "Activity Logs" },
    ],
  },
  {
    label: "Coming Soon",
    placeholder: true,
    items: [
      { path: "/admin/ai-boardroom", icon: Brain, label: "AI Boardroom" },
      { path: "/admin/marketplace", icon: ShoppingBag, label: "Expert Marketplace" },
      { path: "/admin/community", icon: MessageCircle, label: "Community" },
      { path: "/admin/events", icon: Calendar, label: "Events" },
      { path: "/admin/partners", icon: Handshake, label: "Partner Program" },
    ],
  },
];

const ROLE_LABELS = {
  super_admin: "Super Admin",
  content_admin: "Content Admin",
  community_admin: "Community Admin",
  expert_network_admin: "Expert Network Admin",
};

function NavItem({ item, collapsed, placeholder }) {
  const location = useLocation();
  const isActive = item.exact
    ? location.pathname === item.path
    : location.pathname.startsWith(item.path);

  if (placeholder) {
    return (
      <div
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg opacity-40 cursor-not-allowed select-none ${
          collapsed ? "justify-center" : ""
        }`}
        title={collapsed ? item.label : undefined}
      >
        <item.icon className="w-4 h-4 flex-shrink-0 text-slate-500" />
        {!collapsed && (
          <span className="text-sm text-slate-500 truncate">{item.label}</span>
        )}
        {!collapsed && (
          <span className="ml-auto text-[10px] bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded font-medium">
            SOON
          </span>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={item.path}
      end={item.exact}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group ${
        collapsed ? "justify-center" : ""
      } ${
        isActive
          ? "bg-[#002FA7] text-white shadow-sm"
          : "text-slate-400 hover:text-white hover:bg-slate-700/60"
      }`}
      title={collapsed ? item.label : undefined}
      data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <item.icon className="w-4 h-4 flex-shrink-0" />
      {!collapsed && <span className="text-sm font-medium truncate">{item.label}</span>}
    </NavLink>
  );
}

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  const canSeeSection = (section) => {
    if (!section.roles || section.placeholder) return true;
    return section.roles.includes(user?.role);
  };

  const Sidebar = ({ mobile = false }) => (
    <aside
      className={`flex flex-col h-full bg-[#0f1117] border-r border-slate-800 transition-all duration-200 ${
        mobile ? "w-64" : collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Logo */}
      <div
        className={`flex items-center h-16 px-4 border-b border-slate-800 flex-shrink-0 ${
          collapsed && !mobile ? "justify-center" : "gap-3"
        }`}
      >
        <div className="w-8 h-8 bg-[#002FA7] rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">G</span>
        </div>
        {(!collapsed || mobile) && (
          <div>
            <p className="text-white font-semibold text-sm leading-tight">Gorakhai</p>
            <p className="text-slate-500 text-xs">CMS Admin</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-4">
        {NAV_SECTIONS.map((section) => {
          if (!canSeeSection(section)) return null;
          return (
            <div key={section.label}>
              {(!collapsed || mobile) && (
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest px-3 mb-1.5">
                  {section.label}
                </p>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <NavItem
                    key={item.path}
                    item={item}
                    collapsed={collapsed && !mobile}
                    placeholder={section.placeholder}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="flex-shrink-0 border-t border-slate-800 p-3">
        {(!collapsed || mobile) ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-slate-300" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-medium truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{ROLE_LABELS[user?.role]}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-500 hover:text-red-400 transition-colors rounded"
              title="Logout"
              data-testid="logout-btn"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            className="w-full flex justify-center p-1.5 text-slate-500 hover:text-red-400 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-[#0a0b0f] overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col h-full">
        <Sidebar />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-10 bg-slate-700 hover:bg-[#002FA7] text-white rounded-r flex items-center justify-center transition-colors z-10"
          style={{ left: collapsed ? "3.5rem" : "15.5rem" }}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="flex flex-col h-full">
            <Sidebar mobile />
          </div>
          <div
            className="flex-1 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-[#0f1117] border-b border-slate-800 flex items-center px-4 gap-4 flex-shrink-0">
          <button
            className="lg:hidden p-2 text-slate-400 hover:text-white"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            View Site
          </a>
          <div className="w-px h-5 bg-slate-700" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#002FA7] rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {user?.name?.[0]?.toUpperCase()}
              </span>
            </div>
            <span className="text-sm text-slate-300 hidden sm:block">{user?.email}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
