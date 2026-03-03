import SEO from '../components/SEO';

const items = [
  'Manuscript should be submitted in clear academic format with title, abstract, keywords, methodology, results, and references.',
  'Plagiarism limit is strictly 15% (excluding bibliography and common phrases).',
  'Accepted citation styles: APA or IEEE.',
  'Typical peer review timeline is 2–3 weeks.',
  'Editorial decisions include: Accept, Minor Revision, Major Revision, and Reject.'
];

const AuthorGuidelinesPage = () => (
  <section className="container-width py-14">
    <SEO title="Author Guidelines | IJAIF" description="Manuscript preparation and submission guidelines for IJAIF" />
    <div className="panel">
      <h1 className="section-title">Author Guidelines</h1>
      <p className="section-subtitle">Follow these instructions to ensure smooth editorial processing and review.</p>
      <ul className="mt-6 space-y-4 text-slate-700">
        {items.map((item, index) => (
          <li key={item} className="rounded-xl border border-primary-100 bg-white p-4 leading-7">
            <span className="mr-2 rounded-md bg-primary-50 px-2 py-1 text-xs font-bold text-primary-700">{index + 1}</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default AuthorGuidelinesPage;
