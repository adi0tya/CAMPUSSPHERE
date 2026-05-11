import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { HiCalendarDays } from 'react-icons/hi2';
import EmptyState from '../../components/common/EmptyState';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const dayColors = { Monday: 'text-cyan-400', Tuesday: 'text-indigo-400', Wednesday: 'text-emerald-400', Thursday: 'text-amber-400', Friday: 'text-purple-400', Saturday: 'text-pink-400' };

const MyTimetable = () => {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/api/timetable/my').then(({ data }) => setTimetable(data.timetable)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" /></div>;

  const grouped = DAYS.reduce((acc, day) => { acc[day] = timetable.filter(t => t.day === day); return acc; }, {});

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">My Timetable</h1><p className="text-gray-600 text-sm">Your weekly teaching schedule</p></div>
      {timetable.length === 0 ? <EmptyState title="No timetable assigned" icon={HiCalendarDays} /> : (
        <div className="space-y-4">
          {DAYS.map(day => grouped[day].length > 0 && (
            <div key={day} className="glass overflow-hidden">
              <div className="px-5 py-3 border-b border-[#2a2a2a]">
                <h3 className={`text-sm font-bold ${dayColors[day]}`}>{day}</h3>
              </div>
              <div className="divide-y divide-[#1a1a1a]">
                {grouped[day].map(t => (
                  <div key={t._id} className="px-5 py-4 flex items-center gap-4 hover:bg-[#0a0a0a]">
                    <div className="text-center min-w-[80px]">
                      <p className="text-sm text-cyan-400 font-medium">{t.startTime}</p>
                      <p className="text-xs text-gray-600">to {t.endTime}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{t.subject?.name}</p>
                      <p className="text-xs text-gray-500">{t.room || 'No room'} • Semester {t.semester}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTimetable;
