import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { BookCheck, Globe2, Zap, Shield, ArrowRight, FileText } from 'lucide-react';
import SEO from '../components/SEO';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../utils/api';
import { SITE_NAME, TAGLINE, JOURNAL_HIGHLIGHTS } from '../utils/constants';

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.55, ease: 'easeOut' }
};

const snapshotItems = [
  {
    label: 'Review Model',
    value: 'Double-blind',
    icon: BookCheck,
    cardBg: 'bg-indigo-50/50',
    cardBorder: 'border-indigo-100',
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600'
  },
  {
    label: 'Open Access',
    value: '100% Online',
    icon: Globe2,
    cardBg: 'bg-emerald-50/50',
    cardBorder: 'border-emerald-100',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600'
  },
  {
    label: 'Editorial Cycle',
    value: '2–3 Weeks',
    icon: Zap,
    cardBg: 'bg-amber-50/50',
    cardBorder: 'border-amber-100',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600'
  },
  {
    label: 'Ethics Screen',
    value: '15% Limit',
    icon: Shield,
    cardBg: 'bg-rose-50/50',
    cardBorder: 'border-rose-100',
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-600'
  }
];

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [latestPapers, setLatestPapers] = useState([]);
  const [currentIssue, setCurrentIssue] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get('/public/home');
        setLatestPapers(data.latestPapers || []);
        setCurrentIssue(data.currentIssue || null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <SEO
        title="IJAIF | Home"
        description="International Journal of Advanced Interdisciplinary Frontiers publishes peer-reviewed, open-access interdisciplinary research."
      />

      {/* ─── HERO ─────────────────────────────────────────────────────── */}
      <section className="hero-grid relative overflow-hidden py-24 text-slate-900">
        <div className="container-width grid items-center gap-12 lg:grid-cols-[1.25fr_0.75fr]">
          {/* Left: headline */}
          <motion.div {...fadeInUp}>
            <span className="inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-indigo-700">
              Peer-Reviewed · Open Access
            </span>
            <h1 className="font-display mt-6 max-w-3xl text-5xl font-extrabold leading-[1.1] text-slate-900 lg:text-7xl">
              Publish Your{' '}
              <span className="text-indigo-600">Advanced Interdisciplinary</span>{' '}
              Research
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-500">{TAGLINE}</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                to="/submit-manuscript"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
              >
                Submit Manuscript <ArrowRight size={16} />
              </Link>
              <Link
                to="/current-issue"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-7 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-600"
              >
                View Current Issue
              </Link>
            </div>
          </motion.div>

          {/* Right: snapshot panel */}
          <motion.div
            {...fadeInUp}
            transition={{ duration: 0.6, delay: 0.14, ease: 'easeOut' }}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60"
          >
            <h2 className="font-display text-xl font-bold text-slate-900">Publication Snapshot</h2>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {snapshotItems.map((item) => {
                const Icon = item.icon;
                return (
                  <article
                    key={item.label}
                    className={`group rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:shadow-md ${item.cardBg} ${item.cardBorder}`}
                  >
                    <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${item.iconBg} transition group-hover:scale-110`}>
                      <Icon size={18} className={item.iconColor} />
                    </div>
                    <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
                    <p className="mt-0.5 text-base font-bold text-slate-900">{item.value}</p>
                  </article>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── ABOUT + FEATURED ARTICLES ────────────────────────────────── */}
      <section className="container-width py-16">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* About IJAIF (1/3) */}
          <motion.div {...fadeInUp} className="lg:col-span-1">
            <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-card">
              <img
                src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80"
                alt="Library representing academic research"
                className="h-48 w-full object-cover"
              />
              <div className="p-6">
                <h2 className="font-display text-2xl font-bold text-slate-900">About IJAIF</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  IJAIF is a peer-reviewed, open-access international journal dedicated to publishing
                  high-quality research across diverse academic disciplines. We connect the frontiers of
                  knowledge through rigorous double-blind review and ethical publishing standards.
                </p>
                <div className="mt-5 space-y-3">
                  {JOURNAL_HIGHLIGHTS.map((item) => (
                    <div key={item.title} className="flex items-start gap-3">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                        <p className="text-xs leading-5 text-slate-500">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  to="/aims-scope"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  Learn more <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Featured Articles (2/3) */}
          <motion.div {...fadeInUp} transition={{ duration: 0.55, delay: 0.1, ease: 'easeOut' }} className="lg:col-span-2">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="font-display text-2xl font-bold text-slate-900">
                Featured Research{' '}
                <span className="font-display italic text-indigo-600 underline decoration-indigo-300 underline-offset-4">
                  &amp; Articles
                </span>
              </h2>
              <Link
                to="/archives"
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600"
              >
                Browse all <ArrowRight size={13} />
              </Link>
            </div>

            {currentIssue && (
              <p className="mb-4 text-xs font-medium text-slate-400">
                Vol. {currentIssue.volume}, Issue {currentIssue.issueNumber} ({currentIssue.year})
              </p>
            )}

            {loading ? (
              <LoadingSpinner />
            ) : latestPapers.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-14 text-center">
                <FileText size={32} className="mb-3 text-slate-300" />
                <p className="text-sm font-medium text-slate-400">No papers published yet.</p>
                <p className="mt-1 text-xs text-slate-400">Published papers will appear here once available.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {latestPapers.slice(0, 4).map((paper) => (
                  <article
                    key={paper._id}
                    className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    {/* Dark thumbnail */}
                    <div className="flex h-28 items-center justify-center bg-indigo-900 px-5">
                      <p className="line-clamp-3 text-center text-sm font-semibold leading-6 text-indigo-100">
                        {paper.title}
                      </p>
                    </div>
                    <div className="p-4">
                      {paper.category && (
                        <span className="inline-flex rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                          {paper.category}
                        </span>
                      )}
                      <h3 className="mt-2 line-clamp-2 text-sm font-bold leading-snug text-slate-900 group-hover:text-indigo-700 transition">
                        {paper.title}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">{paper.authors?.join(', ')}</p>
                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-600">{paper.abstract}</p>
                      <a
                        href={`${import.meta.env.VITE_FILE_BASE_URL || 'http://localhost:5000'}${paper.pdfUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                      >
                        Download PDF <ArrowRight size={11} />
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ─── CALL FOR PAPERS / CTA ────────────────────────────────────── */}
      <section className="mt-8 bg-slate-900 py-16">
        <div className="container-width text-center">
          <motion.div {...fadeInUp}>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-400">Open for Submissions</p>
            <h2 className="font-display mt-3 text-3xl font-bold italic text-white lg:text-4xl">
              Call for Papers
            </h2>
            <p className="mt-4 mx-auto max-w-xl text-sm leading-7 text-slate-400">
              We invite original and unpublished manuscripts from researchers, academicians, and
              professionals worldwide. Submit your work for the upcoming issue.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                to="/submit-manuscript"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-900/50 transition hover:bg-indigo-500"
              >
                SUBMIT NOW <ArrowRight size={16} />
              </Link>
              <Link
                to="/author-guidelines"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-600 px-8 py-3.5 text-sm font-semibold text-slate-300 transition hover:border-slate-400 hover:text-white"
              >
                Author Guidelines
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default HomePage;

