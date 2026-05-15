import { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { HiHomeModern, HiUser, HiCheck } from 'react-icons/hi2';
import EmptyState from '../../components/common/EmptyState';

const RoomServiceManagement = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllRequests = async () => {
    try {
      const { data } = await API.get('/api/room-service/all');
      setRequests(data.requests || []);
    } catch (err) {
      toast.error('Failed to load room service requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRequests();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await API.put(`/api/room-service/${id}`, { status });
      toast.success(`Request marked as ${status}`);
      fetchAllRequests();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Room Service Management</h1>
        <p className="text-gray-600 text-sm">Assign workers and manage service requests</p>
      </div>

      <div className="glass overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-[10px] uppercase tracking-wider text-gray-400">
            <tr>
              <th className="px-6 py-4">Request & Room</th>
              <th className="px-6 py-4">Student Info</th>
              <th className="px-6 py-4">Preferred Time</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {requests.map(r => (
              <tr key={r._id} className="text-sm hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-white font-medium">{r.type}</p>
                  <p className="text-gray-500 text-xs mt-1">Room: {r.user?.roomNumber || 'N/A'}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-gray-300">{r.user?.name}</p>
                  <p className="text-gray-600 text-xs">{r.user?.email}</p>
                </td>
                <td className="px-6 py-4 text-gray-400">
                  {r.preferredTime ? new Date(r.preferredTime).toLocaleString() : 'ASAP'}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    r.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' : 
                    r.status === 'Pending' ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-500/10 text-blue-400'
                  }`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {r.status === 'Pending' && (
                      <button onClick={() => handleUpdateStatus(r._id, 'In Progress')} className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20" title="Assign Worker">
                        <HiUser className="w-4 h-4" />
                      </button>
                    )}
                    {r.status !== 'Completed' && (
                      <button onClick={() => handleUpdateStatus(r._id, 'Completed')} className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20" title="Complete Request">
                        <HiCheck className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {requests.length === 0 && <div className="p-10"><EmptyState title="No service requests found" icon={HiHomeModern} /></div>}
      </div>
    </div>
  );
};

export default RoomServiceManagement;
