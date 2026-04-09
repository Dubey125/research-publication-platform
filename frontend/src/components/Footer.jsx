import { Link } from 'react-router-dom';
import { JOURNAL_CONTACT, TAGLINE } from '../utils/constants';
import { useSiteSettings } from '../context/SiteSettingsContext';

const Footer = () => {
  const raw = useSiteSettings();
  const s   = raw || {};

  const email   = s.contactEmail   || JOURNAL_CONTACT.officialEmail;
  const phone   = s.contactPhone   || JOURNAL_CONTACT.phone;
  const address = [s.contactAddress, s.contactCity, s.contactCountry].filter(Boolean).join(', ')
                  || JOURNAL_CONTACT.address;

  const socials = [
    { label: 'ResearchGate', url: s.socialResearchGate },
    { label: 'Instagram',    url: s.socialInstagram },
  ].filter((l) => l.url);

  /* Fall back to placeholder links so footer never looks empty */
  const socialLinks = socials.length > 0 ? socials : [];
  const quickLinks = [
    { to: '/about', label: 'About' },
    { to: '/current-issue', label: 'Issues' },
    { to: '/submit-paper', label: 'Submit Paper' },
    { to: '/join-reviewer', label: 'Join Reviewer' },
    { to: '/editorial-board', label: 'Editorial Board' },
    { to: '/policies', label: 'Policies' },
    { to: '/author-guidelines', label: 'Author Guidelines' },
    { to: '/contact', label: 'Contact' }
  ];
  const mid = Math.ceil(quickLinks.length / 2);
  const leftColumnLinks = quickLinks.slice(0, mid);
  const rightColumnLinks = quickLinks.slice(mid);

  return (
    <footer className="border-t border-slate-800 bg-slate-900 text-white">
      <div className="container-width grid gap-10 py-12 md:grid-cols-3">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="IJTSE Logo"
              className="h-10 w-10 object-contain drop-shadow-md"
            />
            <span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-indigo-400">Academic Journal</span>
              <span className="block text-sm font-bold text-white">International Journal of Transdisciplinary Science and Engineering</span>
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-7 text-slate-400">{TAGLINE}</p>
          {s.publisherName && (
            <p className="mt-2 text-xs text-slate-500">{s.publisherName}</p>
          )}
          {s.journalISSN && (
            <p className="mt-1 text-xs text-slate-500">ISSN: {s.journalISSN}</p>
          )}
        </div>

        {/* Quick links */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Quick Links</h4>
          <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2.5">
            <ul className="space-y-2.5">
              {leftColumnLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-slate-400 transition hover:text-indigo-400">{link.label}</Link>
                </li>
              ))}
            </ul>
            <ul className="space-y-2.5">
              {rightColumnLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-slate-400 transition hover:text-indigo-400">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Contact</h4>
          <ul className="mt-4 space-y-2 text-sm text-slate-400">
            <li><a href="mailto:ijtsejournal@gmail.com" className="hover:text-indigo-400 transition">ijtsejournal@gmail.com</a></li>
          </ul>
          <div className="mt-5 flex flex-wrap gap-2">
            {socialLinks.map(({ label, url }) => (
              <a key={label} href={url} target="_blank" rel="noreferrer"
                className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-400 transition hover:border-indigo-500 hover:text-indigo-400">
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 py-5 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} International Journal of Transdisciplinary Science and Engineering. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

