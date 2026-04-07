import { useEffect, useState } from 'react';
import SEO from '../components/SEO';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../utils/api';

const CurrentIssuePage = () => {
  const [loading, setLoading] = useState(true);
  const [issue, setIssue] = useState(null);
  const [papers, setPapers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCurrent = async () => {
      try {
        const { data } = await api.get('/public/current-issue');
        setIssue(data.issue);
        setPapers(data.papers || []);
      } catch (err) {
        setError(err?.response?.data?.message || 'Unable to load current issue');
      } finally {
        setLoading(false);
      }
    };
    fetchCurrent();
  }, []);

  return (
    <section className="container-width py-14">
      <SEO title="Current Issue | International Journal of Transdisciplinary Science and Engineering" description="Current issue and published papers" />
      <div className="panel">
        <h1 className="section-title">Current Issue</h1>
        <p className="section-subtitle">Explore the latest peer-reviewed publications from the current volume.</p>
        {issue ? (
          <p className="mt-4 inline-flex rounded-full border border-primary-200 bg-primary-50 px-4 py-1 text-sm font-semibold text-primary-800">
            Volume {issue.volume}, Issue {issue.issueNumber} ({issue.year})
          </p>
        ) : null}
      </div>
      {loading ? <LoadingSpinner /> : null}
      {error ? <p className="mt-5 rounded-md bg-red-50 p-3 text-red-700">{error}</p> : null}

      <div className="mt-8 grid gap-5">
        {papers.map((paper) => (
          <article className="card transition duration-300 hover:-translate-y-1 hover:border-primary-200" key={paper._id}>
            <p className="inline-flex rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">
              {paper.category}
            </p>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{paper.title}</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{paper.authors.join(', ')}</p>
            <p className="mt-3 text-sm leading-7 text-slate-700">{paper.abstract}</p>
            <a href={`${import.meta.env.VITE_FILE_BASE_URL || 'http://localhost:5000'}${paper.pdfUrl}`} className="mt-4 inline-flex rounded-md bg-primary-50 px-3 py-2 text-sm font-semibold text-primary-800 hover:bg-primary-100" target="_blank" rel="noreferrer">
              Download PDF
            </a>
          </article>
        ))}
      </div>
    </section>
  );
};

export default CurrentIssuePage;
