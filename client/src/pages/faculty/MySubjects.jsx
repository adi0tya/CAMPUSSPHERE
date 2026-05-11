import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { HiBookOpen } from 'react-icons/hi2';
import EmptyState from '../../components/common/EmptyState';

const MySubjects = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/api/faculty/me').then(({ data }) => setProfile(data.faculty)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" /></div>;

  const subjects = profile?.subjects || [];

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">My Subjects</h1><p className="text-gray-600 text-sm">Subjects assigned to you</p></div>
      {subjects.length === 0 ? <EmptyState title="No subjects assigned" icon={HiBookOpen} /> : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map(s => (
            <div key={s._id} className="glass p-5 card-hover">
              <div className="flex items-start justify-between mb-3">
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-indigo-500/10 text-indigo-400">{s.code}</span>
                <span className="text-xs text-gray-600">Sem {s.semester}</span>
              </div>
              <h3 className="text-base font-semibold text-white mb-1">{s.name}</h3>
              <p className="text-gray-500 text-sm">{s.credits} credits</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MySubjects;
