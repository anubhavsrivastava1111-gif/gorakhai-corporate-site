import { Suspense, lazy } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import Layout from "@/components/layout/Layout";

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
        </Routes>
      </Suspense>
    </>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </HelmetProvider>
  );
}
