import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, Phone, X, ChevronDown } from 'lucide-react';

const navItems = [
  { to: '/services', label: 'Services' },
  { to: '/blog', label: 'Blog' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' }
];

const navClass = ({ isActive }) =>
  `text-sm font-semibold transition-colors ${isActive ? 'text-sky-700' : 'text-slate-700 hover:text-sky-600'}`;

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <img
            src="/wealthora-logo-cropped.png"
            alt="Wealthora Compliance Hub"
            className="h-8 w-auto sm:h-9 md:h-10"
            loading="eager"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={navClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop CTAs — NO admin login visible */}
        <div className="hidden items-center gap-3 md:flex">
          <a
            href="tel:+919876543210"
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <Phone size={13} />
            Call Us Free
          </a>
          <Link
            to="/contact"
            className="rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 px-5 py-2 text-sm font-bold text-white shadow-md hover:from-sky-700 hover:to-blue-800 transition-all hover:-translate-y-0.5"
          >
            Free Consultation
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="rounded-lg border border-slate-200 p-2 text-slate-700 md:hidden hover:bg-slate-50"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 md:hidden shadow-lg">
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
            <div className="mt-2 flex flex-col gap-2 border-t border-slate-100 pt-3">
              <a
                href="tel:+919876543210"
                className="text-center text-sm font-semibold text-slate-600 hover:text-sky-600"
              >
                📞 Call Us Free
              </a>
              <Link
                to="/contact"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 px-4 py-2.5 text-center text-sm font-bold text-white shadow"
              >
                Free Consultation
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
