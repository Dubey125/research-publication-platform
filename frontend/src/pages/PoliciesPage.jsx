import { Link } from 'react-router-dom';
import PolicyPageShell from '../components/PolicyPageShell';
import { useContentByType } from '../utils/content';

const PoliciesPage = () => {
  const { content, loading } = useContentByType('policies');

  return (
    <PolicyPageShell
      seoTitle="Policies | International Journal of Transdisciplinary Science and Engineering"
      seoDescription="Journal policies on plagiarism, open access, peer review, and publication governance."
      title={content?.title || 'Journal Policies'}
      subtitle="Explore publication rules, review workflow, and author responsibilities designed for a robust scholarly process."
      content={content}
      loading={loading}
      actions={(
        <div className="flex flex-wrap gap-4">
          <Link to="/publication-ethics" className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-400 hover:text-indigo-600">
            Publication Ethics
          </Link>
          <Link to="/author-guidelines" className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-400 hover:text-indigo-600">
            Author Guidelines
          </Link>
          <Link to="/licensing" className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-400 hover:text-indigo-600">
            Licensing Terms
          </Link>
        </div>
      )}
    />
  );
};

export default PoliciesPage;
