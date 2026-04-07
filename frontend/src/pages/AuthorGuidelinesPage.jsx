import { Download, FileText } from 'lucide-react';
import PolicyPageShell from '../components/PolicyPageShell';
import { useContentByType } from '../utils/content';

const AuthorGuidelinesPage = () => {
  const { content, loading } = useContentByType('author-guidelines');

  const handleDownload = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/IJTSE-Manuscript-Template.pdf');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'IJTSE-Manuscript-Template.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      // Fallback: open in new tab if blob download fails
      window.open('/IJTSE-Manuscript-Template.pdf', '_blank');
    }
  };

  return (
    <PolicyPageShell
      seoTitle="Author Guidelines | International Journal of Transdisciplinary Science and Engineering"
      seoDescription="Author responsibilities, manuscript preparation standards, and submission checklist."
      title={content?.title || 'Author Guidelines'}
      subtitle="Prepare your manuscript using this structured guide to improve review quality and processing speed."
      content={content}
      loading={loading}
      actions={
        <button
          onClick={handleDownload}
          className="group inline-flex items-center gap-3 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-3.5 text-sm font-semibold text-indigo-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-100 cursor-pointer"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 transition-transform duration-300 group-hover:scale-110">
            <FileText size={18} />
          </span>
          <span className="flex flex-col items-start">
            <span className="text-sm font-bold text-indigo-800">Download Manuscript Template</span>
            <span className="text-[11px] font-normal text-indigo-500">IJTSE Formatting Guidelines (PDF)</span>
          </span>
          <Download size={16} className="ml-2 text-indigo-400 transition-transform duration-300 group-hover:translate-y-0.5" />
        </button>
      }
    />
  );
};

export default AuthorGuidelinesPage;
