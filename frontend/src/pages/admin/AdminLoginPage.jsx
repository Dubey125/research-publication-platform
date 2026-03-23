import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../../components/SEO';
import { useAuth } from '../../context/AuthContext';
import { TAGLINE } from '../../utils/constants';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container-width py-14">
      <SEO title="Admin Login | International Journal of Transdisciplinary Science and Engineering" description="Secure admin access" />
      <div className="mx-auto max-w-md panel glow-ring">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">Editorial Control Center</p>
        <h1 className="mt-3 text-2xl font-bold text-primary-900">Admin Login</h1>
        <p className="mt-2 text-sm text-slate-600">{TAGLINE}</p>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <input className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5" type="email" placeholder="Admin Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          <button className="btn-primary w-full" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
        </form>
      </div>
    </section>
  );
};

export default AdminLoginPage;
