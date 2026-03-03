import SEO from '../components/SEO';

const points = [
  'Plagiarism policy: zero tolerance for unethical copying beyond acceptable limits.',
  'Conflict of interest policy: authors and reviewers must disclose potential conflicts.',
  'Duplicate submission policy: submissions must not be under review elsewhere.',
  'Ethical research compliance: studies involving humans/animals must follow relevant ethical standards.'
];

const PublicationEthicsPage = () => (
  <section className="container-width py-14">
    <SEO title="Publication Ethics | IJAIF" description="Publication ethics and integrity policy for IJAIF" />
    <div className="panel">
      <h1 className="section-title">Publication Ethics</h1>
      <p className="section-subtitle">Integrity, originality, and transparent disclosure form the foundation of our publication standards.</p>
      <div className="mt-6 space-y-4">
        {points.map((point, index) => (
          <div key={point} className="rounded-xl border border-primary-100 bg-white p-4 text-slate-700">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-600">Policy {index + 1}</p>
            <p className="mt-2 leading-7">{point}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default PublicationEthicsPage;
