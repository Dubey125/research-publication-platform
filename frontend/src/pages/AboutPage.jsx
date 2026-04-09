import SEO from '../components/SEO';
import { useSiteSettings } from '../context/SiteSettingsContext';

const FALLBACK = {
  aboutTitle:   'About IJTSE',
  aboutText:    'International Journal of Transdisciplinary Science and Engineering (IJTSE) is a distinguished peer-reviewed, open-access international journal dedicated to publishing high-quality research across diverse academic disciplines. The journal provides a global platform for researchers, academicians, professionals, and students to disseminate innovative research findings and emerging advancements. IJTSE emphasizes integrative scholarship where engineering, applied sciences, management, and interdisciplinary methods intersect to solve real-world problems. We prioritize methodological rigor, ethical publication, and broad societal relevance in every manuscript that moves forward to publication.',
  missionText:  `- To cultivate a robust ecosystem for interdisciplinary research that addresses complex global challenges.
- To provide a premier, peer-reviewed platform for scholars and practitioners globally.
- To foster innovation by bridging distinct academic fields and promoting cross-pollination of ideas.
- To uphold the highest standards of academic integrity, transparency, and ethical publishing.
- To ensure open and equitable access to scientific knowledge for researchers worldwide.
- To support early-career researchers and emerging scholars through constructive peer review.
- To accelerate the dissemination of critical findings to policy-makers and industry leaders.
- To encourage collaborative research methodologies that break traditional academic silos.
- To leverage advanced digital tools and open-access models to maximize research visibility.
- To contribute meaningfully to sustainable development through transdisciplinary problem-solving.
- To build long-term reviewer and editor communities that support fair and timely manuscript evaluation.
- To mentor first-time authors with clear editorial guidance and transparent decision workflows.`,
  visionText:   `- To be the globally recognized, leading voices in transdisciplinary science and engineering.
- To redefine the boundaries of academic research by continuously adapting to emerging scientific paradigms.
- To become a primary catalyst for breakthroughs that require expertise across multiple disciplines.
- To establish a global community of innovators, engineers, and scientists dedicated to impactful research.
- To pioneer progressive open-access publication models that benefit both authors and readers.
- To set the industry benchmark for rapid, yet rigorous and fair, peer-review processes.
- To create an inclusive platform that amplifies research from underrepresented global regions.
- To foster long-term partnerships with leading academic institutions and research organizations.
- To constantly evolve our platforms to provide the best reading, reviewing, and publishing experience.
- To shape the future of scientific inquiry by prioritizing research that impacts humanity positively.
- To become a trusted global reference for actionable interdisciplinary research and technology transfer.
- To empower evidence-informed decisions in academia, policy, and industry through accessible publications.`,
  journalISSN:  '',
  journalDOI:   '',
  publisherName:'IJTSE Publishing Group'
};

const renderTextList = (text = '') => {
  const items = text.split('\n')
    .map(t => t.replace(/^[\-\•\*]\s+/, '').trim())
    .filter(Boolean);
  
  if (items.length <= 1) {
    return <p className="mt-4 text-[12px] leading-6 text-slate-600 dark:text-slate-400">{text}</p>;
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
        <p className="section-subtitle mt-3 text-[12px] text-slate-600 dark:text-slate-400 leading-relaxed md:text-[13px]">{s.aboutText}</p>

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

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-primary-700 border-b border-primary-100 pb-3">What We Offer</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-sm font-semibold text-slate-900">Rigorous Review</h3>
              <p className="mt-2 text-xs leading-6 text-slate-600">Structured editorial screening and high-quality peer review focused on novelty, clarity, and practical relevance.</p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-sm font-semibold text-slate-900">Global Visibility</h3>
              <p className="mt-2 text-xs leading-6 text-slate-600">Open-access dissemination model designed to maximize readership, citations, and cross-disciplinary collaboration.</p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-sm font-semibold text-slate-900">Author Support</h3>
              <p className="mt-2 text-xs leading-6 text-slate-600">Clear formatting guidance, transparent editorial communication, and constructive feedback throughout publication.</p>
            </article>
          </div>
        </div>

        {(s.journalISSN || s.journalDOI || s.publisherName) && (
          <div className="mt-10 flex flex-wrap gap-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-4 text-xs text-slate-600 dark:text-slate-400 shadow-sm">
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
