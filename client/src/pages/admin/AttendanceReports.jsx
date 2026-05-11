import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { HiClipboardDocumentList } from 'react-icons/hi2';
import EmptyState from '../../components/common/EmptyState';

const AttendanceReports = () => {
  const [attendance, setAttendance] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subjectFilter, setSubjectFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => { fetchData(); }, [subjectFilter, dateFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = {};
      if (subjectFilter) params.subject = subjectFilter;
      if (dateFilter) params.date = dateFilter;
      const [att, sub] = await Promise.all([API.get('/api/attendance', { params }), API.get('/api/subjects')]);
      setAttendance(att.data.attendance);
      setSubjects(sub.data.subjects);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const statusColors = { present: 'bg-emerald-500/10 text-emerald-400', absent: 'bg-red-500/10 text-red-400', late: 'bg-amber-500/10 text-amber-400' };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">Attendance Reports</h1><p className="text-gray-600 text-sm">View all attendance records</p></div>

      <div className="flex flex-col sm:flex-row gap-3">
        <select value={subjectFilter} onChange={e => setSubjectFilter(e.target.value)} className="px-4 py-2.5 bg-[#111111] border border-[#2a2a2a] rounded-xl text-white text-sm flex-1">
          <option value="">All Subjects</option>
          {subjects.map(s => <option key={s._id} value={s._id}>{s.name} ({s.code})</option>)}
        </select>
        <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="px-4 py-2.5 bg-[#111111] border border-[#2a2a2a] rounded-xl text-white text-sm" />
      </div>

      {loading ? <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-14" />)}</div> : attendance.length === 0 ? (
        <EmptyState title="No attendance records" icon={HiClipboardDocumentList} />
      ) : (
        <div className="glass overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-[#2a2a2a]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Student</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Subject</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Faculty</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              </tr></thead>
              <tbody className="divide-y divide-[#1a1a1a]">
                {attendance.map(a => (
                  <tr key={a._id} className="hover:bg-[#0a0a0a]">
                    <td className="px-4 py-3 text-sm text-white">{a.student?.user?.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{a.subject?.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{a.faculty?.user?.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{new Date(a.date).toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[a.status]}`}>{a.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceReports;
