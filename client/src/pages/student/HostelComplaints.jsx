import { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { HiWrenchScrewdriver, HiPlus, HiXMark } from 'react-icons/hi2';
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

const CATEGORIES = ['Electricity', 'Water', 'WiFi', 'Cleaning', 'Furniture', 'Mess'];

const HostelComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Electricity',
    priority: 'Medium'
  });

  const fetchComplaints = async () => {
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
    fetchComplaints();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/api/complaints', formData);
      toast.success('Complaint submitted successfully');
      setShowForm(false);
      setFormData({ title: '', description: '', category: 'Electricity', priority: 'Medium' });
      fetchComplaints();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit complaint');
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Hostel Complaints</h1>
          <p className="text-gray-600 text-sm">Raise and track maintenance issues</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <HiPlus className="w-5 h-5" /> New Complaint
        </button>
      </div>

      {showForm && (
        <div className="glass p-6 card-hover relative">
          <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
            <HiXMark className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-bold text-white mb-4">Lodge a Complaint</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Issue Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="input-field" placeholder="e.g. Fan not working" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Category</label>
                <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="input-field">
                  {CATEGORIES.map(cat => <option key={cat} value={cat} className="bg-black">{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Priority</label>
                <select value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })} className="input-field">
                  <option value="Low" className="bg-black">Low</option>
                  <option value="Medium" className="bg-black">Medium</option>
                  <option value="High" className="bg-black">High</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Description</label>
              <textarea required rows="3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="input-field resize-none" placeholder="Provide details about the issue..."></textarea>
            </div>
            <div className="flex justify-end">
              <button type="submit" className="btn-primary">Submit Complaint</button>
            </div>
          </form>
        </div>
      )}

      {complaints.length === 0 ? <EmptyState title="No complaints raised" icon={HiWrenchScrewdriver} /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {complaints.map(c => (
            <div key={c._id} className="glass p-5 card-hover">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-800 text-gray-300">{c.category}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${priorityColors[c.priority]}`}>{c.priority} Priority</span>
                  </div>
                  <h3 className="text-white font-medium">{c.title}</h3>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[c.status]}`}>{c.status}</span>
              </div>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2">{c.description}</p>
              
              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-gray-600">Raised: {new Date(c.createdAt).toLocaleDateString()}</span>
                {c.resolution && <span className="text-emerald-400 font-medium">Resolution provided</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HostelComplaints;
