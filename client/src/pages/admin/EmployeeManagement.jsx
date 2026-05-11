import { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { HiPlus, HiUsers } from 'react-icons/hi2';
import EmptyState from '../../components/common/EmptyState';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '', employeeType: 'warehouse', phone: '', vehicleNumber: '' });

  useEffect(() => { fetchEmployees(); }, [filter]);
  const fetchEmployees = async () => { try { const params = {}; if (filter) params.employeeType = filter; const { data } = await API.get('/api/employees', { params }); setEmployees(data.employees); } catch (err) { console.error(err); } finally { setLoading(false); } };
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Fill required fields');
    try { await API.post('/api/auth/create-employee', form); toast.success('Created'); setShowModal(false); setForm({ name: '', email: '', password: '', employeeType: 'warehouse', phone: '', vehicleNumber: '' }); fetchEmployees(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const toggleStatus = async (id) => { try { await API.put(`/api/employees/${id}/toggle-status`); toast.success('Updated'); fetchEmployees(); } catch { toast.error('Failed'); } };

  const ic = "w-full px-4 py-3 bg-black border border-[#2a2a2a] rounded-xl text-white placeholder-gray-600 text-sm focus:border-cyan-500";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-white">Employees</h1><p className="text-gray-600 text-sm">Manage your team</p></div>
        <button onClick={() => setShowModal(true)} className="px-6 py-2.5 gradient-cyan rounded-xl text-white font-semibold hover:opacity-90 flex items-center gap-2 self-start"><HiPlus className="w-5 h-5" /> Add</button>
      </div>

      <div className="flex gap-2">
        {['', 'warehouse', 'driver'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f ? 'bg-cyan-500 text-white' : 'bg-[#111111] border border-[#2a2a2a] text-gray-500 hover:text-white'}`}>
            {f === '' ? 'All' : f === 'warehouse' ? 'Warehouse' : 'Drivers'}
          </button>
        ))}
      </div>

      {loading ? <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-20" />)}</div> : employees.length === 0 ? <EmptyState title="No employees" icon={HiUsers} /> : (
        <div className="glass overflow-hidden">
          <table className="w-full">
            <thead><tr className="border-b border-[#2a2a2a]">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-[#1a1a1a]">
              {employees.map(emp => (
                <tr key={emp._id} className="hover:bg-[#0a0a0a]">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg gradient-cyan flex items-center justify-center text-white text-sm font-bold">{emp.name.charAt(0)}</div>
                    <span className="text-sm text-white font-medium">{emp.name}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">{emp.email}</td>
                  <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${emp.employeeType === 'driver' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>{emp.employeeType}</span></td>
                  <td className="px-6 py-4 text-sm text-gray-500">{emp.phone || '-'}</td>
                  <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${emp.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>{emp.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td className="px-6 py-4"><button onClick={() => toggleStatus(emp._id)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${emp.isActive ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'}`}>{emp.isActive ? 'Deactivate' : 'Activate'}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-white mb-6">Create Employee</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div><label className="block text-sm text-gray-500 mb-1">Name *</label><input name="name" value={form.name} onChange={handleChange} className={ic} /></div>
              <div><label className="block text-sm text-gray-500 mb-1">Email *</label><input name="email" type="email" value={form.email} onChange={handleChange} className={ic} /></div>
              <div><label className="block text-sm text-gray-500 mb-1">Password *</label><input name="password" type="password" value={form.password} onChange={handleChange} className={ic} /></div>
              <div><label className="block text-sm text-gray-500 mb-1">Type *</label><select name="employeeType" value={form.employeeType} onChange={handleChange} className={ic}><option value="warehouse">Warehouse</option><option value="driver">Driver</option></select></div>
              <div><label className="block text-sm text-gray-500 mb-1">Phone</label><input name="phone" value={form.phone} onChange={handleChange} className={ic} /></div>
              {form.employeeType === 'driver' && <div><label className="block text-sm text-gray-500 mb-1">Vehicle Number</label><input name="vehicleNumber" value={form.vehicleNumber} onChange={handleChange} className={ic} /></div>}
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

export default EmployeeManagement;
