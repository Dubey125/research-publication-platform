import PolicyPageShell from '../components/PolicyPageShell';
import { useContentByType } from '../utils/content';

const AuthorGuidelinesPage = () => {
  const { content, loading } = useContentByType('author-guidelines');

  return (
    <PolicyPageShell
      seoTitle="Author Guidelines | International Journal of Transdisciplinary Science and Engineering"
      seoDescription="Author responsibilities, manuscript preparation standards, and submission checklist."
      title={content?.title || 'Author Guidelines'}
      subtitle="Prepare your manuscript using this structured guide to improve review quality and processing speed."
      content={content}
      loading={loading}
    />
  );
};

export default AuthorGuidelinesPage;
