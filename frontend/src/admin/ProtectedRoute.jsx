import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/admin/context/AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0b0f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#002FA7] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user.role) && user.role !== "super_admin") {
    return (
      <div className="min-h-screen bg-[#0a0b0f] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg font-medium">Access Denied</p>
          <p className="text-slate-500 mt-2">You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return children;
}
