import { useMemo, useState } from 'react';
import PolicyPageShell from '../components/PolicyPageShell';
import { useContentByType } from '../utils/content';

const CopyrightFormPage = () => {
  const { content, loading } = useContentByType('copyright-form');
  const [authorName, setAuthorName] = useState('');
  const [paperTitle, setPaperTitle] = useState('');

  const downloadLabel = useMemo(
    () => (authorName || paperTitle ? `Template for ${authorName || 'Author'}` : 'Download Copyright Form (PDF)'),
    [authorName, paperTitle]
  );

  return (
    <PolicyPageShell
      seoTitle="Copyright Form | International Journal of Transdisciplinary Science and Engineering"
      seoDescription="Downloadable copyright transfer form with author details and signature area."
      title={content?.title || 'Copyright Transfer Form'}
      subtitle="Complete this form after editorial acceptance. A PDF template is available for download and signature."
      content={content}
      loading={loading}
      actions={(
        <div className="grid gap-3 md:grid-cols-3">
          <input
            value={authorName}
            onChange={(event) => setAuthorName(event.target.value)}
            placeholder="Author Name"
            className="rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-slate-300 focus:border-amber-300 focus:outline-none"
          />
          <input
            value={paperTitle}
            onChange={(event) => setPaperTitle(event.target.value)}
            placeholder="Paper Title"
            className="rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-slate-300 focus:border-amber-300 focus:outline-none"
          />
          <a
            href="/copyright-transfer-form.pdf"
            download
            className="inline-flex items-center justify-center rounded-xl bg-amber-300 px-4 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-amber-200"
          >
            {downloadLabel}
          </a>
        </div>
      )}
    />
  );
};

export default CopyrightFormPage;
