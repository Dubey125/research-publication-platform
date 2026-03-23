import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const NotFoundPage = () => (
  <section className="container-width py-20 text-center">
    <SEO title="404 | International Journal of Transdisciplinary Science and Engineering" description="Page not found" />
    <h1 className="text-5xl font-bold text-primary-800">404</h1>
    <p className="mt-4 text-slate-600">The page you requested could not be found.</p>
    <Link to="/" className="btn-primary mt-8 inline-flex">Return Home</Link>
  </section>
);

export default NotFoundPage;
