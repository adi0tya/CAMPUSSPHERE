import { useState, useEffect } from 'react';
import API from '../../api/axios';
import StatCard from '../../components/common/StatCard';
import { HiClipboardDocumentList, HiDocumentText, HiCurrencyRupee, HiCalendarDays } from 'react-icons/hi2';

const StudentDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [attendance, setAttendance] = useState({ summary: [] });
  const [fees, setFees] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [p, att, f, a] = await Promise.all([
        API.get('/api/students/me'),
        API.get('/api/attendance/my'),
        API.get('/api/fees/my'),
        API.get('/api/assignments')
      ]);
      setProfile(p.data.student);
      setAttendance(att.data);
      setFees(f.data.fees);
      setAssignments(a.data.assignments);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" /></div>;

  const avgAttendance = attendance.summary.length > 0
    ? (attendance.summary.reduce((s, a) => s + parseFloat(a.percentage), 0) / attendance.summary.length).toFixed(1)
    : 0;
  const pendingFees = fees.filter(f => f.paymentStatus !== 'paid').length;
  const pendingAssignments = assignments.filter(a => new Date(a.deadline) > new Date()).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Student Dashboard</h1>
        <p className="text-gray-600 text-sm">{profile?.department} • Semester {profile?.semester} • {profile?.rollNumber}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Avg Attendance" value={`${avgAttendance}%`} icon={HiClipboardDocumentList} color={parseFloat(avgAttendance) >= 75 ? 'success' : 'danger'} />
        <StatCard title="Assignments" value={pendingAssignments} icon={HiDocumentText} color="info" />
        <StatCard title="Pending Fees" value={pendingFees} icon={HiCurrencyRupee} color={pendingFees > 0 ? 'warning' : 'success'} />
        <StatCard title="Semester" value={`Sem ${profile?.semester}`} icon={HiCalendarDays} color="primary" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass p-6">
          <h3 className="text-base font-semibold text-white mb-4">Attendance by Subject</h3>
          {attendance.summary.length === 0 ? <p className="text-gray-600 text-center py-8">No attendance records</p> : (
            <div className="space-y-3">
              {attendance.summary.map((s, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{s.subject?.name}</span>
                    <span className={parseFloat(s.percentage) >= 75 ? 'text-emerald-400' : 'text-red-400'}>{s.percentage}%</span>
                  </div>
                  <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${parseFloat(s.percentage) >= 75 ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${s.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass p-6">
          <h3 className="text-base font-semibold text-white mb-4">Upcoming Assignments</h3>
          {assignments.filter(a => new Date(a.deadline) > new Date()).length === 0 ? (
            <p className="text-gray-600 text-center py-8">No upcoming assignments</p>
          ) : (
            <div className="space-y-3">
              {assignments.filter(a => new Date(a.deadline) > new Date()).slice(0, 5).map(a => (
                <div key={a._id} className="flex items-center justify-between p-3 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-white">{a.title}</p>
                    <p className="text-xs text-gray-500">{a.subject?.name}</p>
                  </div>
                  <p className="text-xs text-amber-400">{new Date(a.deadline).toLocaleDateString('en-IN')}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
