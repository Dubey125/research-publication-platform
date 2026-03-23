import { useState } from 'react';
import SEO from '../components/SEO';
import api from '../utils/api';
import { JOURNAL_CONTACT } from '../utils/constants';
import { useSiteSettings } from '../context/SiteSettingsContext';

const inp = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100';

const ContactPage = () => {
  const raw  = useSiteSettings();
  const s    = raw || {};

  /* Prefer DB values, fall back to constants */
  const email   = s.contactEmail   || JOURNAL_CONTACT.officialEmail;
  const phone   = s.contactPhone   || JOURNAL_CONTACT.phone;
  const address = [s.contactAddress, s.contactCity, s.contactCountry].filter(Boolean).join(', ') || JOURNAL_CONTACT.address;

  const socials = [
    { label: 'Facebook',     url: s.socialFacebook },
    { label: 'X / Twitter',  url: s.socialTwitter },
    { label: 'LinkedIn',     url: s.socialLinkedIn },
    { label: 'Instagram',    url: s.socialInstagram },
    { label: 'YouTube',      url: s.socialYouTube },
    { label: 'ResearchGate', url: s.socialResearchGate },
  ].filter((l) => l.url);

  const [form,   setForm]   = useState({ name: '', email: '', message: '', honeypot: '' });
  const [status, setStatus] = useState({ type: '', text: '' });

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', text: '' });
    try {
      await api.post('/contact', form);
      setStatus({ type: 'success', text: 'Message sent successfully.' });
      setForm({ name: '', email: '', message: '', honeypot: '' });
    } catch (error) {
      setStatus({ type: 'error', text: error?.response?.data?.message || 'Unable to send message.' });
    }
  };

  return (
    <section className="container-width py-14">
      <SEO title="Contact | International Journal of Transdisciplinary Science and Engineering" description="Contact editorial office" />
      <h1 className="section-title">Contact Us</h1>
      <p className="section-subtitle">Reach out to the editorial office for queries, submissions, and collaborations.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* Info panel */}
        <div className="panel space-y-5">
          <h2 className="font-semibold text-slate-800 text-lg">Editorial Office</h2>

          <div className="space-y-3 text-sm text-slate-600">
            {email && (
              <div className="flex items-start gap-3">
                <span className="mt-0.5 shrink-0 text-indigo-500">✉</span>
                <a href={`mailto:${email}`} className="break-all hover:text-indigo-600 transition">{email}</a>
              </div>
            )}
            {phone && (
              <div className="flex items-start gap-3">
                <span className="mt-0.5 shrink-0 text-indigo-500">📞</span>
                <span>{phone}</span>
              </div>
            )}
            {address && (
              <div className="flex items-start gap-3">
                <span className="mt-0.5 shrink-0 text-indigo-500">📍</span>
                <span className="leading-6">{address}</span>
              </div>
            )}
          </div>

          {socials.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">Follow Us</p>
              <div className="flex flex-wrap gap-2">
                {socials.map(({ label, url }) => (
                  <a key={label} href={url} target="_blank" rel="noreferrer"
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition">
                    {label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Form */}
        <form className="panel space-y-4" onSubmit={onSubmit}>
          <h2 className="font-semibold text-slate-800 text-lg">Send a Message</h2>
          <input className={inp} placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className={inp} type="email" placeholder="Your email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <textarea className={inp} rows={5} placeholder="Your message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
          <input className="hidden" tabIndex={-1} autoComplete="off" value={form.honeypot} onChange={(e) => setForm({ ...form, honeypot: e.target.value })} />
          {status.text && (
            <p className={`rounded-lg px-3 py-2 text-sm font-medium ${
              status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>{status.text}</p>
          )}
          <button className="btn-primary" type="submit">Send Message</button>
        </form>
      </div>
    </section>
  );
};

export default ContactPage;
