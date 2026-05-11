import { useState, useEffect } from 'react';
import API from '../../api/axios';
import StatCard from '../../components/common/StatCard';
import { HiBookOpen, HiClipboardDocumentList, HiDocumentText, HiCalendarDays } from 'react-icons/hi2';

const FacultyDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [p, a, tt] = await Promise.all([
        API.get('/api/faculty/me'),
        API.get('/api/assignments'),
        API.get('/api/timetable/my')
      ]);
      setProfile(p.data.faculty);
      setAssignments(a.data.assignments);
      setTimetable(tt.data.timetable);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" /></div>;

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todayClasses = timetable.filter(t => t.day === today);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Faculty Dashboard</h1>
        <p className="text-gray-600 text-sm">{profile?.department} • {profile?.designation}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="My Subjects" value={profile?.subjects?.length || 0} icon={HiBookOpen} color="primary" />
        <StatCard title="Assignments" value={assignments.length} icon={HiDocumentText} color="info" />
        <StatCard title="Today's Classes" value={todayClasses.length} icon={HiCalendarDays} color="success" />
        <StatCard title="Employee ID" value={profile?.employeeId || '-'} icon={HiClipboardDocumentList} color="warning" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass p-6">
          <h3 className="text-base font-semibold text-white mb-4">Today's Schedule ({today})</h3>
          {todayClasses.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No classes today</p>
          ) : (
            <div className="space-y-3">
              {todayClasses.map(t => (
                <div key={t._id} className="flex items-center gap-4 p-3 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl">
                  <div className="text-center min-w-[60px]">
                    <p className="text-xs text-cyan-400 font-medium">{t.startTime}</p>
                    <p className="text-xs text-gray-600">{t.endTime}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{t.subject?.name}</p>
                    <p className="text-xs text-gray-500">{t.room || 'No room'} • Sem {t.semester}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass p-6">
          <h3 className="text-base font-semibold text-white mb-4">Recent Assignments</h3>
          {assignments.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No assignments created</p>
          ) : (
            <div className="space-y-3">
              {assignments.slice(0, 5).map(a => (
                <div key={a._id} className="flex items-center justify-between p-3 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-white">{a.title}</p>
                    <p className="text-xs text-gray-500">{a.subject?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">Due</p>
                    <p className={`text-xs font-medium ${new Date(a.deadline) < new Date() ? 'text-red-400' : 'text-amber-400'}`}>
                      {new Date(a.deadline).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
