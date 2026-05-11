import { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { HiPlus, HiPencil, HiTrash, HiAcademicCap, HiMagnifyingGlass } from 'react-icons/hi2';
import EmptyState from '../../components/common/EmptyState';

const ic = "w-full px-4 py-3 bg-black border border-[#2a2a2a] rounded-xl text-white placeholder-gray-600 text-sm focus:border-cyan-500 outline-none";
const defaultForm = { name: '', email: '', phone: '', password: '', employeeId: '', department: '', designation: 'Assistant Professor' };

const FacultyManagement = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');

  useEffect(() => { fetchFaculty(); }, [deptFilter]);

  const fetchFaculty = async () => {
    try {
      setLoading(true);
      const params = {};
      if (deptFilter) params.department = deptFilter;
      if (search) params.search = search;
      const { data } = await API.get('/api/faculty', { params });
      setFaculty(data.faculty);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSearch = (e) => { e.preventDefault(); fetchFaculty(); };

  const openCreate = () => { setEditing(null); setForm(defaultForm); setShowModal(true); };
  const openEdit = (f) => {
    setEditing(f._id);
    setForm({ name: f.user?.name || '', email: f.user?.email || '', phone: f.user?.phone || '', password: '', employeeId: f.employeeId, department: f.department, designation: f.designation });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.employeeId || !form.department) return toast.error('Fill required fields');
    try {
      if (editing) { await API.put(`/api/faculty/${editing}`, form); toast.success('Faculty updated'); }
      else { await API.post('/api/faculty', form); toast.success('Faculty created'); }
      setShowModal(false); fetchFaculty();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this faculty member?')) return;
    try { await API.delete(`/api/faculty/${id}`); toast.success('Deleted'); fetchFaculty(); }
    catch { toast.error('Failed'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-white">Faculty Management</h1><p className="text-gray-600 text-sm">Manage teaching staff</p></div>
        <button onClick={openCreate} className="px-6 py-2.5 gradient-cyan rounded-xl text-white font-semibold hover:opacity-90 flex items-center gap-2 self-start">
          <HiPlus className="w-5 h-5" /> Add Faculty
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..." className="w-full pl-10 pr-4 py-2.5 bg-[#111111] border border-[#2a2a2a] rounded-xl text-white text-sm placeholder-gray-600 focus:border-cyan-500 outline-none" />
        </form>
        <input value={deptFilter} onChange={e => setDeptFilter(e.target.value)} placeholder="Filter by department" className="px-4 py-2.5 bg-[#111111] border border-[#2a2a2a] rounded-xl text-white text-sm placeholder-gray-600 focus:border-cyan-500 outline-none w-48" />
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-20" />)}</div>
      ) : faculty.length === 0 ? (
        <EmptyState title="No faculty found" icon={HiAcademicCap} />
      ) : (
        <div className="glass overflow-hidden">
          <table className="w-full">
            <thead><tr className="border-b border-[#2a2a2a]">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Faculty</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Employee ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Department</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Designation</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Subjects</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-[#1a1a1a]">
              {faculty.map(f => (
                <tr key={f._id} className="hover:bg-[#0a0a0a]">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center text-white text-sm font-bold">{f.user?.name?.charAt(0)}</div>
                      <div>
                        <p className="text-sm text-white font-medium">{f.user?.name}</p>
                        <p className="text-xs text-gray-600">{f.user?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-indigo-400">{f.employeeId}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{f.department}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{f.designation}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{f.subjects?.length || 0} subjects</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(f)} className="p-2 rounded-lg hover:bg-cyan-500/10 text-gray-500 hover:text-cyan-400 transition-colors"><HiPencil className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(f._id)} className="p-2 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-colors"><HiTrash className="w-4 h-4" /></button>
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
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-white mb-6">{editing ? 'Edit Faculty' : 'Add Faculty'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm text-gray-500 mb-1">Full Name *</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className={ic} /></div>
              <div><label className="block text-sm text-gray-500 mb-1">Email *</label><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className={ic} /></div>
              <div><label className="block text-sm text-gray-500 mb-1">Phone</label><input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className={ic} /></div>
              {!editing && <div><label className="block text-sm text-gray-500 mb-1">Password</label><input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="Default: faculty123" className={ic} /></div>}
              <div><label className="block text-sm text-gray-500 mb-1">Employee ID *</label><input value={form.employeeId} onChange={e => setForm({...form, employeeId: e.target.value})} placeholder="e.g. FAC-001" className={ic} /></div>
              <div><label className="block text-sm text-gray-500 mb-1">Department *</label><input value={form.department} onChange={e => setForm({...form, department: e.target.value})} placeholder="e.g. Computer Science" className={ic} /></div>
              <div><label className="block text-sm text-gray-500 mb-1">Designation</label>
                <select value={form.designation} onChange={e => setForm({...form, designation: e.target.value})} className={ic}>
                  <option>Assistant Professor</option>
                  <option>Associate Professor</option>
                  <option>Professor</option>
                  <option>HOD</option>
                  <option>Lecturer</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 py-3 gradient-cyan rounded-xl text-white font-semibold">{editing ? 'Update' : 'Create'}</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 bg-[#181818] border border-[#2a2a2a] rounded-xl text-gray-400">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyManagement;
