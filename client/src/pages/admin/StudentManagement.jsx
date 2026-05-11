import { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { HiPlus, HiPencil, HiTrash, HiUsers, HiMagnifyingGlass } from 'react-icons/hi2';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';

const ic = "w-full px-4 py-3 bg-black border border-[#2a2a2a] rounded-xl text-white placeholder-gray-600 text-sm focus:border-cyan-500 outline-none";

const defaultForm = { name: '', email: '', phone: '', password: '', rollNumber: '', department: '', semester: 1, section: 'A', admissionYear: new Date().getFullYear(), parentName: '', address: '' };

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [semFilter, setSemFilter] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => { fetchStudents(); }, [page, deptFilter, semFilter]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };
      if (deptFilter) params.department = deptFilter;
      if (semFilter) params.semester = semFilter;
      if (search) params.search = search;
      const { data } = await API.get('/api/students', { params });
      setStudents(data.students);
      setPagination(data.pagination);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchStudents(); };

  const openCreate = () => { setEditing(null); setForm(defaultForm); setShowModal(true); };
  const openEdit = (s) => {
    setEditing(s._id);
    setForm({ name: s.user?.name || '', email: s.user?.email || '', phone: s.user?.phone || '', password: '', rollNumber: s.rollNumber, department: s.department, semester: s.semester, section: s.section, admissionYear: s.admissionYear, parentName: s.parentName || '', address: s.address || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.rollNumber || !form.department) return toast.error('Fill required fields');
    try {
      if (editing) {
        await API.put(`/api/students/${editing}`, form);
        toast.success('Student updated');
      } else {
        if (!form.password) return toast.error('Password is required');
        await API.post('/api/students', form);
        toast.success('Student created');
      }
      setShowModal(false);
      fetchStudents();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student? This cannot be undone.')) return;
    try { await API.delete(`/api/students/${id}`); toast.success('Deleted'); fetchStudents(); }
    catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-white">Student Management</h1><p className="text-gray-600 text-sm">Manage all enrolled students</p></div>
        <button onClick={openCreate} className="px-6 py-2.5 gradient-cyan rounded-xl text-white font-semibold hover:opacity-90 flex items-center gap-2 self-start">
          <HiPlus className="w-5 h-5" /> Add Student
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..." className="w-full pl-10 pr-4 py-2.5 bg-[#111111] border border-[#2a2a2a] rounded-xl text-white text-sm placeholder-gray-600 focus:border-cyan-500 outline-none" />
        </form>
        <input value={deptFilter} onChange={e => { setDeptFilter(e.target.value); setPage(1); }} placeholder="Filter by department" className="px-4 py-2.5 bg-[#111111] border border-[#2a2a2a] rounded-xl text-white text-sm placeholder-gray-600 focus:border-cyan-500 outline-none w-48" />
        <select value={semFilter} onChange={e => { setSemFilter(e.target.value); setPage(1); }} className="px-4 py-2.5 bg-[#111111] border border-[#2a2a2a] rounded-xl text-white text-sm">
          <option value="">All Semesters</option>
          {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Sem {s}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-16 w-full" />)}</div>
      ) : students.length === 0 ? (
        <EmptyState title="No students found" message="Add your first student to get started." icon={HiUsers} />
      ) : (
        <div className="glass overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-[#2a2a2a]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Student</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Roll No.</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Department</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Semester</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-[#1a1a1a]">
                {students.map(s => (
                  <tr key={s._id} className="hover:bg-[#0a0a0a] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg gradient-cyan flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {s.user?.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm text-white font-medium">{s.user?.name}</p>
                          <p className="text-xs text-gray-600">{s.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-cyan-400">{s.rollNumber}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{s.department}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">Sem {s.semester} - {s.section}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${s.user?.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                        {s.user?.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(s)} className="p-2 rounded-lg hover:bg-cyan-500/10 text-gray-500 hover:text-cyan-400 transition-colors"><HiPencil className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(s._id)} className="p-2 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-colors"><HiTrash className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-[#2a2a2a]">
              <p className="text-sm text-gray-500">Page {pagination.current} of {pagination.pages} ({pagination.total} total)</p>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 bg-[#181818] border border-[#2a2a2a] rounded-lg text-sm text-gray-400 disabled:opacity-40">Prev</button>
                <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages} className="px-3 py-1.5 bg-[#181818] border border-[#2a2a2a] rounded-lg text-sm text-gray-400 disabled:opacity-40">Next</button>
              </div>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-white mb-6">{editing ? 'Edit Student' : 'Add Student'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm text-gray-500 mb-1">Full Name *</label><input name="name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className={ic} /></div>
                <div><label className="block text-sm text-gray-500 mb-1">Email *</label><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className={ic} /></div>
                <div><label className="block text-sm text-gray-500 mb-1">Phone</label><input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className={ic} /></div>
                {!editing && <div><label className="block text-sm text-gray-500 mb-1">Password *</label><input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="Min 6 chars" className={ic} /></div>}
                <div><label className="block text-sm text-gray-500 mb-1">Roll Number *</label><input value={form.rollNumber} onChange={e => setForm({...form, rollNumber: e.target.value})} className={ic} /></div>
                <div><label className="block text-sm text-gray-500 mb-1">Department *</label><input value={form.department} onChange={e => setForm({...form, department: e.target.value})} placeholder="e.g. Computer Science" className={ic} /></div>
                <div><label className="block text-sm text-gray-500 mb-1">Semester *</label>
                  <select value={form.semester} onChange={e => setForm({...form, semester: parseInt(e.target.value)})} className={ic}>
                    {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                  </select>
                </div>
                <div><label className="block text-sm text-gray-500 mb-1">Section</label><input value={form.section} onChange={e => setForm({...form, section: e.target.value})} placeholder="A" className={ic} /></div>
                <div><label className="block text-sm text-gray-500 mb-1">Admission Year *</label><input type="number" value={form.admissionYear} onChange={e => setForm({...form, admissionYear: parseInt(e.target.value)})} className={ic} /></div>
                <div><label className="block text-sm text-gray-500 mb-1">Parent Name</label><input value={form.parentName} onChange={e => setForm({...form, parentName: e.target.value})} className={ic} /></div>
              </div>
              <div><label className="block text-sm text-gray-500 mb-1">Address</label><textarea value={form.address} onChange={e => setForm({...form, address: e.target.value})} className={`${ic} h-20 resize-none`} /></div>
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

export default StudentManagement;
