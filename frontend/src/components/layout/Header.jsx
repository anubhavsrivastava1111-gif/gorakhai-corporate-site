import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X, Menu, Zap, Brain } from 'lucide-react';
import { NAV } from '@/constants/testIds';

const products = [
  {
    name: 'Orchestra IQ',
    path: '/products/orchestra-iq',
    description: 'Multi-model AI orchestration platform',
    icon: <Zap size={16} className="text-[#002FA7]" />,
    testId: NAV.orchestraIQ
  },
  {
    name: 'Arjun AI',
    path: '/products/arjun-ai',
    description: 'Precision enterprise AI assistant',
    icon: <Brain size={16} className="text-[#002FA7]" />,
    testId: NAV.arjunAI
  }
];

const navLinks = [
  { label: 'About', path: '/about', testId: NAV.about },
  { label: 'Blog', path: '/blog', testId: NAV.blog },
  { label: 'Expert Network', path: '/expert-network', testId: NAV.expertNetwork },
  { label: 'Contact', path: '/contact', testId: NAV.contact },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setProductsOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/90 backdrop-blur-xl border-b border-white/[0.06]' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link
            to="/"
            data-testid={NAV.logo}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 bg-[#002FA7] rounded-sm flex items-center justify-center font-heading font-bold text-white text-sm">
              G
            </div>
            <span className="font-heading font-semibold text-white text-lg tracking-tight">
              Gorakhai
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Products Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setProductsOpen(true)}
              onMouseLeave={() => setProductsOpen(false)}
            >
              <button
                data-testid={NAV.products}
                className={`flex items-center gap-1 px-3 py-2 text-sm rounded-md transition-colors ${
                  location.pathname.startsWith('/products')
                    ? 'text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Products
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${productsOpen ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence>
                {productsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-1 w-64 bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden shadow-2xl"
                  >
                    {products.map((product) => (
                      <Link
                        key={product.path}
                        to={product.path}
                        data-testid={product.testId}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-zinc-900 transition-colors group"
                      >
                        <div className="mt-0.5">{product.icon}</div>
                        <div>
                          <div className="text-sm font-medium text-white group-hover:text-white">
                            {product.name}
                          </div>
                          <div className="text-xs text-zinc-500 mt-0.5">{product.description}</div>
                        </div>
                      </Link>
                    ))}
                    <div className="border-t border-zinc-800">
                      <Link
                        to="/products"
                        className="flex items-center px-4 py-3 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                      >
                        View all products →
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                data-testid={link.testId}
                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                  isActive(link.path) ? 'text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <Link
              to="/contact"
              data-testid={NAV.requestDemo}
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-white text-black text-sm font-medium rounded-md hover:bg-zinc-100 transition-colors"
            >
              Request Demo
            </Link>
            <button
              data-testid={NAV.mobileMenu}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-black border-t border-zinc-900 overflow-hidden"
          >
            <div className="px-6 py-4 space-y-1">
              <div className="pb-2">
                <p className="text-xs uppercase tracking-widest text-zinc-600 px-3 py-1">Products</p>
                {products.map((product) => (
                  <Link
                    key={product.path}
                    to={product.path}
                    data-testid={product.testId}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-zinc-300 hover:text-white rounded-md hover:bg-zinc-900 transition-colors"
                  >
                    {product.icon}
                    {product.name}
                  </Link>
                ))}
              </div>
              <div className="border-t border-zinc-900 pt-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    data-testid={link.testId}
                    className="block px-3 py-2.5 text-sm text-zinc-300 hover:text-white rounded-md hover:bg-zinc-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="pt-3 border-t border-zinc-900">
                <Link
                  to="/contact"
                  data-testid={NAV.requestDemo}
                  className="flex items-center justify-center w-full px-4 py-2.5 bg-white text-black text-sm font-medium rounded-md"
                >
                  Request Demo
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
