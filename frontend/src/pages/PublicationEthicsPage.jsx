import PolicyPageShell from '../components/PolicyPageShell';
import { useContentByType } from '../utils/content';

const PublicationEthicsPage = () => {
  const { content, loading } = useContentByType('publication-ethics');

  return (
    <PolicyPageShell
      seoTitle="Publication Ethics | International Journal of Transdisciplinary Science and Engineering"
      seoDescription="Ethics, integrity, disclosure, and misconduct handling framework for submissions."
      title={content?.title || 'Publication Ethics'}
      subtitle="Integrity, transparency, and ethical compliance are mandatory throughout submission, review, and publication."
      content={content}
      loading={loading}
    />
  );
};

export default PublicationEthicsPage;
