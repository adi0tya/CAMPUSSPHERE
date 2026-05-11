import { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { HiDocumentText, HiArrowUpTray } from 'react-icons/hi2';
import EmptyState from '../../components/common/EmptyState';

const MyAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(null);
  const [fileUrl, setFileUrl] = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [a, s] = await Promise.all([API.get('/api/assignments'), API.get('/api/assignments/my-submissions')]);
      setAssignments(a.data.assignments);
      setSubmissions(s.data.submissions);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const getSubmission = (assignmentId) => submissions.find(s => s.assignment?._id === assignmentId || s.assignment === assignmentId);

  const handleSubmit = async (assignmentId) => {
    try {
      await API.post(`/api/assignments/${assignmentId}/submit`, { fileUrl });
      toast.success('Assignment submitted');
      setSubmitting(null);
      setFileUrl('');
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const isOverdue = (deadline) => new Date(deadline) < new Date();

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">My Assignments</h1><p className="text-gray-600 text-sm">View and submit assignments</p></div>

      {assignments.length === 0 ? <EmptyState title="No assignments" icon={HiDocumentText} /> : (
        <div className="space-y-4">
          {assignments.map(a => {
            const sub = getSubmission(a._id);
            const overdue = isOverdue(a.deadline);
            return (
              <div key={a._id} className="glass p-5 card-hover">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-base font-semibold text-white">{a.title}</h3>
                      {sub ? (
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${sub.status === 'late' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                          {sub.status === 'late' ? 'Submitted Late' : 'Submitted'}
                        </span>
                      ) : (
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${overdue ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>
                          {overdue ? 'Overdue' : 'Pending'}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm">{a.subject?.name} ({a.subject?.code})</p>
                    {a.description && <p className="text-gray-600 text-xs mt-1">{a.description}</p>}
                    <p className="text-gray-600 text-xs mt-2">
                      Deadline: <span className={overdue ? 'text-red-400' : 'text-amber-400'}>{new Date(a.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </p>
                  </div>
                  {!sub && !overdue && (
                    <button onClick={() => setSubmitting(submitting === a._id ? null : a._id)} className="px-4 py-2 gradient-cyan rounded-xl text-white text-sm font-medium flex items-center gap-2 flex-shrink-0">
                      <HiArrowUpTray className="w-4 h-4" /> Submit
                    </button>
                  )}
                </div>

                {submitting === a._id && (
                  <div className="mt-4 pt-4 border-t border-[#2a2a2a] space-y-3 animate-fade-in">
                    <input value={fileUrl} onChange={e => setFileUrl(e.target.value)} placeholder="Paste file URL or Google Drive link" className="w-full px-4 py-3 bg-black border border-[#2a2a2a] rounded-xl text-white text-sm focus:border-cyan-500 outline-none" />
                    <div className="flex gap-3">
                      <button onClick={() => handleSubmit(a._id)} className="flex-1 py-2.5 gradient-cyan rounded-xl text-white text-sm font-semibold">Submit Assignment</button>
                      <button onClick={() => setSubmitting(null)} className="flex-1 py-2.5 bg-[#181818] border border-[#2a2a2a] rounded-xl text-gray-400 text-sm">Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyAssignments;
