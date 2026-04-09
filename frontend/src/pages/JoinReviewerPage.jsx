import { useState } from 'react';
import SEO from '../components/SEO';
import api from '../utils/api';

const fieldClass = 'w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/50 px-4 py-3 text-sm focus:border-indigo-400 dark:focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 transition-colors';

const JoinReviewerPage = () => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    affiliation: '',
    designation: '',
    expertiseAreas: '',
    experienceSummary: '',
    motivation: '',
    declarationAccepted: false,
    honeypot: ''
  });
  const [status, setStatus] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: '', text: '' });
    setLoading(true);

    try {
      await api.post('/reviewers', form);
      setStatus({ type: 'success', text: 'Thank you. Your reviewer application has been submitted.' });
      setForm({
        fullName: '',
        email: '',
        affiliation: '',
        designation: '',
        expertiseAreas: '',
        experienceSummary: '',
        motivation: '',
        declarationAccepted: false,
        honeypot: ''
      });
    } catch (error) {
      setStatus({ type: 'error', text: error?.response?.data?.message || 'Could not submit application. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container-width py-14">
      <SEO
        title="Join as Reviewer | International Journal of Transdisciplinary Science and Engineering"
        description="Apply to join IJTSE reviewer panel and contribute to rigorous peer review."
      />

      <div className="mx-auto max-w-4xl card !p-8 md:!p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-600 dark:text-indigo-400">Reviewer Panel</p>
        <h1 className="mt-3 text-3xl font-bold text-primary-800 dark:text-indigo-400">Join as a Reviewer</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
          We invite experienced researchers and academicians to join our reviewer network. Please complete the application below.
        </p>

        <form className="mt-8 space-y-5" onSubmit={onSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Full Name <span className="text-red-600">*</span>
              <input className={`${fieldClass} mt-2`} value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
            </label>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Email Address <span className="text-red-600">*</span>
              <input className={`${fieldClass} mt-2`} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Affiliation / Institution <span className="text-red-600">*</span>
              <input className={`${fieldClass} mt-2`} value={form.affiliation} onChange={(e) => setForm({ ...form, affiliation: e.target.value })} required />
            </label>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Current Designation <span className="text-red-600">*</span>
              <input className={`${fieldClass} mt-2`} value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} required />
            </label>
          </div>

          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Expertise Areas (comma-separated) <span className="text-red-600">*</span>
            <input className={`${fieldClass} mt-2`} placeholder="Example: Machine Learning, Cyber Security, IoT" value={form.expertiseAreas} onChange={(e) => setForm({ ...form, expertiseAreas: e.target.value })} required />
          </label>

          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Review Experience Summary <span className="text-red-600">*</span>
            <textarea className={`${fieldClass} mt-2`} rows={5} value={form.experienceSummary} onChange={(e) => setForm({ ...form, experienceSummary: e.target.value })} required />
          </label>

          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Why do you want to join as reviewer? <span className="text-red-600">*</span>
            <textarea className={`${fieldClass} mt-2`} rows={5} value={form.motivation} onChange={(e) => setForm({ ...form, motivation: e.target.value })} required />
          </label>

          <label className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 dark:border-slate-600 dark:bg-slate-900"
              checked={form.declarationAccepted}
              onChange={(e) => setForm({ ...form, declarationAccepted: e.target.checked })}
              required
            />
            <span>
              I confirm the information provided is accurate and I agree to maintain confidentiality and ethical review standards. <span className="text-red-600">*</span>
            </span>
          </label>

          <input className="hidden" tabIndex={-1} autoComplete="off" value={form.honeypot} onChange={(e) => setForm({ ...form, honeypot: e.target.value })} />

          {status.text ? (
            <p className={`rounded-lg px-4 py-3 text-sm font-medium ${
              status.type === 'success'
                ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400'
            }`}>{status.text}</p>
          ) : null}

          <button className="btn-primary px-8 py-3" disabled={loading} type="submit">
            {loading ? 'Submitting Application...' : 'Submit Reviewer Application'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default JoinReviewerPage;
