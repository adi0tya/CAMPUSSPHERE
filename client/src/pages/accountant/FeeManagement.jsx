import { useState, useEffect } from 'react';
import API from '../../api/axios';
import StatusBadge from '../../components/common/StatusBadge';
import toast from 'react-hot-toast';
import { HiPlus, HiPencil, HiCurrencyRupee } from 'react-icons/hi2';

const FeeManagement = () => {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState('');
  const [form, setForm] = useState({ student: '', amount: '', dueDate: '', description: 'Tuition Fee' });

  useEffect(() => { fetchData(); }, [filter]);
  const fetchData = async () => {
    try {
      const params = {};
      if (filter) params.status = filter;
      const [feeRes, stuRes] = await Promise.all([API.get('/api/fees', { params }), API.get('/api/students')]);
      setFees(feeRes.data.fees || []);
      setStudents(stuRes.data.students || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.student || !form.amount || !form.dueDate) return toast.error('Fill required fields');
    try {
      if (editing) { await API.put(`/api/fees/${editing}`, { ...form, amount: parseFloat(form.amount) }); toast.success('Updated'); }
      else { await API.post('/api/fees', { ...form, amount: parseFloat(form.amount) }); toast.success('Fee record created'); }
      setShowModal(false); setEditing(null); setForm({ student: '', amount: '', dueDate: '', description: 'Tuition Fee' }); fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await API.patch(`/api/fees/${id}/status`, { paymentStatus: status, paidDate: status === 'paid' ? new Date() : null });
      toast.success(`Marked as ${status}`); fetchData();
    } catch (err) { toast.error('Failed'); }
  };

  const ic = "w-full px-4 py-3 bg-black border border-[#2a2a2a] rounded-xl text-white placeholder-gray-600 text-sm focus:border-cyan-500";
  const statusColors = { paid: 'bg-emerald-500/10 text-emerald-400', pending: 'bg-amber-500/10 text-amber-400', overdue: 'bg-red-500/10 text-red-400' };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-white">Fee Management</h1><p className="text-gray-600 text-sm">Manage student fee records</p></div>
        <button onClick={() => { setEditing(null); setForm({ student: '', amount: '', dueDate: '', description: 'Tuition Fee' }); setShowModal(true); }} className="px-6 py-2.5 gradient-cyan rounded-xl text-white font-semibold hover:opacity-90 flex items-center gap-2 self-start"><HiPlus className="w-5 h-5" /> Add Fee</button>
      </div>

      <div className="flex gap-2">
        {['', 'paid', 'pending', 'overdue'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f ? 'bg-cyan-500 text-white' : 'bg-[#111111] border border-[#2a2a2a] text-gray-500'}`}>
            {f === '' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-16" />)}</div> : fees.length === 0 ? (
        <div className="glass p-12 text-center"><HiCurrencyRupee className="w-12 h-12 text-gray-700 mx-auto mb-3" /><p className="text-gray-500">No fee records found</p></div>
      ) : (
        <div className="glass overflow-hidden">
          <table className="w-full">
            <thead><tr className="border-b border-[#2a2a2a]">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Student</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Due Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Receipt</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-[#1a1a1a]">
              {fees.map(f => (
                <tr key={f._id} className="hover:bg-[#0a0a0a]">
                  <td className="px-4 py-3 text-sm text-white">{f.student?.user?.name || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm font-medium text-cyan-400">₹{f.amount?.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{f.dueDate ? new Date(f.dueDate).toLocaleDateString('en-IN') : '-'}</td>
                  <td className="px-4 py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[f.paymentStatus] || 'bg-gray-500/10 text-gray-400'}`}>{f.paymentStatus}</span></td>
                  <td className="px-4 py-3 text-xs font-mono text-gray-500">{f.receiptNumber || '-'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {f.paymentStatus !== 'paid' && <button onClick={() => handleStatusUpdate(f._id, 'paid')} className="px-2.5 py-1 rounded-lg text-xs bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20">Mark Paid</button>}
                      {f.paymentStatus === 'pending' && <button onClick={() => handleStatusUpdate(f._id, 'overdue')} className="px-2.5 py-1 rounded-lg text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20">Overdue</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-white mb-6">Add Fee Record</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm text-gray-500 mb-1">Student *</label>
                <select name="student" value={form.student} onChange={e => setForm({ ...form, student: e.target.value })} className={ic}>
                  <option value="">Select student</option>
                  {students.map(s => <option key={s._id} value={s._id}>{s.user?.name} - {s.rollNumber}</option>)}
                </select></div>
              <div><label className="block text-sm text-gray-500 mb-1">Amount (₹) *</label>
                <input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="50000" className={ic} /></div>
              <div><label className="block text-sm text-gray-500 mb-1">Due Date *</label>
                <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} className={ic} /></div>
              <div><label className="block text-sm text-gray-500 mb-1">Description</label>
                <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className={ic} /></div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 py-3 gradient-cyan rounded-xl text-white font-semibold">Create</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 bg-[#181818] border border-[#2a2a2a] rounded-xl text-gray-400">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeManagement;
