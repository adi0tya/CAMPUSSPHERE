import { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { HiHomeModern, HiClock, HiCheckCircle } from 'react-icons/hi2';
import EmptyState from '../../components/common/EmptyState';

const RoomService = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ type: 'Cleaning', note: '', preferredTime: '' });

  const fetchRequests = async () => {
    try {
      const { data } = await API.get('/api/room-service');
      setRequests(data.requests || []);
    } catch (err) {
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/api/room-service', formData);
      toast.success('Room service request placed!');
      setFormData({ type: 'Cleaning', note: '', preferredTime: '' });
      fetchRequests();
    } catch (err) {
      toast.error('Failed to place request');
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" /></div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Room Service</h1>
          <p className="text-gray-600 text-sm">Request cleaning, laundry or maintenance for your hostel room</p>
        </div>

        <form onSubmit={handleSubmit} className="glass p-6 space-y-4">
          <h2 className="text-lg font-bold text-white mb-4">New Request</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-medium text-gray-400 mb-1">Service Type</label>
              <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className="input-field">
                <option value="Cleaning" className="bg-black">Room Cleaning</option>
                <option value="Laundry" className="bg-black">Laundry Service</option>
                <option value="Maintenance" className="bg-black">Maintenance</option>
                <option value="Delivery" className="bg-black">Water/Items Delivery</option>
              </select>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-medium text-gray-400 mb-1">Preferred Time</label>
              <input type="datetime-local" value={formData.preferredTime} onChange={e => setFormData({ ...formData, preferredTime: e.target.value })} className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Additional Notes</label>
            <textarea rows="3" value={formData.note} onChange={e => setFormData({ ...formData, note: e.target.value })} className="input-field resize-none" placeholder="Special instructions..."></textarea>
          </div>
          <button type="submit" className="w-full btn-primary py-3">Place Request</button>
        </form>
      </div>

      <div className="space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <HiClock className="text-cyan-400" /> Recent Requests
        </h2>
        {requests.length === 0 ? <EmptyState title="No active requests" icon={HiHomeModern} /> : (
          <div className="space-y-3">
            {requests.map(r => (
              <div key={r._id} className="glass p-4 card-hover">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-white font-semibold">{r.type}</h3>
                    <p className="text-gray-500 text-xs mt-1">Ref: #{r._id.slice(-6).toUpperCase()}</p>
                    {r.note && <p className="text-gray-600 text-xs mt-2 italic">"{r.note}"</p>}
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    r.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' : 
                    r.status === 'Pending' ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-500/10 text-blue-400'
                  }`}>
                    {r.status}
                  </span>
                </div>
                {r.assignedWorker && (
                  <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2 text-xs">
                    <HiCheckCircle className="text-cyan-400" />
                    <span className="text-gray-400">Assigned: {r.assignedWorker}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomService;
