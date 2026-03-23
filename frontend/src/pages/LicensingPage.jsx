import PolicyPageShell from '../components/PolicyPageShell';
import { useContentByType } from '../utils/content';

const LicensingPage = () => {
  const { content, loading } = useContentByType('licensing');

  return (
    <PolicyPageShell
      seoTitle="Licensing | International Journal of Transdisciplinary Science and Engineering"
      seoDescription="Open access and CC BY style licensing explanation for reuse and attribution."
      title={content?.title || 'Licensing Terms'}
      subtitle="Our licensing model supports broad dissemination while preserving author attribution rights and citation quality."
      content={content}
      loading={loading}
    />
  );
};

export default LicensingPage;
