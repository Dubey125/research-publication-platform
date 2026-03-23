import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/current-issue', label: 'Issues' },
  { to: '/editorial-board', label: 'Editorial Board' },
  { to: '/policies', label: 'Policies' },
  { to: '/contact', label: 'Contact' }
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="glass-nav sticky top-0 z-50">
      <div className="container-width flex items-center justify-between gap-4 py-3">
        {/* Logo */}
        <Link to="/" className="group flex min-w-0 items-center gap-2 shrink-0">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-slate-900 shadow-md shadow-amber-200">
            TS
          </span>
          <span className="min-w-0">
            <span className="block text-[9px] font-semibold uppercase tracking-[0.2em] text-indigo-700">Academic Journal</span>
            <span className="block truncate text-sm font-bold leading-tight text-slate-900 md:max-w-[320px] lg:max-w-[460px] xl:max-w-none">
              International Journal of Transdisciplinary Science and Engineering
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-5 lg:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `text-sm font-medium whitespace-nowrap transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 lg:flex">
          <Link
            to="/submit-paper"
            className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow transition hover:bg-slate-700"
          >
            Submit Paper
          </Link>
          <Link
            to="/admin/login"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-400 hover:text-indigo-600"
          >
            Admin
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="border-t border-slate-200/70 bg-white/95 px-6 py-4 backdrop-blur-xl lg:hidden">
          <nav className="flex flex-col gap-3">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `text-sm font-medium py-1 transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-700 hover:text-indigo-600'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="mt-2 flex flex-col gap-2">
              <Link
                to="/admin/login"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-center text-sm font-semibold text-slate-700"
              >
                Admin
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
