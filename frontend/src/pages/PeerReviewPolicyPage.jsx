import PolicyPageShell from '../components/PolicyPageShell';
import { useContentByType } from '../utils/content';

const PeerReviewPolicyPage = () => {
  const { content, loading } = useContentByType('peer-review-policy');

  return (
    <PolicyPageShell
      seoTitle="Peer Review Policy | International Journal of Transdisciplinary Science and Engineering"
      seoDescription="Double-blind review process and editorial decision flow."
      title={content?.title || 'Peer Review Policy'}
      subtitle="Our review process focuses on fairness, methodological rigor, and field relevance."
      content={content}
      loading={loading}
    />
  );
};

export default PeerReviewPolicyPage;
