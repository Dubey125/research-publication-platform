import { Download, FileText } from 'lucide-react';
import PolicyPageShell from '../components/PolicyPageShell';
import { useContentByType } from '../utils/content';

const AuthorGuidelinesPage = () => {
  const { content, loading } = useContentByType('author-guidelines');

  const handleDownloadTemplate = async (e) => {
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
      window.open('/IJTSE-Manuscript-Template.pdf', '_blank');
    }
  };

  const handleDownloadForm = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/IJTSE-Declaration-Form.pdf');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'IJTSE-Declaration-Form.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      window.open('/IJTSE-Declaration-Form.pdf', '_blank');
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
        <div className="flex flex-wrap gap-4 mt-2">
          <button
            onClick={handleDownloadTemplate}
            className="group flex-1 min-w-[300px] inline-flex items-center gap-3 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-3.5 text-sm font-semibold text-indigo-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-100 cursor-pointer"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 transition-transform duration-300 group-hover:scale-110">
              <FileText size={18} />
            </span>
            <span className="flex flex-col items-start min-w-0 flex-1">
              <span className="text-sm font-bold text-indigo-800 truncate">Manuscript Template</span>
              <span className="text-[11px] font-normal text-indigo-500 truncate">IJTSE Formatting Guidelines (PDF)</span>
            </span>
            <Download size={16} className="ml-2 shrink-0 text-indigo-400 transition-transform duration-300 group-hover:translate-y-0.5" />
          </button>
          <button
            onClick={handleDownloadForm}
            className="group flex-1 min-w-[300px] inline-flex items-center gap-3 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-3.5 text-sm font-semibold text-amber-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md hover:shadow-amber-100 cursor-pointer"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-600 text-white shadow-lg shadow-amber-200 transition-transform duration-300 group-hover:scale-110">
              <FileText size={18} />
            </span>
            <span className="flex flex-col items-start min-w-0 flex-1">
              <span className="text-sm font-bold text-amber-800 truncate">Declaration Form</span>
              <span className="text-[11px] font-normal text-amber-600 truncate">Author Undertaking Required (PDF)</span>
            </span>
            <Download size={16} className="ml-2 shrink-0 text-amber-500 transition-transform duration-300 group-hover:translate-y-0.5" />
          </button>
        </div>
      }
    />
  );
};

export default AuthorGuidelinesPage;
