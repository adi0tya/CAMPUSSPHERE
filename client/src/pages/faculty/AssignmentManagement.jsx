import { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { HiPlus, HiTrash, HiDocumentText, HiEye } from 'react-icons/hi2';
import EmptyState from '../../components/common/EmptyState';

const ic = "w-full px-4 py-3 bg-black border border-[#2a2a2a] rounded-xl text-white placeholder-gray-600 text-sm focus:border-cyan-500 outline-none";

const AssignmentManagement = () => {
  const [assignments, setAssignments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [viewSubmissions, setViewSubmissions] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', subject: '', deadline: '', semester: 1 });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [a, s] = await Promise.all([API.get('/api/assignments'), API.get('/api/subjects')]);
      setAssignments(a.data.assignments);
      setSubjects(s.data.subjects);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.subject || !form.deadline) return toast.error('Fill required fields');
    try {
      await API.post('/api/assignments', form);
      toast.success('Assignment created');
      setShowModal(false);
      setForm({ title: '', description: '', subject: '', deadline: '', semester: 1 });
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this assignment?')) return;
    try { await API.delete(`/api/assignments/${id}`); toast.success('Deleted'); fetchData(); } catch { toast.error('Failed'); }
  };

  const loadSubmissions = async (id) => {
    try {
      const { data } = await API.get(`/api/assignments/${id}/submissions`);
      setSubmissions(data.submissions);
      setViewSubmissions(id);
    } catch { toast.error('Failed to load submissions'); }
  };

  const isOverdue = (deadline) => new Date(deadline) < new Date();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-white">Assignments</h1><p className="text-gray-600 text-sm">Create and manage assignments</p></div>
        <button onClick={() => setShowModal(true)} className="px-6 py-2.5 gradient-cyan rounded-xl text-white font-semibold hover:opacity-90 flex items-center gap-2 self-start">
          <HiPlus className="w-5 h-5" /> Create Assignment
        </button>
      </div>

      {loading ? <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-24" />)}</div> : assignments.length === 0 ? (
        <EmptyState title="No assignments" message="Create your first assignment." icon={HiDocumentText} />
      ) : (
        <div className="space-y-4">
          {assignments.map(a => (
            <div key={a._id} className="glass p-5 card-hover">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-base font-semibold text-white">{a.title}</h3>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${isOverdue(a.deadline) ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>
                      {isOverdue(a.deadline) ? 'Overdue' : 'Active'}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm">{a.subject?.name} ({a.subject?.code})</p>
                  {a.description && <p className="text-gray-600 text-xs mt-1">{a.description}</p>}
                  <p className="text-gray-600 text-xs mt-2">Deadline: {new Date(a.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => loadSubmissions(a._id)} className="p-2 rounded-lg hover:bg-cyan-500/10 text-gray-500 hover:text-cyan-400 transition-colors" title="View Submissions"><HiEye className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(a._id)} className="p-2 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-colors"><HiTrash className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-white mb-6">Create Assignment</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm text-gray-500 mb-1">Title *</label><input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Assignment title" className={ic} /></div>
              <div><label className="block text-sm text-gray-500 mb-1">Description</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Instructions..." className={`${ic} h-24 resize-none`} /></div>
              <div><label className="block text-sm text-gray-500 mb-1">Subject *</label>
                <select value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className={ic}>
                  <option value="">Select Subject</option>
                  {subjects.map(s => <option key={s._id} value={s._id}>{s.name} ({s.code})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm text-gray-500 mb-1">Semester</label>
                  <select value={form.semester} onChange={e => setForm({...form, semester: parseInt(e.target.value)})} className={ic}>
                    {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Sem {s}</option>)}
                  </select>
                </div>
                <div><label className="block text-sm text-gray-500 mb-1">Deadline *</label><input type="datetime-local" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} className={ic} /></div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 py-3 gradient-cyan rounded-xl text-white font-semibold">Create</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 bg-[#181818] border border-[#2a2a2a] rounded-xl text-gray-400">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewSubmissions && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setViewSubmissions(null)}>
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-white mb-4">Submissions ({submissions.length})</h2>
            {submissions.length === 0 ? <p className="text-gray-600 text-center py-8">No submissions yet</p> : (
              <div className="space-y-3">
                {submissions.map(s => (
                  <div key={s._id} className="flex items-center justify-between p-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-white">{s.student?.user?.name}</p>
                      <p className="text-xs text-gray-500">{new Date(s.submittedAt).toLocaleDateString('en-IN')}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${s.status === 'submitted' ? 'bg-emerald-500/10 text-emerald-400' : s.status === 'late' ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-500/10 text-blue-400'}`}>{s.status}</span>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => setViewSubmissions(null)} className="mt-4 w-full py-2.5 bg-[#181818] border border-[#2a2a2a] rounded-xl text-gray-400">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentManagement;
