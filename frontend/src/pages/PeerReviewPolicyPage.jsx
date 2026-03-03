import SEO from '../components/SEO';

const reviewStages = [
  'Double-blind review process is followed for all eligible manuscripts.',
  'Each manuscript is evaluated by a minimum of 2 independent reviewers.',
  'Editorial decisions are based on quality, originality, and relevance with transparent communication to authors.'
];

const PeerReviewPolicyPage = () => (
  <section className="container-width py-14">
    <SEO title="Peer Review Policy | IJAIF" description="Peer review process followed by IJAIF" />
    <div className="panel">
      <h1 className="section-title">Peer Review Policy</h1>
      <p className="section-subtitle">A transparent, evidence-based review workflow is used to maintain publication quality.</p>
      <ul className="mt-6 space-y-4 text-slate-700">
        {reviewStages.map((item, index) => (
          <li key={item} className="rounded-xl border border-primary-100 bg-white p-4 leading-7">
            <span className="mr-2 rounded-md bg-primary-50 px-2 py-1 text-xs font-bold text-primary-700">Stage {index + 1}</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default PeerReviewPolicyPage;
