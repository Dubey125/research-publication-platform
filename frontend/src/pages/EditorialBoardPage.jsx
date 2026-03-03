import { useEffect, useState } from 'react';
import SEO from '../components/SEO';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../utils/api';

const roleOrder = ['Editor-in-Chief', 'Associate Editor', 'Reviewer'];

const EditorialBoardPage = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/editorial');
        setMembers(data.members || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <section className="container-width py-14">
      <SEO title="Editorial Board | IJAIF" description="Editorial board of IJAIF" />
      <h1 className="text-3xl font-bold text-primary-800">Editorial Board</h1>
      {loading ? <LoadingSpinner /> : null}
      {!loading && roleOrder.map((role) => {
        const filtered = members.filter((member) => member.role === role);
        if (!filtered.length) return null;
        return (
          <div key={role} className="mt-8">
            <h2 className="text-xl font-semibold text-slate-900">{role}</h2>
            <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((member) => (
                <article className="card" key={member._id}>
                  {member.photoUrl ? (
                    <img src={`${import.meta.env.VITE_FILE_BASE_URL || 'http://localhost:5000'}${member.photoUrl}`} alt={member.name} className="h-44 w-full rounded-lg object-cover" />
                  ) : (
                    <div className="flex h-44 items-center justify-center rounded-lg bg-primary-50 text-primary-800">No Photo</div>
                  )}
                  <h3 className="mt-4 text-lg font-semibold">{member.name}</h3>
                  <p className="text-sm text-primary-700">{member.affiliation}</p>
                  <p className="mt-2 text-sm text-slate-600">{member.bio || 'Editorial board member'}</p>
                </article>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default EditorialBoardPage;
