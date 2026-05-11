import { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { HiPlus, HiTrash, HiCalendarDays } from 'react-icons/hi2';
import EmptyState from '../../components/common/EmptyState';

const ic = "w-full px-4 py-3 bg-black border border-[#2a2a2a] rounded-xl text-white placeholder-gray-600 text-sm focus:border-cyan-500 outline-none";
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const dayColors = { Monday: 'text-cyan-400', Tuesday: 'text-indigo-400', Wednesday: 'text-emerald-400', Thursday: 'text-amber-400', Friday: 'text-purple-400', Saturday: 'text-pink-400' };

const TimetableManagement = () => {
  const [timetable, setTimetable] = useState([]);
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ course: '', semester: 1, subject: '', faculty: '', day: 'Monday', startTime: '09:00', endTime: '10:00', room: '' });
  const [filterSem, setFilterSem] = useState('');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterSem) params.semester = filterSem;
      const [tt, c, s, f] = await Promise.all([API.get('/api/timetable', { params }), API.get('/api/courses'), API.get('/api/subjects'), API.get('/api/faculty')]);
      setTimetable(tt.data.timetable);
      setCourses(c.data.courses);
      setSubjects(s.data.subjects);
      setFaculty(f.data.faculty);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.course || !form.subject || !form.faculty) return toast.error('Fill required fields');
    try {
      await API.post('/api/timetable', form);
      toast.success('Timetable entry added');
      setShowModal(false);
      fetchAll();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this entry?')) return;
    try { await API.delete(`/api/timetable/${id}`); toast.success('Removed'); fetchAll(); } catch { toast.error('Failed'); }
  };

  const grouped = DAYS.reduce((acc, day) => {
    acc[day] = timetable.filter(t => t.day === day);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-white">Timetable Management</h1><p className="text-gray-600 text-sm">Schedule classes and sessions</p></div>
        <button onClick={() => setShowModal(true)} className="px-6 py-2.5 gradient-cyan rounded-xl text-white font-semibold hover:opacity-90 flex items-center gap-2 self-start">
          <HiPlus className="w-5 h-5" /> Add Entry
        </button>
      </div>

      <div className="flex gap-2">
        <button onClick={() => { setFilterSem(''); fetchAll(); }} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${!filterSem ? 'bg-cyan-500 text-white' : 'bg-[#111111] border border-[#2a2a2a] text-gray-500'}`}>All</button>
        {[1,2,3,4,5,6,7,8].map(s => (
          <button key={s} onClick={() => { setFilterSem(s.toString()); }} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filterSem === s.toString() ? 'bg-cyan-500 text-white' : 'bg-[#111111] border border-[#2a2a2a] text-gray-500'}`}>Sem {s}</button>
        ))}
      </div>

      {loading ? <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-32" />)}</div> : timetable.length === 0 ? (
        <EmptyState title="No timetable entries" icon={HiCalendarDays} />
      ) : (
        <div className="space-y-4">
          {DAYS.map(day => grouped[day].length > 0 && (
            <div key={day} className="glass overflow-hidden">
              <div className="px-5 py-3 border-b border-[#2a2a2a]">
                <h3 className={`text-sm font-bold ${dayColors[day]}`}>{day}</h3>
              </div>
              <div className="divide-y divide-[#1a1a1a]">
                {grouped[day].map(t => (
                  <div key={t._id} className="px-5 py-3 flex items-center justify-between hover:bg-[#0a0a0a]">
                    <div className="flex items-center gap-4">
                      <div className="text-center min-w-[80px]">
                        <p className="text-xs text-gray-600">{t.startTime}</p>
                        <p className="text-xs text-gray-700">—</p>
                        <p className="text-xs text-gray-600">{t.endTime}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{t.subject?.name}</p>
                        <p className="text-xs text-gray-500">{t.faculty?.user?.name} • {t.room || 'No room'} • Sem {t.semester}</p>
                      </div>
                    </div>
                    <button onClick={() => handleDelete(t._id)} className="p-2 rounded-lg hover:bg-red-500/10 text-gray-600 hover:text-red-400 transition-colors"><HiTrash className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-white mb-6">Add Timetable Entry</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm text-gray-500 mb-1">Course *</label>
                <select value={form.course} onChange={e => setForm({...form, course: e.target.value})} className={ic}>
                  <option value="">Select Course</option>
                  {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div><label className="block text-sm text-gray-500 mb-1">Semester *</label>
                <select value={form.semester} onChange={e => setForm({...form, semester: parseInt(e.target.value)})} className={ic}>
                  {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                </select>
              </div>
              <div><label className="block text-sm text-gray-500 mb-1">Subject *</label>
                <select value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className={ic}>
                  <option value="">Select Subject</option>
                  {subjects.filter(s => !form.semester || s.semester === form.semester).map(s => <option key={s._id} value={s._id}>{s.name} ({s.code})</option>)}
                </select>
              </div>
              <div><label className="block text-sm text-gray-500 mb-1">Faculty *</label>
                <select value={form.faculty} onChange={e => setForm({...form, faculty: e.target.value})} className={ic}>
                  <option value="">Select Faculty</option>
                  {faculty.map(f => <option key={f._id} value={f._id}>{f.user?.name}</option>)}
                </select>
              </div>
              <div><label className="block text-sm text-gray-500 mb-1">Day *</label>
                <select value={form.day} onChange={e => setForm({...form, day: e.target.value})} className={ic}>
                  {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm text-gray-500 mb-1">Start Time</label><input type="time" value={form.startTime} onChange={e => setForm({...form, startTime: e.target.value})} className={ic} /></div>
                <div><label className="block text-sm text-gray-500 mb-1">End Time</label><input type="time" value={form.endTime} onChange={e => setForm({...form, endTime: e.target.value})} className={ic} /></div>
              </div>
              <div><label className="block text-sm text-gray-500 mb-1">Room</label><input value={form.room} onChange={e => setForm({...form, room: e.target.value})} placeholder="e.g. Room 101" className={ic} /></div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 py-3 gradient-cyan rounded-xl text-white font-semibold">Add Entry</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 bg-[#181818] border border-[#2a2a2a] rounded-xl text-gray-400">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimetableManagement;
