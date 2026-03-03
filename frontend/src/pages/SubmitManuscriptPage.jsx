import { useState } from 'react';
import SEO from '../components/SEO';
import api from '../utils/api';

const SubmitManuscriptPage = () => {
  const [form, setForm] = useState({
    authorName: '',
    email: '',
    affiliation: '',
    paperTitle: '',
    abstract: '',
    keywords: '',
    declarationAccepted: false,
    honeypot: ''
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', text: '' });

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', text: '' });
    if (!file) {
      setStatus({ type: 'error', text: 'Please upload a PDF manuscript.' });
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
      setForm({ authorName: '', email: '', affiliation: '', paperTitle: '', abstract: '', keywords: '', declarationAccepted: false, honeypot: '' });
      setFile(null);
    } catch (error) {
      setStatus({ type: 'error', text: error?.response?.data?.message || 'Submission failed.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container-width py-14">
      <SEO title="Submit Manuscript | IJAIF" description="Submit your research manuscript to IJAIF" />
      <div className="mx-auto max-w-3xl card">
        <h1 className="text-3xl font-bold text-primary-800">Submit Manuscript</h1>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <input className="w-full rounded-md border border-slate-300 px-3 py-2" placeholder="Author Name" value={form.authorName} onChange={(e) => setForm({ ...form, authorName: e.target.value })} required />
          <input className="w-full rounded-md border border-slate-300 px-3 py-2" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className="w-full rounded-md border border-slate-300 px-3 py-2" placeholder="Affiliation" value={form.affiliation} onChange={(e) => setForm({ ...form, affiliation: e.target.value })} required />
          <input className="w-full rounded-md border border-slate-300 px-3 py-2" placeholder="Paper Title" value={form.paperTitle} onChange={(e) => setForm({ ...form, paperTitle: e.target.value })} required />
          <textarea className="w-full rounded-md border border-slate-300 px-3 py-2" rows={5} placeholder="Abstract" value={form.abstract} onChange={(e) => setForm({ ...form, abstract: e.target.value })} required />
          <input className="w-full rounded-md border border-slate-300 px-3 py-2" placeholder="Keywords (comma-separated)" value={form.keywords} onChange={(e) => setForm({ ...form, keywords: e.target.value })} />
          <input className="w-full rounded-md border border-slate-300 px-3 py-2" type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} required />
          <label className="flex items-start gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={form.declarationAccepted} onChange={(e) => setForm({ ...form, declarationAccepted: e.target.checked })} required />
            I confirm this manuscript is original and not under review elsewhere.
          </label>
          <input className="hidden" tabIndex={-1} autoComplete="off" value={form.honeypot} onChange={(e) => setForm({ ...form, honeypot: e.target.value })} />
          {status.text ? <p className={`text-sm ${status.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>{status.text}</p> : null}
          <button className="btn-primary" disabled={loading} type="submit">{loading ? 'Submitting...' : 'Submit'}</button>
        </form>
      </div>
    </section>
  );
};

export default SubmitManuscriptPage;
