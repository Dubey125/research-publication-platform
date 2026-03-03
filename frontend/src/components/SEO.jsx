import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, canonical }) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
    {canonical ? <link rel="canonical" href={canonical} /> : null}
  </Helmet>
);

export default SEO;
