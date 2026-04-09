import { useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import SEO from '../components/SEO';
import api from '../utils/api';

const MAX_MANUSCRIPT_SIZE_BYTES = 20 * 1024 * 1024;
const RECAPTCHA_SITE_KEY = (import.meta.env.VITE_RECAPTCHA_SITE_KEY || '').trim();

const SubmitManuscriptPage = () => {
  const [form, setForm] = useState({
    authorName: '',
    email: '',
    affiliation: '',
    paperTitle: '',
    abstract: '',
    keywords: '',
    declarationAccepted: false,
    recaptchaToken: '',
    honeypot: ''
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', text: '' });
  const recaptchaRef = useRef(null);
  const isRecaptchaConfigured = Boolean(RECAPTCHA_SITE_KEY);

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', text: '' });
    if (!file) {
      setStatus({ type: 'error', text: 'Please upload your manuscript file (PDF, DOC, or DOCX).' });
      return;
    }

    const acceptedTypes = new Set([
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]);
    const extension = (file.name.split('.').pop() || '').toLowerCase();
    const acceptedExtensions = new Set(['pdf', 'doc', 'docx']);

    if (!acceptedTypes.has(file.type) || !acceptedExtensions.has(extension)) {
      setStatus({ type: 'error', text: 'Only PDF, DOC, or DOCX files are allowed.' });
      return;
    }

    if (file.size > MAX_MANUSCRIPT_SIZE_BYTES) {
      setStatus({ type: 'error', text: 'File size must be less than or equal to 20 MB.' });
      return;
    }

    if (!isRecaptchaConfigured) {
      setStatus({ type: 'error', text: 'Robot verification is not configured. Please contact the administrator.' });
      return;
    }

    if (!form.recaptchaToken) {
      setStatus({ type: 'error', text: 'Please complete the robot verification.' });
      return;
    }

    setLoading(true);
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => payload.append(key, value));
      payload.append('manuscript', file);
      await api.post('/submissions', payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setStatus({ type: 'success', text: 'Submission received successfully.' });
      setForm({
        authorName: '',
        email: '',
        affiliation: '',
        paperTitle: '',
        abstract: '',
        keywords: '',
        declarationAccepted: false,
        recaptchaToken: '',
        honeypot: ''
      });
      setFile(null);
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
    } catch (error) {
      setStatus({ type: 'error', text: error?.response?.data?.message || 'Submission failed.' });
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
      setForm((prev) => ({ ...prev, recaptchaToken: '' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container-width py-14">
      <SEO title="Submit Paper | International Journal of Transdisciplinary Science and Engineering" description="Submit your research paper" />
      <div className="mx-auto max-w-3xl card !p-8 md:!p-10">
        <h1 className="text-3xl font-bold text-primary-800 dark:text-indigo-400">Submit Paper</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Ensure your manuscript adheres to our guidelines before uploading.</p>
        <form className="mt-8 space-y-5" onSubmit={onSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Author Name <span className="text-red-600">*</span>
              <input className="mt-2 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/50 px-4 py-3 text-sm focus:border-indigo-400 dark:focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 transition-colors" placeholder="Enter author name" value={form.authorName} onChange={(e) => setForm({ ...form, authorName: e.target.value })} required />
            </label>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Email Address <span className="text-red-600">*</span>
              <input className="mt-2 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/50 px-4 py-3 text-sm focus:border-indigo-400 dark:focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 transition-colors" type="email" placeholder="Enter email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </label>
          </div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Affiliation/University <span className="text-red-600">*</span>
            <input className="mt-2 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/50 px-4 py-3 text-sm focus:border-indigo-400 dark:focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 transition-colors" placeholder="Enter affiliation or university" value={form.affiliation} onChange={(e) => setForm({ ...form, affiliation: e.target.value })} required />
          </label>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Paper Title <span className="text-red-600">*</span>
            <input className="mt-2 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/50 px-4 py-3 text-sm focus:border-indigo-400 dark:focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 transition-colors" placeholder="Enter paper title" value={form.paperTitle} onChange={(e) => setForm({ ...form, paperTitle: e.target.value })} required />
          </label>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Abstract <span className="text-red-600">*</span>
            <textarea className="mt-2 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/50 px-4 py-3 text-sm focus:border-indigo-400 dark:focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 transition-colors" rows={6} placeholder="Enter abstract" value={form.abstract} onChange={(e) => setForm({ ...form, abstract: e.target.value })} required />
          </label>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Keywords (comma-separated) <span className="text-red-600">*</span>
            <input className="mt-2 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/50 px-4 py-3 text-sm focus:border-indigo-400 dark:focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 transition-colors" placeholder="Example: AI, Machine Learning, Security" value={form.keywords} onChange={(e) => setForm({ ...form, keywords: e.target.value })} required />
          </label>
          <div className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30 px-4 py-4">
             <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Upload Manuscript (PDF/DOC/DOCX) <span className="text-red-600">*</span></label>
             <input className="w-full text-sm text-slate-600 dark:text-slate-400 file:mr-4 file:rounded-xl file:border file:border-slate-300 dark:file:border-slate-600 file:bg-white dark:file:bg-slate-800 dark:file:text-white file:px-4 file:py-2 file:text-sm file:font-semibold hover:file:bg-slate-50 dark:hover:file:bg-slate-700 cursor-pointer transition-colors" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(e) => setFile(e.target.files?.[0] || null)} required />
             <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Allowed formats: PDF, DOC, DOCX. Maximum size: 20 MB.</p>
          </div>
          <label className="flex items-start gap-3 mt-4 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
            <input type="checkbox" className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 dark:border-slate-600 dark:bg-slate-900 dark:ring-offset-slate-900" checked={form.declarationAccepted} onChange={(e) => setForm({ ...form, declarationAccepted: e.target.checked })} required />
            <span>I confirm this manuscript is original, not under review elsewhere, and complies with internal policies. <span className="text-red-600">*</span></span>
          </label>
          <div className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30 px-4 py-4">
            <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">Robot Verification <span className="text-red-600">*</span></p>
            {isRecaptchaConfigured ? (
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={RECAPTCHA_SITE_KEY}
                onChange={(token) => setForm((prev) => ({ ...prev, recaptchaToken: token || '' }))}
                onExpired={() => setForm((prev) => ({ ...prev, recaptchaToken: '' }))}
                onErrored={() => {
                  setForm((prev) => ({ ...prev, recaptchaToken: '' }));
                  setStatus({ type: 'error', text: 'Robot verification failed. Please retry.' });
                }}
              />
            ) : (
              <p className="text-sm text-red-600 dark:text-red-400">Robot verification is not configured. Please contact the administrator.</p>
            )}
          </div>
          <input className="hidden" tabIndex={-1} autoComplete="off" value={form.honeypot} onChange={(e) => setForm({ ...form, honeypot: e.target.value })} />
          
          {status.text ? (
            <p className={`rounded-lg px-4 py-3 text-sm font-medium ${
              status.type === 'success' 
                ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400'
            }`}>{status.text}</p>
          ) : null}
          
          <button className="btn-primary w-full md:w-auto px-8 py-3" disabled={loading || !isRecaptchaConfigured} type="submit">{loading ? 'Securely Submitting...' : 'Submit Manuscript'}</button>
        </form>
      </div>
    </section>
  );
};

export default SubmitManuscriptPage;
