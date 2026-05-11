import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { HiBell } from 'react-icons/hi2';
import EmptyState from '../../components/common/EmptyState';

const targetColors = {
  all: 'bg-cyan-500/10 text-cyan-400',
  student: 'bg-emerald-500/10 text-emerald-400',
  faculty: 'bg-indigo-500/10 text-indigo-400',
  accountant: 'bg-amber-500/10 text-amber-400'
};

const NoticesPage = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/api/notices').then(({ data }) => setNotices(data.notices)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">Notices</h1><p className="text-gray-600 text-sm">Announcements and updates</p></div>

      {notices.length === 0 ? <EmptyState title="No notices" message="No announcements at this time." icon={HiBell} /> : (
        <div className="space-y-4">
          {notices.map(n => (
            <div key={n._id} className="glass p-5 card-hover">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                  <HiBell className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-base font-semibold text-white">{n.title}</h3>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${targetColors[n.targetRole] || 'bg-gray-500/10 text-gray-400'}`}>
                      {n.targetRole === 'all' ? 'Everyone' : n.targetRole}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">{n.description}</p>
                  <p className="text-gray-600 text-xs mt-3">
                    Posted by {n.createdBy?.name} • {new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NoticesPage;
