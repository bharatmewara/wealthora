import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, Phone, X } from 'lucide-react';

const navItems = [
  { to: '/services', label: 'Services' },
  { to: '/blog', label: 'Blog' },
  { to: '/testimonials', label: 'Testimonials' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' }
];

const navClass = ({ isActive }) =>
  `text-sm font-semibold transition-colors ${
    isActive ? 'text-sky-700' : 'text-slate-700 hover:text-sky-600'
  }`;

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/wealthora-logo-cropped.png"
            alt="Wealthora Compliance Hub"
            className="h-8 w-auto sm:h-9 md:h-10"
            loading="eager"
          />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={navClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <a href="tel:+919876543210" className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200">
            <Phone size={14} /> +91 98765 43210
          </a>
          <Link
            to="/contact"
            className="rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:from-sky-700 hover:to-blue-700"
          >
            Talk to us
          </Link>
        </div>

        <button
          type="button"
          className="rounded-lg border border-slate-200 p-2 text-slate-700 md:hidden"
          onClick={() => setMobileOpen((value) => !value)}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={navClass}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
            <div className="flex flex-col gap-2">
              <a href="tel:+919876543210" className="text-center text-sm font-semibold text-slate-700 hover:text-sky-600">
                Call: +91 98765 43210
              </a>
              <Link
                to="/contact"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg bg-gradient-to-r from-sky-600 to-blue-600 px-4 py-2 text-center text-sm font-semibold text-white"
              >
                Talk to us
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
