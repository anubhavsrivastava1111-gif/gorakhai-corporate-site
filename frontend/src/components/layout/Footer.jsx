import { Link } from 'react-router-dom';
import { Linkedin, Twitter, Github } from 'lucide-react';

const footerLinks = {
  company: [
    { label: 'About Us', path: '/about' },
    { label: 'Careers', path: '/careers' },
    { label: 'Blog', path: '/blog' },
    { label: 'Contact', path: '/contact' },
  ],
  products: [
    { label: 'Orchestra IQ', path: '/products/orchestra-iq' },
    { label: 'Arjun AI', path: '/products/arjun-ai' },
    { label: 'All Products', path: '/products' },
  ],
  resources: [
    { label: 'Expert Network', path: '/expert-network' },
    { label: 'Blog & Insights', path: '/blog' },
    { label: 'Request Demo', path: '/contact' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-zinc-900 bg-[#050505]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand */}
          <div className="md:col-span-4">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-[#002FA7] rounded-sm flex items-center justify-center font-heading font-bold text-white text-sm">
                G
              </div>
              <span className="font-heading font-semibold text-white text-lg tracking-tight">
                Gorakhai
              </span>
            </Link>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-xs">
              Enterprise AI infrastructure for the modern organization. Orchestrate, automate, and amplify your intelligence.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-zinc-600 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-zinc-600 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={16} />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-zinc-600 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github size={16} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-8 grid grid-cols-3 gap-8">
            <div>
              <h4 className="text-xs uppercase tracking-widest text-zinc-600 mb-4">Company</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-sm text-zinc-500 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-widest text-zinc-600 mb-4">Products</h4>
              <ul className="space-y-3">
                {footerLinks.products.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-sm text-zinc-500 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-widest text-zinc-600 mb-4">Resources</h4>
              <ul className="space-y-3">
                {footerLinks.resources.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-sm text-zinc-500 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} Gorakhai Technologies Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">Terms of Service</a>
            <a href="#" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
