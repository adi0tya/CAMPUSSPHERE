import { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { HiWrenchScrewdriver, HiCheck, HiXMark } from 'react-icons/hi2';
import EmptyState from '../../components/common/EmptyState';

const priorityColors = {
  Low: 'bg-emerald-500/10 text-emerald-400',
  Medium: 'bg-amber-500/10 text-amber-400',
  High: 'bg-red-500/10 text-red-400'
};

const statusColors = {
  Pending: 'bg-amber-500/10 text-amber-400',
  'In Progress': 'bg-blue-500/10 text-blue-400',
  Resolved: 'bg-emerald-500/10 text-emerald-400',
  Rejected: 'bg-red-500/10 text-red-400'
};

const ComplaintManagement = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const fetchAllComplaints = async () => {
    try {
      const { data } = await API.get('/api/complaints');
      setComplaints(data.complaints || []);
    } catch (err) {
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllComplaints();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await API.put(`/api/complaints/${id}/status`, { status });
      toast.success(`Complaint marked as ${status}`);
      fetchAllComplaints();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const filtered = filter === 'All' ? complaints : complaints.filter(c => c.status === filter);

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Complaint Management</h1>
          <p className="text-gray-600 text-sm">Monitor and resolve hostel issues</p>
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="input-field max-w-[200px]">
          <option value="All">All Complaints</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      {filtered.length === 0 ? <EmptyState title="No complaints found" icon={HiWrenchScrewdriver} /> : (
        <div className="space-y-4">
          {filtered.map(c => (
            <div key={c._id} className="glass p-5 card-hover">
              <div className="flex items-start justify-between mb-4">
                <div className="flex gap-4">
                  <div className={`p-3 rounded-xl ${statusColors[c.status]}`}>
                    <HiWrenchScrewdriver className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">{c.category}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${priorityColors[c.priority]}`}>{c.priority}</span>
                    </div>
                    <h3 className="text-white font-semibold text-lg">{c.title}</h3>
                    <p className="text-gray-500 text-sm mt-1">{c.description}</p>
                    <p className="text-gray-600 text-xs mt-2">By: <span className="text-gray-400">{c.user?.name}</span> ({c.user?.email})</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColors[c.status]}`}>{c.status}</span>
                  <div className="flex gap-2 mt-4">
                    {c.status === 'Pending' && (
                      <button onClick={() => handleUpdateStatus(c._id, 'In Progress')} className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors" title="Start Progress">
                        <HiCheck className="w-5 h-5" />
                      </button>
                    )}
                    {c.status !== 'Resolved' && c.status !== 'Rejected' && (
                      <button onClick={() => handleUpdateStatus(c._id, 'Resolved')} className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors" title="Mark Resolved">
                        <HiCheck className="w-5 h-5" />
                      </button>
                    )}
                    {c.status === 'Pending' && (
                      <button onClick={() => handleUpdateStatus(c._id, 'Rejected')} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors" title="Reject">
                        <HiXMark className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComplaintManagement;
