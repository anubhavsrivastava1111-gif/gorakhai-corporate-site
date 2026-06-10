import { Suspense, lazy } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { AuthProvider } from "@/admin/context/AuthContext";
import ProtectedRoute from "@/admin/ProtectedRoute";

// Public pages
const Home          = lazy(() => import("@/pages/Home"));
const About         = lazy(() => import("@/pages/About"));
const Products      = lazy(() => import("@/pages/Products"));
const OrchestraIQ   = lazy(() => import("@/pages/OrchestraIQ"));
const ArjunAI       = lazy(() => import("@/pages/ArjunAI"));
const Blog          = lazy(() => import("@/pages/Blog"));
const BlogPost      = lazy(() => import("@/pages/BlogPost"));
const Contact       = lazy(() => import("@/pages/Contact"));
const Careers       = lazy(() => import("@/pages/Careers"));
const CareerDetail  = lazy(() => import("@/pages/CareerDetail"));
const ExpertNetwork = lazy(() => import("@/pages/ExpertNetwork"));
const Waitlist      = lazy(() => import("@/pages/Waitlist"));

// Admin pages
const AdminLayout   = lazy(() => import("@/admin/AdminLayout"));
const AdminLogin    = lazy(() => import("@/admin/pages/Login"));
const Dashboard     = lazy(() => import("@/admin/pages/Dashboard"));
const BlogList      = lazy(() => import("@/admin/pages/BlogList"));
const BlogEditor    = lazy(() => import("@/admin/pages/BlogEditor"));
const CareersList   = lazy(() => import("@/admin/pages/CareersList"));
const CareersEditor = lazy(() => import("@/admin/pages/CareersEditor"));
const Leads         = lazy(() => import("@/admin/pages/Leads"));
const Newsletter    = lazy(() => import("@/admin/pages/Newsletter"));
const Experts       = lazy(() => import("@/admin/pages/Experts"));
const WaitlistAdmin = lazy(() => import("@/admin/pages/Waitlist"));
const ActivityLogs  = lazy(() => import("@/admin/pages/ActivityLogs"));
const AdminUsers    = lazy(() => import("@/admin/pages/AdminUsers"));
const ComingSoon    = lazy(() => import("@/admin/pages/ComingSoon"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

const Loader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#050505]">
    <div className="w-8 h-8 border-2 border-[#002FA7] border-t-transparent rounded-full animate-spin" />
  </div>
);

function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* ── Public site ── */}
          <Route element={<Layout />}>
            <Route path="/"                          element={<Home />} />
            <Route path="/about"                     element={<About />} />
            <Route path="/products"                  element={<Products />} />
            <Route path="/products/orchestra-iq"     element={<OrchestraIQ />} />
            <Route path="/products/arjun-ai"         element={<ArjunAI />} />
            <Route path="/blog"                      element={<Blog />} />
            <Route path="/blog/:slug"                element={<BlogPost />} />
            <Route path="/contact"                   element={<Contact />} />
            <Route path="/careers"                   element={<Careers />} />
            <Route path="/careers/:slug"             element={<CareerDetail />} />
            <Route path="/expert-network"            element={<ExpertNetwork />} />
            <Route path="/waitlist"                  element={<Waitlist />} />
          </Route>

          {/* ── Admin login (no layout) ── */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* ── Protected admin section ── */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />

            {/* Content */}
            <Route path="blog" element={<BlogList />} />
            <Route path="blog/new" element={<BlogEditor />} />
            <Route path="blog/:id" element={<BlogEditor />} />

            <Route path="careers" element={<CareersList />} />
            <Route path="careers/new" element={<CareersEditor />} />
            <Route path="careers/:id" element={<CareersEditor />} />

            {/* Community */}
            <Route path="leads" element={<Leads />} />
            <Route path="newsletter" element={<Newsletter />} />
            <Route path="waitlist" element={<WaitlistAdmin />} />

            {/* Expert Network */}
            <Route path="experts" element={<Experts />} />

            {/* System */}
            <Route path="users" element={<AdminUsers />} />
            <Route path="activity-logs" element={<ActivityLogs />} />

            {/* Future placeholders */}
            <Route path="ai-boardroom"  element={<ComingSoon feature="AI Boardroom" />} />
            <Route path="marketplace"   element={<ComingSoon feature="Human Expert Marketplace" />} />
            <Route path="community"     element={<ComingSoon feature="Community" />} />
            <Route path="events"        element={<ComingSoon feature="Events" />} />
            <Route path="partners"      element={<ComingSoon feature="Partner Program" />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
