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
    { label: 'LinkedIn',     url: s.socialLinkedIn },
    { label: 'X / Twitter',  url: s.socialTwitter },
    { label: 'Facebook',     url: s.socialFacebook },
    { label: 'YouTube',      url: s.socialYouTube },
    { label: 'ResearchGate', url: s.socialResearchGate },
    { label: 'Instagram',    url: s.socialInstagram },
  ].filter((l) => l.url);

  /* Fall back to placeholder links so footer never looks empty */
  const socialLinks = socials.length > 0 ? socials :
    [{ label: 'LinkedIn', url: '#' }, { label: 'X', url: '#' }, { label: 'YouTube', url: '#' }];

  return (
    <footer className="border-t border-slate-800 bg-slate-900 text-white">
      <div className="container-width grid gap-10 py-12 md:grid-cols-3">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">IJ</span>
            <span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-indigo-400">Academic Journal</span>
              <span className="block text-sm font-bold text-white">IJAIF</span>
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
          <ul className="mt-4 space-y-2.5">
            {[
              { to: '/aims-scope',     label: 'Aims & Scope' },
              { to: '/editorial-board',label: 'Editorial Board' },
              { to: '/author-guidelines', label: 'Author Guidelines' },
              { to: '/archives',       label: 'Archives' },
              { to: '/contact',        label: 'Contact' }
            ].map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-sm text-slate-400 transition hover:text-indigo-400">{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Contact</h4>
          <ul className="mt-4 space-y-2 text-sm text-slate-400">
            {email   && <li><a href={`mailto:${email}`} className="hover:text-indigo-400 transition">{email}</a></li>}
            {phone   && <li>{phone}</li>}
            {address && <li className="leading-6">{address}</li>}
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
        © {new Date().getFullYear()} IJAIF. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

