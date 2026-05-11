import { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { HiPlus, HiPencil, HiTrash, HiBell } from 'react-icons/hi2';
import EmptyState from '../../components/common/EmptyState';

const ic = "w-full px-4 py-3 bg-black border border-[#2a2a2a] rounded-xl text-white placeholder-gray-600 text-sm focus:border-cyan-500 outline-none";

const targetColors = {
  all: 'bg-cyan-500/10 text-cyan-400',
  student: 'bg-emerald-500/10 text-emerald-400',
  faculty: 'bg-indigo-500/10 text-indigo-400',
  accountant: 'bg-amber-500/10 text-amber-400'
};

const NoticeManagement = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', targetRole: 'all' });

  useEffect(() => { fetchNotices(); }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/api/notices');
      setNotices(data.notices);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) return toast.error('Fill all fields');
    try {
      if (editing) { await API.put(`/api/notices/${editing}`, form); toast.success('Notice updated'); }
      else { await API.post('/api/notices', form); toast.success('Notice created'); }
      setShowModal(false); setEditing(null); setForm({ title: '', description: '', targetRole: 'all' }); fetchNotices();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this notice?')) return;
    try { await API.delete(`/api/notices/${id}`); toast.success('Deleted'); fetchNotices(); } catch { toast.error('Failed'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-white">Notice Management</h1><p className="text-gray-600 text-sm">Create and manage announcements</p></div>
        <button onClick={() => { setEditing(null); setForm({ title: '', description: '', targetRole: 'all' }); setShowModal(true); }} className="px-6 py-2.5 gradient-cyan rounded-xl text-white font-semibold hover:opacity-90 flex items-center gap-2 self-start">
          <HiPlus className="w-5 h-5" /> Create Notice
        </button>
      </div>

      {loading ? <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-24" />)}</div> : notices.length === 0 ? (
        <EmptyState title="No notices" message="Create your first notice." icon={HiBell} />
      ) : (
        <div className="space-y-4">
          {notices.map(n => (
            <div key={n._id} className="glass p-5 card-hover">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-base font-semibold text-white">{n.title}</h3>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${targetColors[n.targetRole] || 'bg-gray-500/10 text-gray-400'}`}>
                      {n.targetRole === 'all' ? 'Everyone' : n.targetRole}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">{n.description}</p>
                  <p className="text-gray-600 text-xs mt-2">
                    By {n.createdBy?.name} • {new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => { setEditing(n._id); setForm({ title: n.title, description: n.description, targetRole: n.targetRole }); setShowModal(true); }} className="p-2 rounded-lg hover:bg-cyan-500/10 text-gray-500 hover:text-cyan-400 transition-colors"><HiPencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(n._id)} className="p-2 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-colors"><HiTrash className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-white mb-6">{editing ? 'Edit Notice' : 'Create Notice'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm text-gray-500 mb-1">Title *</label><input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Notice title" className={ic} /></div>
              <div><label className="block text-sm text-gray-500 mb-1">Description *</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Notice content..." className={`${ic} h-32 resize-none`} /></div>
              <div><label className="block text-sm text-gray-500 mb-1">Target Audience</label>
                <select value={form.targetRole} onChange={e => setForm({...form, targetRole: e.target.value})} className={ic}>
                  <option value="all">Everyone</option>
                  <option value="student">Students Only</option>
                  <option value="faculty">Faculty Only</option>
                  <option value="accountant">Accountants Only</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 py-3 gradient-cyan rounded-xl text-white font-semibold">{editing ? 'Update' : 'Publish'}</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 bg-[#181818] border border-[#2a2a2a] rounded-xl text-gray-400">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticeManagement;
