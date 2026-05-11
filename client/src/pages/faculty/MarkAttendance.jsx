import { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { HiClipboardDocumentList } from 'react-icons/hi2';
import EmptyState from '../../components/common/EmptyState';

const MarkAttendance = () => {
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchSubjects(); }, []);

  const fetchSubjects = async () => {
    try {
      const { data } = await API.get('/api/subjects');
      setSubjects(data.subjects);
    } catch (err) { console.error(err); }
  };

  const fetchStudents = async () => {
    if (!selectedSemester) return;
    try {
      setLoading(true);
      const { data } = await API.get('/api/students', { params: { semester: selectedSemester, limit: 100 } });
      setStudents(data.students);
      const initial = {};
      data.students.forEach(s => { initial[s._id] = 'present'; });
      setAttendance(initial);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (selectedSemester) fetchStudents(); }, [selectedSemester]);

  const handleStatusChange = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const markAll = (status) => {
    const updated = {};
    students.forEach(s => { updated[s._id] = status; });
    setAttendance(updated);
  };

  const handleSubmit = async () => {
    if (!selectedSubject || !selectedSemester) return toast.error('Select subject and semester');
    if (students.length === 0) return toast.error('No students found');
    setSubmitting(true);
    try {
      const records = students.map(s => ({ studentId: s._id, status: attendance[s._id] || 'absent' }));
      await API.post('/api/attendance/mark', { records, subjectId: selectedSubject, date, semester: parseInt(selectedSemester) });
      toast.success('Attendance marked successfully');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSubmitting(false); }
  };

  const statusColors = { present: 'bg-emerald-500 text-white', absent: 'bg-red-500 text-white', late: 'bg-amber-500 text-white' };
  const statusBtnColors = { present: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', absent: 'bg-red-500/10 text-red-400 border-red-500/20', late: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };

  const presentCount = Object.values(attendance).filter(s => s === 'present').length;
  const absentCount = Object.values(attendance).filter(s => s === 'absent').length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div><h1 className="text-2xl font-bold text-white">Mark Attendance</h1><p className="text-gray-600 text-sm">Record student attendance for a class</p></div>

      <div className="glass p-6 space-y-4">
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">Semester *</label>
            <select value={selectedSemester} onChange={e => setSelectedSemester(e.target.value)} className="w-full px-4 py-3 bg-black border border-[#2a2a2a] rounded-xl text-white text-sm focus:border-cyan-500 outline-none">
              <option value="">Select Semester</option>
              {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Subject *</label>
            <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} className="w-full px-4 py-3 bg-black border border-[#2a2a2a] rounded-xl text-white text-sm focus:border-cyan-500 outline-none">
              <option value="">Select Subject</option>
              {subjects.filter(s => !selectedSemester || s.semester === parseInt(selectedSemester)).map(s => <option key={s._id} value={s._id}>{s.name} ({s.code})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Date *</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-4 py-3 bg-black border border-[#2a2a2a] rounded-xl text-white text-sm focus:border-cyan-500 outline-none" />
          </div>
        </div>
      </div>

      {loading ? <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-14" />)}</div> : students.length === 0 ? (
        <EmptyState title="Select semester to load students" icon={HiClipboardDocumentList} />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-3 text-sm">
              <span className="text-emerald-400">{presentCount} Present</span>
              <span className="text-red-400">{absentCount} Absent</span>
              <span className="text-gray-500">{students.length} Total</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => markAll('present')} className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-medium">All Present</button>
              <button onClick={() => markAll('absent')} className="px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-xs font-medium">All Absent</button>
            </div>
          </div>

          <div className="glass overflow-hidden">
            <table className="w-full">
              <thead><tr className="border-b border-[#2a2a2a]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Student</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Roll No.</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              </tr></thead>
              <tbody className="divide-y divide-[#1a1a1a]">
                {students.map(s => (
                  <tr key={s._id} className="hover:bg-[#0a0a0a]">
                    <td className="px-4 py-3 text-sm text-white">{s.user?.name}</td>
                    <td className="px-4 py-3 text-sm font-mono text-cyan-400">{s.rollNumber}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {['present', 'absent', 'late'].map(status => (
                          <button key={status} onClick={() => handleStatusChange(s._id, status)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize border transition-all ${attendance[s._id] === status ? statusColors[status] : 'bg-[#181818] border-[#2a2a2a] text-gray-500 hover:text-white'}`}>
                            {status}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button onClick={handleSubmit} disabled={submitting} className="w-full py-3 gradient-cyan rounded-xl text-white font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
            {submitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Submit Attendance'}
          </button>
        </div>
      )}
    </div>
  );
};

export default MarkAttendance;
