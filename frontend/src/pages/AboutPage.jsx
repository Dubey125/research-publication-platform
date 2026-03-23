import SEO from '../components/SEO';
import { useSiteSettings } from '../context/SiteSettingsContext';

const FALLBACK = {
  aboutTitle:   'About the Journal',
  aboutText:    'International Journal of Transdisciplinary Science and Engineering is a peer-reviewed, open-access international journal dedicated to publishing high-quality research across diverse academic disciplines. The journal provides a global platform for researchers, academicians, professionals, and students to disseminate innovative research findings and emerging advancements.',
  missionText:  'Promote quality research that integrates knowledge across fields for meaningful societal impact.',
  visionText:   'Build a trusted interdisciplinary publication ecosystem with transparent and ethical scholarship.',
  journalISSN:  '',
  journalDOI:   '',
  publisherName:''
};

const AboutPage = () => {
  const raw    = useSiteSettings();
  const s      = raw ? { ...FALLBACK, ...Object.fromEntries(Object.entries(raw).filter(([, v]) => v)) } : FALLBACK;

  return (
    <section className="container-width py-14">
      <SEO title="About | International Journal of Transdisciplinary Science and Engineering" description="About the International Journal of Transdisciplinary Science and Engineering" />
      <div className="panel">
        <h1 className="section-title">{s.aboutTitle}</h1>
        <p className="section-subtitle">{s.aboutText}</p>

        <div className="mt-7 grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-primary-100 bg-white p-5">
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-primary-700">Mission</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{s.missionText}</p>
          </article>
          <article className="rounded-2xl border border-primary-100 bg-white p-5">
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-primary-700">Vision</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{s.visionText}</p>
          </article>
        </div>

        {(s.journalISSN || s.journalDOI || s.publisherName) && (
          <div className="mt-6 flex flex-wrap gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 text-sm text-slate-600">
            {s.journalISSN    && <span><span className="font-semibold text-slate-800">ISSN:</span> {s.journalISSN}</span>}
            {s.journalDOI     && <span><span className="font-semibold text-slate-800">DOI:</span> {s.journalDOI}</span>}
            {s.publisherName  && <span><span className="font-semibold text-slate-800">Publisher:</span> {s.publisherName}</span>}
          </div>
        )}
      </div>
    </section>
  );
};

export default AboutPage;
