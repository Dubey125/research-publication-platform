import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';

const links = [
  { to: '/', label: 'Home' },
  { to: '/aims-scope', label: 'Aims & Scope' },
  { to: '/editorial-board', label: 'Editorial Board' },
  { to: '/archives', label: 'Archives' }
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="glass-nav sticky top-0 z-50">
      <div className="container-width flex items-center justify-between py-4">
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-3 shrink-0">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white shadow-md shadow-indigo-200">
            IJ
          </span>
          <span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-indigo-600">Academic Journal</span>
            <span className="block text-base font-bold text-slate-900 leading-tight">IJAIF</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-indigo-300 hover:text-indigo-600"
            aria-label="Search"
          >
            <Search size={16} />
          </button>
          <Link
            to="/submit-manuscript"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-slate-700"
          >
            Submit Manuscript
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
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="border-t border-slate-200/70 bg-white/95 px-6 py-4 backdrop-blur-xl md:hidden">
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
                to="/submit-manuscript"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg bg-slate-900 px-4 py-2 text-center text-sm font-semibold text-white"
              >
                Submit Manuscript
              </Link>
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
