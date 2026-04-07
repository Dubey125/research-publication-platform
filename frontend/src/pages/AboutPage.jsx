import SEO from '../components/SEO';
import { useSiteSettings } from '../context/SiteSettingsContext';

const FALLBACK = {
  aboutTitle:   'About IJTSE',
  aboutText:    'International Journal of Transdisciplinary Science and Engineering (IJTSE) is a distinguished peer-reviewed, open-access international journal dedicated to publishing high-quality research across diverse academic disciplines. The journal provides a global platform for researchers, academicians, professionals, and students to disseminate innovative research findings and emerging advancements.',
  missionText:  `- To cultivate a robust ecosystem for interdisciplinary research that addresses complex global challenges.
- To provide a premier, peer-reviewed platform for scholars and practitioners globally.
- To foster innovation by bridging distinct academic fields and promoting cross-pollination of ideas.
- To uphold the highest standards of academic integrity, transparency, and ethical publishing.
- To ensure open and equitable access to scientific knowledge for researchers worldwide.
- To support early-career researchers and emerging scholars through constructive peer review.
- To accelerate the dissemination of critical findings to policy-makers and industry leaders.
- To encourage collaborative research methodologies that break traditional academic silos.
- To leverage advanced digital tools and open-access models to maximize research visibility.
- To contribute meaningfully to sustainable development through transdisciplinary problem-solving.`,
  visionText:   `- To be the globally recognized, leading voices in transdisciplinary science and engineering.
- To redefine the boundaries of academic research by continuously adapting to emerging scientific paradigms.
- To become a primary catalyst for breakthroughs that require expertise across multiple disciplines.
- To establish a global community of innovators, engineers, and scientists dedicated to impactful research.
- To pioneer progressive open-access publication models that benefit both authors and readers.
- To set the industry benchmark for rapid, yet rigorous and fair, peer-review processes.
- To create an inclusive platform that amplifies research from underrepresented global regions.
- To foster long-term partnerships with leading academic institutions and research organizations.
- To constantly evolve our platforms to provide the best reading, reviewing, and publishing experience.
- To shape the future of scientific inquiry by prioritizing research that impacts humanity positively.`,
  journalISSN:  '',
  journalDOI:   '',
  publisherName:'IJTSE Publishing Group'
};

const renderTextList = (text = '') => {
  const items = text.split('\n')
    .map(t => t.replace(/^[\-\•\*]\s+/, '').trim())
    .filter(Boolean);
  
  if (items.length <= 1) {
    return <p className="mt-4 text-[12px] leading-6 text-slate-600">{text}</p>;
  }

  return (
    <ul className="mt-4 ml-4 list-disc space-y-2 marker:text-indigo-400">
      {items.map((item, idx) => (
        <li key={idx} className="text-[12px] leading-relaxed text-slate-700 pl-1">{item}</li>
      ))}
    </ul>
  );
};

const AboutPage = () => {
  const raw    = useSiteSettings();
  const s      = raw ? { ...FALLBACK, ...Object.fromEntries(Object.entries(raw).filter(([, v]) => v)) } : FALLBACK;

  return (
    <section className="container-width py-14">
      <SEO title="About | International Journal of Transdisciplinary Science and Engineering" description="About the International Journal of Transdisciplinary Science and Engineering" />
      <div className="panel">
        <h1 className="section-title">{s.aboutTitle}</h1>
        <p className="section-subtitle mt-3 text-[12px] text-slate-600 leading-relaxed md:text-[13px]">{s.aboutText}</p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-primary-100 bg-gradient-to-br from-white to-slate-50 p-6 md:p-8 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-primary-700 border-b border-primary-100 pb-3">Mission</h2>
            {renderTextList(s.missionText)}
          </article>
          <article className="rounded-2xl border border-primary-100 bg-gradient-to-br from-white to-slate-50 p-6 md:p-8 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-primary-700 border-b border-primary-100 pb-3">Vision</h2>
            {renderTextList(s.visionText)}
          </article>
        </div>

        {(s.journalISSN || s.journalDOI || s.publisherName) && (
          <div className="mt-10 flex flex-wrap gap-6 rounded-2xl border border-slate-200 bg-white px-6 py-4 text-xs text-slate-600 shadow-sm">
            {s.journalISSN    && <span className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-indigo-500"></div><span className="font-semibold text-slate-800">ISSN:</span> {s.journalISSN}</span>}
            {s.journalDOI     && <span className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div><span className="font-semibold text-slate-800">DOI:</span> {s.journalDOI}</span>}
            {s.publisherName  && <span className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div><span className="font-semibold text-slate-800">Publisher:</span> {s.publisherName}</span>}
          </div>
        )}
      </div>
    </section>
  );
};

export default AboutPage;
