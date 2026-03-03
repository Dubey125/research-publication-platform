import { useEffect, useState } from 'react';
import SEO from '../components/SEO';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../utils/api';

const ArchivesPage = () => {
  const [loading, setLoading] = useState(true);
  const [papers, setPapers] = useState([]);
  const [filters, setFilters] = useState({ years: [], volumes: [], issueNumbers: [] });
  const [query, setQuery] = useState({ year: '', volume: '', issueNumber: '', search: '', page: 1 });
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  const fetchArchive = async (params = query) => {
    setLoading(true);
    try {
      const { data } = await api.get('/public/archives', { params });
      setPapers(data.papers || []);
      setFilters(data.filters || { years: [], volumes: [], issueNumbers: [] });
      setPagination(data.pagination || { page: 1, totalPages: 1 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArchive();
  }, []);

  const updateQuery = (name, value) => {
    const next = { ...query, [name]: value, page: 1 };
    setQuery(next);
    fetchArchive(next);
  };

  return (
    <section className="container-width py-14">
      <SEO title="Archives | IJAIF" description="Browse archived issues and papers" />
      <div className="panel">
        <h1 className="section-title">Archives</h1>
        <p className="section-subtitle">Search and filter previous volumes, issues, and published manuscripts.</p>
      </div>

      <div className="mt-6 grid gap-4 rounded-2xl border border-primary-100 bg-white p-4 shadow-card md:grid-cols-4">
        <select className="rounded-lg border border-slate-300 px-3 py-2" value={query.year} onChange={(e) => updateQuery('year', e.target.value)}>
          <option value="">All Years</option>
          {filters.years.map((year) => <option key={year} value={year}>{year}</option>)}
        </select>
        <select className="rounded-lg border border-slate-300 px-3 py-2" value={query.volume} onChange={(e) => updateQuery('volume', e.target.value)}>
          <option value="">All Volumes</option>
          {filters.volumes.map((volume) => <option key={volume} value={volume}>{volume}</option>)}
        </select>
        <select className="rounded-lg border border-slate-300 px-3 py-2" value={query.issueNumber} onChange={(e) => updateQuery('issueNumber', e.target.value)}>
          <option value="">All Issues</option>
          {filters.issueNumbers.map((issue) => <option key={issue} value={issue}>{issue}</option>)}
        </select>
        <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Search papers" value={query.search} onChange={(e) => updateQuery('search', e.target.value)} />
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="mt-8 grid gap-5">
          {papers.map((paper) => (
            <article className="card transition duration-300 hover:-translate-y-1 hover:border-primary-200" key={paper._id}>
              <p className="inline-flex rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">Archive Record</p>
              <h2 className="mt-3 text-xl font-semibold text-slate-900">{paper.title}</h2>
              <p className="mt-1 text-sm text-slate-600">Vol. {paper.issue?.volume} | Issue {paper.issue?.issueNumber} | {paper.issue?.year}</p>
              <p className="mt-3 text-sm leading-7 text-slate-700 line-clamp-3">{paper.abstract}</p>
              <a href={`${import.meta.env.VITE_FILE_BASE_URL || 'http://localhost:5000'}${paper.pdfUrl}`} className="mt-4 inline-flex rounded-md bg-primary-50 px-3 py-2 text-sm font-semibold text-primary-800 hover:bg-primary-100" target="_blank" rel="noreferrer">Download PDF</a>
            </article>
          ))}
        </div>
      )}

      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          className="btn-secondary disabled:cursor-not-allowed disabled:opacity-50"
          disabled={pagination.page <= 1}
          onClick={() => {
            const next = { ...query, page: query.page - 1 };
            setQuery(next);
            fetchArchive(next);
          }}
        >
          Previous
        </button>
        <span className="text-sm text-slate-600">Page {pagination.page} of {pagination.totalPages || 1}</span>
        <button
          className="btn-secondary disabled:cursor-not-allowed disabled:opacity-50"
          disabled={pagination.page >= (pagination.totalPages || 1)}
          onClick={() => {
            const next = { ...query, page: query.page + 1 };
            setQuery(next);
            fetchArchive(next);
          }}
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default ArchivesPage;
