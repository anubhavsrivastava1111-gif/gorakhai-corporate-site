import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import {
  FileText, Briefcase, Mail, Send, Clock, Users,
  ArrowUpRight, Activity, TrendingUp, ChevronRight,
} from "lucide-react";

const STAT_CARDS = [
  {
    key: "blog_posts", label: "Blog Posts", icon: FileText,
    href: "/admin/blog", color: "blue",
    metaKey: "published", metaLabel: "published",
  },
  {
    key: "job_listings", label: "Job Listings", icon: Briefcase,
    href: "/admin/careers", color: "emerald",
    metaKey: "open", metaLabel: "open",
  },
  {
    key: "leads", label: "Leads", icon: Mail,
    href: "/admin/leads", color: "amber",
    metaKey: "new", metaLabel: "new",
  },
  {
    key: "newsletter", label: "Subscribers", icon: Send,
    href: "/admin/newsletter", color: "purple",
    metaKey: "active", metaLabel: "active",
  },
  {
    key: "experts", label: "Expert Applications", icon: Users,
    href: "/admin/experts", color: "rose",
    metaKey: "pending", metaLabel: "pending review",
  },
  {
    key: "waitlist", label: "Waitlist", icon: Clock,
    href: "/admin/waitlist", color: "cyan",
    metaKey: "waitlisted", metaLabel: "waitlisted",
  },
];

const COLOR_MAP = {
  blue: { bg: "bg-blue-500/10", icon: "text-blue-400", badge: "bg-blue-500/20 text-blue-300" },
  emerald: { bg: "bg-emerald-500/10", icon: "text-emerald-400", badge: "bg-emerald-500/20 text-emerald-300" },
  amber: { bg: "bg-amber-500/10", icon: "text-amber-400", badge: "bg-amber-500/20 text-amber-300" },
  purple: { bg: "bg-purple-500/10", icon: "text-purple-400", badge: "bg-purple-500/20 text-purple-300" },
  rose: { bg: "bg-rose-500/10", icon: "text-rose-400", badge: "bg-rose-500/20 text-rose-300" },
  cyan: { bg: "bg-cyan-500/10", icon: "text-cyan-400", badge: "bg-cyan-500/20 text-cyan-300" },
};

const ACTION_MAP = {
  create: { label: "Created", color: "text-emerald-400" },
  update: { label: "Updated", color: "text-blue-400" },
  delete: { label: "Deleted", color: "text-red-400" },
  approve: { label: "Approved", color: "text-emerald-400" },
  reject: { label: "Rejected", color: "text-red-400" },
  status_change: { label: "Status changed", color: "text-amber-400" },
  login: { label: "Signed in", color: "text-slate-400" },
  logout: { label: "Signed out", color: "text-slate-400" },
};

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

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/admin/stats")
      .then((res) => {
        setStats(res.data.stats);
        setActivity(res.data.recent_activity || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#002FA7] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8" data-testid="admin-dashboard">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Overview of your Gorakhai CMS</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {STAT_CARDS.map((card) => {
          const data = stats?.[card.key] || {};
          const colors = COLOR_MAP[card.color];
          return (
            <Link
              key={card.key}
              to={card.href}
              className="bg-[#0f1117] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors group"
              data-testid={`stat-card-${card.key}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center`}>
                  <card.icon className={`w-5 h-5 ${colors.icon}`} />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-700 group-hover:text-slate-400 transition-colors" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{data.total ?? 0}</p>
                <p className="text-slate-400 text-sm mt-0.5">{card.label}</p>
                {data[card.metaKey] !== undefined && (
                  <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full font-medium ${colors.badge}`}>
                    {data[card.metaKey]} {card.metaLabel}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-[#0f1117] border border-slate-800 rounded-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-slate-400" />
            <h2 className="text-white font-semibold text-sm">Recent Activity</h2>
          </div>
          <Link
            to="/admin/activity-logs"
            className="text-xs text-slate-500 hover:text-[#002FA7] flex items-center gap-1 transition-colors"
          >
            View all <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="divide-y divide-slate-800">
          {activity.length === 0 ? (
            <div className="px-6 py-8 text-center text-slate-600 text-sm">No activity yet</div>
          ) : (
            activity.map((log) => {
              const meta = ACTION_MAP[log.action] || { label: log.action, color: "text-slate-400" };
              return (
                <div key={log.id} className="flex items-center gap-4 px-6 py-3.5">
                  <div className="w-7 h-7 bg-slate-800 rounded-full flex items-center justify-center flex-shrink-0">
                    <TrendingUp className={`w-3 h-3 ${meta.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-300">
                      <span className="font-medium text-white">{log.user_email}</span>
                      {" "}
                      <span className={meta.color}>{meta.label}</span>
                      {" "}
                      <span className="text-slate-500">{log.resource_type?.replace(/_/g, " ")}</span>
                    </p>
                    {log.resource_title && (
                      <p className="text-xs text-slate-600 truncate mt-0.5">{log.resource_title}</p>
                    )}
                  </div>
                  <span className="text-xs text-slate-600 flex-shrink-0">{timeAgo(log.created_at)}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
