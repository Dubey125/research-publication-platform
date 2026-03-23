import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, FileText, Users, Inbox,
  Settings, LogOut, ChevronDown, ChevronUp, Edit2, Trash2,
  Check, X, Download, Eye, Star, RefreshCw, Filter,
  PlusCircle, Save, AlertTriangle, Globe, Phone, MapPin, Link2, Bell, FilePenLine
} from 'lucide-react';
import SEO from '../../components/SEO';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { CATEGORIES } from '../../utils/constants';

/* helpers */
const FILE_BASE = import.meta.env.VITE_FILE_BASE_URL || 'http://localhost:5000';
const STATUS_STYLES = {
  Pending:       'bg-amber-100 text-amber-700',
  'Under Review':'bg-blue-100 text-blue-700',
  Accepted:      'bg-green-100 text-green-700',
  Rejected:      'bg-red-100 text-red-700'
};
const inp = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100';
const navLinks = [
  { id: 'sec-stats',       label: 'Overview',        icon: LayoutDashboard },
  { id: 'sec-issues',      label: 'Issues',          icon: BookOpen },
  { id: 'sec-papers',      label: 'Papers',          icon: FileText },
  { id: 'sec-editorial',   label: 'Editorial Board', icon: Users },
  { id: 'sec-submissions', label: 'Submissions',     icon: Inbox },
  { id: 'sec-content',     label: 'Website Content', icon: FilePenLine },
  { id: 'sec-announcements', label: 'Announcements', icon: Bell },
  { id: 'sec-siteinfo',    label: 'Site Info',       icon: Globe },
  { id: 'sec-settings',    label: 'Settings',        icon: Settings }
];
const defaultIssue     = { volume: '', issueNumber: '', year: '', title: '', isCurrent: false };
const defaultPaper     = { title: '', authors: '', abstract: '', keywords: '', category: CATEGORIES[0], issue: '' };
const defaultEditorial = { name: '', role: 'Associate Editor', affiliation: '', bio: '', order: 0 };
const defaultSiteInfo  = {
  aboutTitle: '', aboutText: '', missionText: '', visionText: '',
  contactEmail: '', contactPhone: '', contactAddress: '', contactCity: '', contactCountry: '',
  socialFacebook: '', socialTwitter: '', socialLinkedIn: '', socialInstagram: '', socialYouTube: '', socialResearchGate: '',
  journalISSN: '', journalDOI: '', publisherName: ''
};
const contentTypeOptions = [
  { value: 'policies', label: 'Policies' },
  { value: 'copyright-form', label: 'Copyright Form' },
  { value: 'licensing', label: 'Licensing' },
  { value: 'publication-ethics', label: 'Publication Ethics' },
  { value: 'author-guidelines', label: 'Author Guidelines' },
  { value: 'peer-review-policy', label: 'Peer Review Policy' }
];

function Confirm({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start gap-3">
          <AlertTriangle size={22} className="mt-0.5 shrink-0 text-red-500" />
          <p className="text-sm text-slate-700">{message}</p>
        </div>
        <div className="mt-5 flex justify-end gap-3">
          <button onClick={onCancel} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
          <button onClick={onConfirm} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">Delete</button>
        </div>
      </div>
    </div>
  );
}

function Toast({ msg, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, []);
  if (!msg.text) return null;
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex max-w-sm items-start gap-3 rounded-2xl border px-5 py-4 shadow-xl ${msg.type === 'success' ? 'border-green-200 bg-green-50 text-green-800' : 'border-red-200 bg-red-50 text-red-800'}`}>
      {msg.type === 'success' ? <Check size={18} className="mt-0.5 shrink-0" /> : <X size={18} className="mt-0.5 shrink-0" />}
      <p className="text-sm font-medium">{msg.text}</p>
    </div>
  );
}

function exportCSV(submissions) {
  const headers = ['Title', 'Author', 'Email', 'Affiliation', 'Status', 'Keywords', 'Submitted'];
  const rows = submissions.map((s) => [
    `"${s.paperTitle}"`, `"${s.authorName}"`, s.email, `"${s.affiliation}"`,
    s.status, `"${(s.keywords || []).join('; ')}"`,
    new Date(s.createdAt).toLocaleDateString()
  ]);
  const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'submissions.csv'; a.click();
  URL.revokeObjectURL(url);
}

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [stats,       setStats]       = useState({ totalPapers: 0, totalIssues: 0, totalSubmissions: 0, pendingSubmissions: 0, underReviewSubmissions: 0, acceptedSubmissions: 0, rejectedSubmissions: 0 });
  const [issues,      setIssues]      = useState([]);
  const [papers,      setPapers]      = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [editorial,   setEditorial]   = useState([]);

  const [issueForm,      setIssueForm]      = useState(defaultIssue);
  const [paperForm,      setPaperForm]      = useState(defaultPaper);
  const [editorialForm,  setEditorialForm]  = useState(defaultEditorial);
  const [paperFile,      setPaperFile]      = useState(null);
  const [editorialPhoto, setEditorialPhoto] = useState(null);

  const [editingIssueId,     setEditingIssueId]     = useState('');
  const [editingPaperId,     setEditingPaperId]     = useState('');
  const [editingEditorialId, setEditingEditorialId] = useState('');

  const [subFilter,   setSubFilter]   = useState('All');
  const [expandedSub, setExpandedSub] = useState('');
  const [subNotes,    setSubNotes]    = useState({});

  const [profileForm, setProfileForm] = useState({ name: '', email: '' });
  const [pwForm,      setPwForm]      = useState({ currentPassword: '', newPassword: '', confirmNew: '' });
  const [siteForm,    setSiteForm]    = useState(defaultSiteInfo);
  const [contentType, setContentType] = useState('policies');
  const [contentForm, setContentForm] = useState({ title: '', body: '' });
  const [announcements, setAnnouncements] = useState([]);
  const [announcementForm, setAnnouncementForm] = useState({ title: '', message: '', isActive: true });

  const [activeSection, setActiveSection] = useState('sec-stats');
  const [confirm,       setConfirm]       = useState(null);
  const [toast,         setToast]         = useState({ type: '', text: '' });
  const [loading,       setLoading]       = useState(true);

  const showToast = (type, text) => setToast({ type, text });

  const loadContentByType = async (type) => {
    try {
      const { data } = await api.get(`/content/${type}`);
      setContentForm({
        title: data.content?.title || '',
        body: data.content?.body || ''
      });
    } catch {
      showToast('error', 'Failed to load content.');
    }
  };

  const loadAll = async () => {
    setLoading(true);
    try {
      const [s, i, p, sub, ed, me, site, announce] = await Promise.all([
        api.get('/stats'),
        api.get('/issues'),
        api.get('/papers', { params: { limit: 200 } }),
        api.get('/submissions'),
        api.get('/editorial'),
        api.get('/auth/me'),
        api.get('/settings'),
        api.get('/announcements/admin')
      ]);
      setStats(s.data.stats || {});
      setIssues(i.data.issues || []);
      setPapers(p.data.papers || []);
      setSubmissions(sub.data.submissions || []);
      setEditorial(ed.data.members || []);
      setAnnouncements(announce.data.announcements || []);
      setProfileForm({ name: me.data.admin?.name || '', email: me.data.admin?.email || '' });
      if (site.data.settings) setSiteForm((prev) => ({ ...prev, ...site.data.settings }));
    } catch {
      navigate('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);
  useEffect(() => { loadContentByType(contentType); }, [contentType]);

  useEffect(() => {
    const els = navLinks.map((n) => document.getElementById(n.id)).filter(Boolean);
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (vis?.target?.id) setActiveSection(vis.target.id);
      },
      { rootMargin: '-80px 0px -55% 0px', threshold: [0.1, 0.5] }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [loading]);

  /* ISSUES */
  const handleIssueSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingIssueId) {
        await api.put(`/issues/${editingIssueId}`, issueForm);
        showToast('success', 'Issue updated.');
        setEditingIssueId('');
      } else {
        await api.post('/issues', issueForm);
        showToast('success', 'Issue created.');
      }
      setIssueForm(defaultIssue);
      loadAll();
    } catch (err) { showToast('error', err?.response?.data?.message || 'Failed.'); }
  };
  const startEditIssue = (issue) => {
    setEditingIssueId(issue._id);
    setIssueForm({ volume: issue.volume, issueNumber: issue.issueNumber, year: issue.year, title: issue.title || '', isCurrent: issue.isCurrent || false });
    document.getElementById('sec-issues')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const setCurrentIssue = async (id) => {
    try { await api.put(`/issues/${id}`, { isCurrent: true }); showToast('success', 'Current issue updated.'); loadAll(); }
    catch { showToast('error', 'Failed.'); }
  };
  const deleteIssue = (id) => setConfirm({
    message: 'Delete this issue? This cannot be undone.',
    onConfirm: async () => { await api.delete(`/issues/${id}`); setConfirm(null); loadAll(); }
  });

  /* PAPERS */
  const handlePaperSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.entries(paperForm).forEach(([k, v]) => fd.append(k, v));
      if (paperFile) fd.append('pdf', paperFile);
      if (editingPaperId) {
        await api.put(`/papers/${editingPaperId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        showToast('success', 'Paper updated.');
      } else {
        if (!paperFile) return showToast('error', 'PDF file is required.');
        await api.post('/papers', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        showToast('success', 'Paper uploaded.');
      }
      setPaperForm(defaultPaper); setPaperFile(null); setEditingPaperId(''); loadAll();
    } catch (err) { showToast('error', err?.response?.data?.message || 'Failed.'); }
  };
  const startEditPaper = (p) => {
    setEditingPaperId(p._id);
    setPaperForm({ title: p.title || '', authors: (p.authors || []).join(', '), abstract: p.abstract || '', keywords: (p.keywords || []).join(', '), category: p.category || CATEGORIES[0], issue: p.issue?._id || '' });
    setPaperFile(null);
    document.getElementById('sec-papers')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const deletePaper = (id) => setConfirm({
    message: 'Delete this paper? This cannot be undone.',
    onConfirm: async () => { await api.delete(`/papers/${id}`); setConfirm(null); if (editingPaperId === id) { setEditingPaperId(''); setPaperForm(defaultPaper); } loadAll(); }
  });

  /* EDITORIAL */
  const handleEditorialSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.entries(editorialForm).forEach(([k, v]) => fd.append(k, v));
      if (editorialPhoto) fd.append('photo', editorialPhoto);
      if (editingEditorialId) {
        await api.put(`/editorial/${editingEditorialId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        showToast('success', 'Member updated.'); setEditingEditorialId('');
      } else {
        await api.post('/editorial', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        showToast('success', 'Member added.');
      }
      setEditorialForm(defaultEditorial); setEditorialPhoto(null); loadAll();
    } catch (err) { showToast('error', err?.response?.data?.message || 'Failed.'); }
  };
  const startEditEditorial = (m) => {
    setEditingEditorialId(m._id);
    setEditorialForm({ name: m.name || '', role: m.role || 'Associate Editor', affiliation: m.affiliation || '', bio: m.bio || '', order: m.order || 0 });
    setEditorialPhoto(null);
    document.getElementById('sec-editorial')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const deleteEditorial = (id) => setConfirm({
    message: 'Remove this editorial member?',
    onConfirm: async () => { await api.delete(`/editorial/${id}`); setConfirm(null); loadAll(); }
  });

  /* SUBMISSIONS */
  const setStatus = async (id, status) => {
    const notes = subNotes[id] || '';
    try { await api.patch(`/submissions/${id}/status`, { status, adminNotes: notes }); showToast('success', `Marked as ${status}.`); loadAll(); }
    catch { showToast('error', 'Failed.'); }
  };
  const deleteSubmission = (id) => setConfirm({
    message: 'Delete this submission permanently?',
    onConfirm: async () => { await api.delete(`/submissions/${id}`); setConfirm(null); loadAll(); }
  });
  const filteredSubs = subFilter === 'All' ? submissions : submissions.filter((s) => s.status === subFilter);

  /* WEBSITE CONTENT */
  const handleContentSave = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/content/${contentType}`, contentForm);
      showToast('success', 'Website content saved.');
      loadContentByType(contentType);
    } catch (err) {
      showToast('error', err?.response?.data?.message || 'Failed to save content.');
    }
  };

  /* ANNOUNCEMENTS */
  const handleAnnouncementCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/announcements', announcementForm);
      setAnnouncementForm({ title: '', message: '', isActive: true });
      showToast('success', 'Announcement created.');
      loadAll();
    } catch (err) {
      showToast('error', err?.response?.data?.message || 'Failed to create announcement.');
    }
  };

  const handleAnnouncementDelete = (id) => setConfirm({
    message: 'Delete this announcement?',
    onConfirm: async () => {
      await api.delete(`/announcements/${id}`);
      setConfirm(null);
      showToast('success', 'Announcement deleted.');
      loadAll();
    }
  });

  const handleAnnouncementToggle = async (notice) => {
    try {
      await api.patch(`/announcements/${notice._id}`, { isActive: !notice.isActive });
      showToast('success', `Announcement marked as ${!notice.isActive ? 'active' : 'inactive'}.`);
      loadAll();
    } catch {
      showToast('error', 'Failed to update announcement status.');
    }
  };

  /* SITE INFO */
  const handleSiteInfoSave = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put('/settings', siteForm);
      if (data.settings) setSiteForm((prev) => ({ ...prev, ...data.settings }));
      showToast('success', 'Site information saved.');
    } catch (err) { showToast('error', err?.response?.data?.message || 'Failed to save.'); }
  };

  /* SETTINGS */
  const handleProfileSave = async (e) => {
    e.preventDefault();
    try { await api.patch('/auth/profile', profileForm); showToast('success', 'Profile updated.'); }
    catch (err) { showToast('error', err?.response?.data?.message || 'Failed.'); }
  };
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmNew) return showToast('error', 'New passwords do not match.');
    try {
      await api.patch('/auth/change-password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      showToast('success', 'Password changed successfully.');
      setPwForm({ currentPassword: '', newPassword: '', confirmNew: '' });
    } catch (err) { showToast('error', err?.response?.data?.message || 'Failed.'); }
  };

  /* RENDER */
  return (
    <div className="min-h-screen">
      <SEO title="Admin Dashboard | International Journal of Transdisciplinary Science and Engineering" description="Manage International Journal of Transdisciplinary Science and Engineering journal content" />
      {confirm && <Confirm message={confirm.message} onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)} />}
      <Toast msg={toast} onClose={() => setToast({ type: '', text: '' })} />

      <div className="container-width flex gap-8 py-8">

        {/* Sidebar */}
        <aside className="hidden w-56 shrink-0 lg:block">
          <nav className="sticky top-24 space-y-1 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Dashboard</p>
            {navLinks.map(({ id, label, icon: Icon }) => (
              <a key={id} href={`#${id}`}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${activeSection === id ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-slate-600 hover:bg-slate-100'}`}>
                <Icon size={16} />{label}
              </a>
            ))}
            <div className="mt-2 border-t border-slate-100 pt-2">
              <button onClick={() => { logout(); navigate('/admin/login'); }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition">
                <LogOut size={16} /> Logout
              </button>
            </div>
          </nav>
        </aside>

        {/* Main */}
        <main className="min-w-0 flex-1 space-y-10">

          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">Editorial Workspace</p>
              <h1 className="mt-1 text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            </div>
            <button onClick={loadAll} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
              <RefreshCw size={15} /> Refresh
            </button>
          </div>

          {/* Mobile nav pills */}
          <div className="flex gap-2 overflow-x-auto rounded-xl border border-slate-200 bg-white p-2 lg:hidden">
            {navLinks.map(({ id, label }) => (
              <a key={id} href={`#${id}`} className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition ${activeSection === id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'}`}>{label}</a>
            ))}
          </div>

          {/* STATS */}
          <section id="sec-stats" className="scroll-mt-24">
            <h2 className="section-title mb-4">Overview</h2>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: 'Total Papers',       value: stats.totalPapers,            bg: 'bg-indigo-50',  text: 'text-indigo-700' },
                { label: 'Total Issues',        value: stats.totalIssues,            bg: 'bg-emerald-50', text: 'text-emerald-700' },
                { label: 'Total Submissions',   value: stats.totalSubmissions,       bg: 'bg-violet-50',  text: 'text-violet-700' },
                { label: 'Pending',             value: stats.pendingSubmissions,     bg: 'bg-amber-50',   text: 'text-amber-700' },
                { label: 'Under Review',        value: stats.underReviewSubmissions, bg: 'bg-blue-50',    text: 'text-blue-700' },
                { label: 'Accepted',            value: stats.acceptedSubmissions,    bg: 'bg-green-50',   text: 'text-green-700' },
                { label: 'Rejected',            value: stats.rejectedSubmissions,    bg: 'bg-red-50',     text: 'text-red-700' },
                { label: 'Editorial Members',   value: editorial.length,             bg: 'bg-rose-50',    text: 'text-rose-700' }
              ].map(({ label, value, text }) => (
                <div key={label} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                  <p className={`text-xs font-bold uppercase tracking-[0.14em] ${text}`}>{label}</p>
                  <p className="mt-3 text-3xl font-extrabold text-slate-900">{value ?? 0}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ISSUES */}
          <section id="sec-issues" className="scroll-mt-24">
            <h2 className="section-title mb-4">Journal Issues</h2>
            <div className="grid gap-6 lg:grid-cols-2">
              <form onSubmit={handleIssueSubmit} className="panel space-y-3">
                <p className="flex items-center gap-2 font-semibold text-slate-800"><PlusCircle size={17} className="text-indigo-500" />{editingIssueId ? 'Edit Issue' : 'Create New Issue'}</p>
                <div className="grid grid-cols-2 gap-3">
                  <input className={inp} placeholder="Volume" type="number" value={issueForm.volume} onChange={(e) => setIssueForm({ ...issueForm, volume: e.target.value })} required />
                  <input className={inp} placeholder="Issue No." type="number" value={issueForm.issueNumber} onChange={(e) => setIssueForm({ ...issueForm, issueNumber: e.target.value })} required />
                </div>
                <input className={inp} placeholder="Year e.g. 2026" type="number" value={issueForm.year} onChange={(e) => setIssueForm({ ...issueForm, year: e.target.value })} required />
                <input className={inp} placeholder="Issue title (optional)" value={issueForm.title} onChange={(e) => setIssueForm({ ...issueForm, title: e.target.value })} />
                <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                  <input type="checkbox" className="rounded" checked={issueForm.isCurrent} onChange={(e) => setIssueForm({ ...issueForm, isCurrent: e.target.checked })} />
                  Mark as Current Issue
                </label>
                <div className="flex gap-2">
                  <button className="btn-primary flex items-center gap-2" type="submit"><Save size={15} />{editingIssueId ? 'Update' : 'Create'}</button>
                  {editingIssueId && <button type="button" className="btn-secondary" onClick={() => { setEditingIssueId(''); setIssueForm(defaultIssue); }}>Cancel</button>}
                </div>
              </form>

              <div className="panel">
                <p className="mb-3 font-semibold text-slate-800">All Issues ({issues.length})</p>
                <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
                  {issues.length === 0 && <p className="text-sm text-slate-400">No issues yet.</p>}
                  {issues.map((issue) => (
                    <div key={issue._id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                      <div>
                        <span className="text-sm font-semibold text-slate-900">Vol.{issue.volume} Issue {issue.issueNumber} � {issue.year}</span>
                        {issue.title && <span className="ml-2 text-xs text-slate-500">{issue.title}</span>}
                        {issue.isCurrent && <span className="ml-2 inline-flex items-center gap-0.5 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700"><Star size={10} />Current</span>}
                      </div>
                      <div className="flex items-center gap-1.5">
                        {!issue.isCurrent && (
                          <button title="Set as current" onClick={() => setCurrentIssue(issue._id)} className="rounded-lg border border-green-200 bg-green-50 p-1.5 text-green-600 hover:bg-green-100 transition"><Star size={14} /></button>
                        )}
                        <button title="Edit" onClick={() => startEditIssue(issue)} className="rounded-lg border border-blue-200 bg-blue-50 p-1.5 text-blue-600 hover:bg-blue-100 transition"><Edit2 size={14} /></button>
                        <button title="Delete" onClick={() => deleteIssue(issue._id)} className="rounded-lg border border-red-200 bg-red-50 p-1.5 text-red-600 hover:bg-red-100 transition"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* PAPERS */}
          <section id="sec-papers" className="scroll-mt-24">
            <h2 className="section-title mb-4">Research Papers</h2>
            <div className="grid gap-6 lg:grid-cols-2">
              <form onSubmit={handlePaperSubmit} className="panel space-y-3">
                <p className="flex items-center gap-2 font-semibold text-slate-800"><PlusCircle size={17} className="text-indigo-500" />{editingPaperId ? 'Edit Paper' : 'Upload Research Paper'}</p>
                <input className={inp} placeholder="Paper title" value={paperForm.title} onChange={(e) => setPaperForm({ ...paperForm, title: e.target.value })} required />
                <input className={inp} placeholder="Authors (comma-separated)" value={paperForm.authors} onChange={(e) => setPaperForm({ ...paperForm, authors: e.target.value })} required />
                <textarea className={inp} rows={3} placeholder="Abstract" value={paperForm.abstract} onChange={(e) => setPaperForm({ ...paperForm, abstract: e.target.value })} required />
                <input className={inp} placeholder="Keywords (comma-separated)" value={paperForm.keywords} onChange={(e) => setPaperForm({ ...paperForm, keywords: e.target.value })} />
                <select className={inp} value={paperForm.category} onChange={(e) => setPaperForm({ ...paperForm, category: e.target.value })}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <select className={inp} value={paperForm.issue} onChange={(e) => setPaperForm({ ...paperForm, issue: e.target.value })} required>
                  <option value="">� Select Issue �</option>
                  {issues.map((i) => <option key={i._id} value={i._id}>Vol.{i.volume}, Issue {i.issueNumber} ({i.year})</option>)}
                </select>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-500">PDF File {editingPaperId && <span className="font-normal text-slate-400">(leave blank to keep existing)</span>}</label>
                  <input className={inp} type="file" accept="application/pdf" onChange={(e) => setPaperFile(e.target.files?.[0] || null)} required={!editingPaperId} />
                </div>
                <div className="flex gap-2">
                  <button className="btn-primary flex items-center gap-2" type="submit"><Save size={15} />{editingPaperId ? 'Update Paper' : 'Upload Paper'}</button>
                  {editingPaperId && <button type="button" className="btn-secondary" onClick={() => { setEditingPaperId(''); setPaperForm(defaultPaper); setPaperFile(null); }}>Cancel</button>}
                </div>
              </form>

              <div className="panel">
                <p className="mb-3 font-semibold text-slate-800">All Papers ({papers.length})</p>
                <div className="max-h-[500px] space-y-2 overflow-y-auto pr-1">
                  {papers.length === 0 && <p className="text-sm text-slate-400">No papers yet.</p>}
                  {papers.map((p) => (
                    <div key={p._id} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                      <p className="line-clamp-1 text-sm font-semibold text-slate-900">{p.title}</p>
                      <p className="mt-0.5 text-xs text-slate-500">{(p.authors || []).join(', ')}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700">{p.category}</span>
                        <a href={`${FILE_BASE}${p.pdfUrl}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-indigo-600 transition"><Eye size={12} /> PDF</a>
                        <button onClick={() => startEditPaper(p)} className="flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100 transition"><Edit2 size={12} /> Edit</button>
                        <button onClick={() => deletePaper(p._id)} className="flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-100 transition"><Trash2 size={12} /> Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* EDITORIAL BOARD */}
          <section id="sec-editorial" className="scroll-mt-24">
            <h2 className="section-title mb-4">Editorial Board</h2>
            <div className="grid gap-6 lg:grid-cols-2">
              <form onSubmit={handleEditorialSubmit} className="panel space-y-3">
                <p className="flex items-center gap-2 font-semibold text-slate-800"><PlusCircle size={17} className="text-indigo-500" />{editingEditorialId ? 'Edit Member' : 'Add Editorial Member'}</p>
                <input className={inp} placeholder="Full name" value={editorialForm.name} onChange={(e) => setEditorialForm({ ...editorialForm, name: e.target.value })} required />
                <select className={inp} value={editorialForm.role} onChange={(e) => setEditorialForm({ ...editorialForm, role: e.target.value })}>
                  <option>Editor-in-Chief</option>
                  <option>Associate Editor</option>
                  <option>Reviewer</option>
                </select>
                <input className={inp} placeholder="Institution / Affiliation" value={editorialForm.affiliation} onChange={(e) => setEditorialForm({ ...editorialForm, affiliation: e.target.value })} required />
                <textarea className={inp} rows={3} placeholder="Short bio (optional)" value={editorialForm.bio} onChange={(e) => setEditorialForm({ ...editorialForm, bio: e.target.value })} />
                <input className={inp} type="number" placeholder="Display order (0 = first)" value={editorialForm.order} onChange={(e) => setEditorialForm({ ...editorialForm, order: e.target.value })} />
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-500">Photo {editingEditorialId && <span className="font-normal text-slate-400">(leave blank to keep existing)</span>}</label>
                  <input className={inp} type="file" accept="image/*" onChange={(e) => setEditorialPhoto(e.target.files?.[0] || null)} />
                </div>
                <div className="flex gap-2">
                  <button className="btn-primary flex items-center gap-2" type="submit"><Save size={15} />{editingEditorialId ? 'Update' : 'Add Member'}</button>
                  {editingEditorialId && <button type="button" className="btn-secondary" onClick={() => { setEditingEditorialId(''); setEditorialForm(defaultEditorial); }}>Cancel</button>}
                </div>
              </form>

              <div className="panel">
                <p className="mb-3 font-semibold text-slate-800">Members ({editorial.length})</p>
                <div className="max-h-[500px] space-y-2 overflow-y-auto pr-1">
                  {editorial.length === 0 && <p className="text-sm text-slate-400">No members yet.</p>}
                  {editorial.map((m) => (
                    <div key={m._id} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                      {m.photoUrl
                        ? <img src={`${FILE_BASE}${m.photoUrl}`} alt={m.name} className="h-10 w-10 shrink-0 rounded-full object-cover" />
                        : <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">{m.name.charAt(0)}</div>
                      }
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-900">{m.name}</p>
                        <p className="text-xs text-slate-500">{m.role} � {m.affiliation}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <button onClick={() => startEditEditorial(m)} className="rounded-lg border border-blue-200 bg-blue-50 p-1.5 text-blue-600 hover:bg-blue-100 transition"><Edit2 size={14} /></button>
                        <button onClick={() => deleteEditorial(m._id)} className="rounded-lg border border-red-200 bg-red-50 p-1.5 text-red-600 hover:bg-red-100 transition"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* SUBMISSIONS */}
          <section id="sec-submissions" className="scroll-mt-24">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="section-title">Manuscript Submissions</h2>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <Filter size={14} className="text-slate-400" />
                  <select className="bg-transparent text-sm font-medium text-slate-700 outline-none" value={subFilter} onChange={(e) => setSubFilter(e.target.value)}>
                    <option>All</option>
                    <option>Pending</option>
                    <option>Under Review</option>
                    <option>Accepted</option>
                    <option>Rejected</option>
                  </select>
                </div>
                <button onClick={() => exportCSV(filteredSubs)} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
                  <Download size={14} /> Export CSV
                </button>
              </div>
            </div>

            {filteredSubs.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-12 text-center">
                <Inbox size={32} className="mx-auto mb-3 text-slate-300" />
                <p className="text-sm text-slate-400">No submissions{subFilter !== 'All' ? ` with status "${subFilter}"` : ''} yet.</p>
              </div>
            )}

            <div className="space-y-4">
              {filteredSubs.map((s) => (
                <div key={s._id} className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3 p-5">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold leading-snug text-slate-900">{s.paperTitle}</p>
                      <p className="mt-1 text-sm text-slate-500">{s.authorName} � {s.email} � {s.affiliation}</p>
                      <p className="mt-1 text-xs text-slate-400">{new Date(s.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_STYLES[s.status] || 'bg-slate-100 text-slate-600'}`}>{s.status}</span>
                      <button onClick={() => setExpandedSub(expandedSub === s._id ? '' : s._id)} className="rounded-xl border border-slate-200 p-2 hover:bg-slate-50 transition">
                        {expandedSub === s._id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                      </button>
                    </div>
                  </div>

                  {expandedSub === s._id && (
                    <div className="space-y-4 border-t border-slate-100 p-5">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Abstract</p>
                          <p className="mt-1 text-sm leading-6 text-slate-700">{s.abstract}</p>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Keywords</p>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {(s.keywords || []).map((kw) => <span key={kw} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{kw}</span>)}
                            </div>
                          </div>
                          {s.adminNotes && (
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Previous Notes</p>
                              <p className="mt-1 text-sm italic text-slate-600">{s.adminNotes}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold uppercase tracking-wide text-slate-400">Reviewer Notes (saved with status update)</label>
                        <textarea className={`${inp} mt-1`} rows={2} placeholder="Add notes, feedback, or decision reason..." value={subNotes[s._id] || ''} onChange={(e) => setSubNotes({ ...subNotes, [s._id]: e.target.value })} />
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => setStatus(s._id, 'Under Review')}
                          disabled={s.status === 'Under Review'}
                          className="rounded-lg bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-700 transition disabled:opacity-40"
                        >
                          Mark as Under Review
                        </button>
                        <button
                          onClick={() => setStatus(s._id, 'Accepted')}
                          disabled={s.status === 'Accepted'}
                          className="rounded-lg bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700 transition disabled:opacity-40"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => setStatus(s._id, 'Rejected')}
                          disabled={s.status === 'Rejected'}
                          className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 transition disabled:opacity-40"
                        >
                          Reject
                        </button>
                        <a href={`${FILE_BASE}${s.manuscriptUrl}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition">
                          <Eye size={12} /> View PDF
                        </a>
                        <a href={`${FILE_BASE}${s.manuscriptUrl}`} download className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition">
                          <Download size={12} /> Download
                        </a>
                        <button onClick={() => deleteSubmission(s._id)} className="ml-auto flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition">
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* WEBSITE CONTENT MANAGEMENT */}
          <section id="sec-content" className="scroll-mt-24">
            <h2 className="section-title mb-1">Website Content Management</h2>
            <p className="mb-5 text-sm text-slate-500">Edit policies text, copyright text, licensing terms, and save updates to database content blocks.</p>
            <form onSubmit={handleContentSave} className="panel space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-500">Content Type</label>
                  <select className={inp} value={contentType} onChange={(e) => setContentType(e.target.value)}>
                    {contentTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-500">Title</label>
                  <input className={inp} value={contentForm.title} onChange={(e) => setContentForm({ ...contentForm, title: e.target.value })} required />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500">Body</label>
                <textarea
                  className={inp}
                  rows={12}
                  value={contentForm.body}
                  onChange={(e) => setContentForm({ ...contentForm, body: e.target.value })}
                  placeholder="Use sections with '## Heading' and paragraph blocks separated by blank lines."
                  required
                />
              </div>
              <div className="flex justify-end">
                <button className="btn-primary flex items-center gap-2" type="submit"><Save size={15} /> Save Website Content</button>
              </div>
            </form>
          </section>

          {/* ANNOUNCEMENTS */}
          <section id="sec-announcements" className="scroll-mt-24">
            <h2 className="section-title mb-4">Announcements</h2>
            <div className="grid gap-6 lg:grid-cols-2">
              <form onSubmit={handleAnnouncementCreate} className="panel space-y-3">
                <p className="flex items-center gap-2 font-semibold text-slate-800"><Bell size={17} className="text-amber-500" />Create Announcement</p>
                <input
                  className={inp}
                  placeholder="Announcement title"
                  value={announcementForm.title}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                  required
                />
                <textarea
                  className={inp}
                  rows={4}
                  placeholder="Announcement message"
                  value={announcementForm.message}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, message: e.target.value })}
                  required
                />
                <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={announcementForm.isActive}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, isActive: e.target.checked })}
                  />
                  Active announcement
                </label>
                <button className="btn-primary flex items-center gap-2" type="submit"><Save size={15} /> Publish Announcement</button>
              </form>

              <div className="panel">
                <p className="mb-3 font-semibold text-slate-800">All Announcements ({announcements.length})</p>
                <div className="max-h-96 space-y-2 overflow-y-auto pr-1">
                  {announcements.length === 0 && <p className="text-sm text-slate-400">No announcements yet.</p>}
                  {announcements.map((notice) => (
                    <div key={notice._id} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{notice.title}</p>
                          <p className="mt-1 text-xs text-slate-600">{notice.message}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleAnnouncementToggle(notice)}
                            className={`rounded-lg border p-1.5 transition ${notice.isActive ? 'border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100' : 'border-green-300 bg-green-50 text-green-700 hover:bg-green-100'}`}
                            title={notice.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {notice.isActive ? <X size={14} /> : <Check size={14} />}
                          </button>
                          <button onClick={() => handleAnnouncementDelete(notice._id)} className="rounded-lg border border-red-200 bg-red-50 p-1.5 text-red-600 hover:bg-red-100 transition"><Trash2 size={14} /></button>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${notice.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>
                          {notice.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className="text-[10px] text-slate-500">{new Date(notice.date || notice.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* SITE INFO */}
          <section id="sec-siteinfo" className="scroll-mt-24">
            <h2 className="section-title mb-1">Site Information</h2>
            <p className="mb-5 text-sm text-slate-500">Changes here update the public-facing About page, Contact details, and social media links.</p>

            <form onSubmit={handleSiteInfoSave} className="space-y-6">

              {/* About */}
              <div className="panel space-y-3">
                <p className="flex items-center gap-2 font-semibold text-slate-800"><Globe size={17} className="text-indigo-500" />About the Journal</p>
                <input className={inp} placeholder="Section heading (e.g. About International Journal of Transdisciplinary Science and Engineering)" value={siteForm.aboutTitle} onChange={(e) => setSiteForm({ ...siteForm, aboutTitle: e.target.value })} />
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-500">About / Overview Text</label>
                  <textarea className={inp} rows={5} placeholder="Describe the journal, its scope, and goals..." value={siteForm.aboutText} onChange={(e) => setSiteForm({ ...siteForm, aboutText: e.target.value })} />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-500">Mission Statement</label>
                    <textarea className={inp} rows={3} placeholder="Our mission is..." value={siteForm.missionText} onChange={(e) => setSiteForm({ ...siteForm, missionText: e.target.value })} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-500">Vision Statement</label>
                    <textarea className={inp} rows={3} placeholder="Our vision is..." value={siteForm.visionText} onChange={(e) => setSiteForm({ ...siteForm, visionText: e.target.value })} />
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-500">ISSN</label>
                    <input className={inp} placeholder="e.g. 1234-5678" value={siteForm.journalISSN} onChange={(e) => setSiteForm({ ...siteForm, journalISSN: e.target.value })} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-500">DOI Prefix</label>
                    <input className={inp} placeholder="e.g. 10.1234/ijtse" value={siteForm.journalDOI} onChange={(e) => setSiteForm({ ...siteForm, journalDOI: e.target.value })} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-500">Publisher Name</label>
                    <input className={inp} placeholder="Publisher / Organization" value={siteForm.publisherName} onChange={(e) => setSiteForm({ ...siteForm, publisherName: e.target.value })} />
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="panel space-y-3">
                <p className="flex items-center gap-2 font-semibold text-slate-800"><Phone size={17} className="text-emerald-500" />Contact Information</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-500">Public Email</label>
                    <input className={inp} type="email" placeholder="contact@journal.org" value={siteForm.contactEmail} onChange={(e) => setSiteForm({ ...siteForm, contactEmail: e.target.value })} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-500">Phone Number</label>
                    <input className={inp} type="tel" placeholder="+91 98765 43210" value={siteForm.contactPhone} onChange={(e) => setSiteForm({ ...siteForm, contactPhone: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-500">Street Address</label>
                  <input className={inp} placeholder="Building name, street, area" value={siteForm.contactAddress} onChange={(e) => setSiteForm({ ...siteForm, contactAddress: e.target.value })} />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-500">City</label>
                    <input className={inp} placeholder="City" value={siteForm.contactCity} onChange={(e) => setSiteForm({ ...siteForm, contactCity: e.target.value })} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-500">Country</label>
                    <input className={inp} placeholder="Country" value={siteForm.contactCountry} onChange={(e) => setSiteForm({ ...siteForm, contactCountry: e.target.value })} />
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="panel space-y-3">
                <p className="flex items-center gap-2 font-semibold text-slate-800"><Link2 size={17} className="text-violet-500" />Social Media Links</p>
                <p className="text-xs text-slate-400">Enter full URLs including https://</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { key: 'socialFacebook',    label: 'Facebook',     placeholder: 'https://facebook.com/...' },
                    { key: 'socialTwitter',     label: 'X / Twitter',  placeholder: 'https://twitter.com/...' },
                    { key: 'socialLinkedIn',    label: 'LinkedIn',     placeholder: 'https://linkedin.com/...' },
                    { key: 'socialInstagram',   label: 'Instagram',    placeholder: 'https://instagram.com/...' },
                    { key: 'socialYouTube',     label: 'YouTube',      placeholder: 'https://youtube.com/...' },
                    { key: 'socialResearchGate',label: 'ResearchGate', placeholder: 'https://researchgate.net/...' },
                  ].map(({ key, label, placeholder }) => (
                    <div key={key}>
                      <label className="mb-1 block text-xs font-semibold text-slate-500">{label}</label>
                      <input className={inp} type="url" placeholder={placeholder} value={siteForm[key]} onChange={(e) => setSiteForm({ ...siteForm, [key]: e.target.value })} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button className="btn-primary flex items-center gap-2 px-6" type="submit"><Save size={15} /> Save Site Information</button>
              </div>

            </form>
          </section>

          {/* SETTINGS */}
          <section id="sec-settings" className="scroll-mt-24 pb-16">
            <h2 className="section-title mb-4">Account Settings</h2>
            <div className="grid gap-6 lg:grid-cols-2">
              <form onSubmit={handleProfileSave} className="panel space-y-3">
                <p className="font-semibold text-slate-800">Update Profile</p>
                <input className={inp} placeholder="Full name" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} required />
                <input className={inp} type="email" placeholder="Email address" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} required />
                <button className="btn-primary flex items-center gap-2" type="submit"><Save size={15} /> Save Profile</button>
              </form>

              <form onSubmit={handlePasswordChange} className="panel space-y-3">
                <p className="font-semibold text-slate-800">Change Password</p>
                <input className={inp} type="password" placeholder="Current password" value={pwForm.currentPassword} onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} required />
                <input className={inp} type="password" placeholder="New password (min 8 chars)" value={pwForm.newPassword} onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} required />
                <input className={inp} type="password" placeholder="Confirm new password" value={pwForm.confirmNew} onChange={(e) => setPwForm({ ...pwForm, confirmNew: e.target.value })} required />
                <button className="btn-primary flex items-center gap-2" type="submit"><Save size={15} /> Change Password</button>
              </form>
            </div>

            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50/50 p-5">
              <p className="font-semibold text-red-800">Session</p>
              <p className="mt-1 text-sm text-red-600">Logging out will clear your session token from this device.</p>
              <button onClick={() => { logout(); navigate('/admin/login'); }}
                className="mt-3 flex items-center gap-2 rounded-xl border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 transition">
                <LogOut size={15} /> Logout
              </button>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
