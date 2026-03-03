import SEO from '../components/SEO';
import { CATEGORIES } from '../utils/constants';

const AimsScopePage = () => (
  <section className="container-width py-14">
    <SEO title="Aims & Scope | IJAIF" description="Research scope and disciplines covered by IJAIF" />
    <div className="panel">
      <h1 className="section-title">Aims & Scope</h1>
      <p className="section-subtitle">
        IJAIF welcomes rigorous, novel, and interdisciplinary research that bridges theory and practice across major academic domains.
      </p>
    </div>
    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {CATEGORIES.map((category, index) => (
        <div key={category} className="rounded-2xl border border-primary-100 bg-white p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:border-primary-200">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-600">Domain {String(index + 1).padStart(2, '0')}</p>
          <h2 className="mt-3 text-lg font-semibold text-slate-900">{category}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">High-quality original research, systematic reviews, and interdisciplinary contributions are welcomed.</p>
        </div>
      ))}
    </div>
  </section>
);

export default AimsScopePage;
