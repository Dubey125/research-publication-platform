import { motion } from 'framer-motion';
import SEO from './SEO';
import LoadingSpinner from './LoadingSpinner';
import PolicyContentView from './PolicyContentView';

const PolicyPageShell = ({ seoTitle, seoDescription, title, subtitle, content, loading, actions }) => (
  <section className="relative overflow-hidden py-16">
    <SEO title={seoTitle} description={seoDescription} />

    <div className="container-width">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card md:p-10"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-indigo-600">Policies Section</p>
        <h1 className="font-display mt-3 text-3xl font-bold text-slate-900 md:text-5xl">{title}</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">{subtitle}</p>

        {actions ? <div className="mt-6">{actions}</div> : null}

        <div className="mt-8">
          {loading ? <LoadingSpinner /> : <PolicyContentView body={content?.body} />}
        </div>
      </motion.div>
    </div>
  </section>
);

export default PolicyPageShell;
