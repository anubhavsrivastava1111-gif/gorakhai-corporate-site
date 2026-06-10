import { Link } from "react-router-dom";
import { Clock, ArrowLeft } from "lucide-react";

export default function ComingSoon({ feature = "This feature" }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center" data-testid="coming-soon-page">
      <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-6">
        <Clock className="w-8 h-8 text-slate-500" />
      </div>
      <h2 className="text-xl font-bold text-white mb-2">Coming Soon</h2>
      <p className="text-slate-500 max-w-sm mb-8">
        {feature} is planned for a future milestone. The navigation is reserved as a placeholder.
      </p>
      <Link
        to="/admin"
        className="flex items-center gap-2 text-sm text-[#002FA7] hover:text-blue-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>
    </div>
  );
}
