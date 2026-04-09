import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/current-issue', label: 'Issues' },
  { to: '/editorial-board', label: 'Editorial Board' },
  { to: '/join-reviewer', label: 'Join Reviewer' },
  { to: '/policies', label: 'Policies' },
  { to: '/contact', label: 'Contact' }
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="glass-nav sticky top-0 z-50">
      <div className="container-width flex items-center justify-between gap-4 py-3">
        {/* Logo */}
        <Link to="/" className="group flex min-w-0 items-center gap-2">
          <img
            src="/logo.png"
            alt="IJTSE Logo"
            className="h-9 w-9 md:h-10 md:w-10 shrink-0 object-contain drop-shadow-sm dark:bg-white/90 dark:p-1 dark:rounded-lg"
          />
          <span className="min-w-0">
            <span className="block text-[9px] font-semibold uppercase tracking-[0.2em] text-indigo-700 dark:text-indigo-400">Academic Journal</span>
            <span className="block text-xs sm:text-sm font-bold leading-tight text-slate-900 dark:text-slate-100 line-clamp-1">
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
                `text-sm font-medium whitespace-nowrap transition-colors ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 lg:flex">
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition"
            aria-label="Toggle Dark Mode"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link
            to="/submit-paper"
            className="rounded-lg bg-slate-900 dark:bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow transition hover:bg-slate-700 dark:hover:bg-indigo-500"
          >
            Submit Paper
          </Link>
          <Link
            to="/admin/login"
            className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 transition hover:border-indigo-400 hover:text-indigo-600 dark:hover:border-indigo-500 dark:hover:text-indigo-400"
          >
            Admin
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="border-t border-slate-200/70 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 px-6 py-4 backdrop-blur-xl lg:hidden">
          <nav className="flex flex-col gap-3">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `text-sm font-medium py-1 transition-colors ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-slate-200 dark:border-slate-800 pt-3">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 transition hover:border-indigo-400 hover:text-indigo-600 dark:hover:border-indigo-500 dark:hover:text-indigo-400"
              >
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </button>
              <Link
                to="/admin/login"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg bg-slate-900 dark:bg-indigo-600 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-slate-700 dark:hover:bg-indigo-500"
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
