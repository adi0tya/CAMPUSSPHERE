import { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { HiPlus, HiPencil, HiTrash, HiBookOpen } from 'react-icons/hi2';
import EmptyState from '../../components/common/EmptyState';

const ic = "w-full px-4 py-3 bg-black border border-[#2a2a2a] rounded-xl text-white placeholder-gray-600 text-sm focus:border-cyan-500 outline-none";

const CourseManagement = () => {
  const [tab, setTab] = useState('courses');
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [courseForm, setCourseForm] = useState({ name: '', code: '', department: '', duration: 4, semesters: 8, description: '' });
  const [subjectForm, setSubjectForm] = useState({ name: '', code: '', course: '', semester: 1, faculty: '', credits: 3 });

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [c, s, f] = await Promise.all([API.get('/api/courses'), API.get('/api/subjects'), API.get('/api/faculty')]);
      setCourses(c.data.courses);
      setSubjects(s.data.subjects);
      setFaculty(f.data.faculty);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    if (!courseForm.name || !courseForm.code || !courseForm.department) return toast.error('Fill required fields');
    try {
      if (editing) { await API.put(`/api/courses/${editing}`, courseForm); toast.success('Course updated'); }
      else { await API.post('/api/courses', courseForm); toast.success('Course created'); }
      setShowModal(false); setEditing(null); fetchAll();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleSubjectSubmit = async (e) => {
    e.preventDefault();
    if (!subjectForm.name || !subjectForm.code || !subjectForm.course) return toast.error('Fill required fields');
    try {
      if (editing) { await API.put(`/api/subjects/${editing}`, subjectForm); toast.success('Subject updated'); }
      else { await API.post('/api/subjects', subjectForm); toast.success('Subject created'); }
      setShowModal(false); setEditing(null); fetchAll();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const deleteCourse = async (id) => {
    if (!window.confirm('Delete course?')) return;
    try { await API.delete(`/api/courses/${id}`); toast.success('Deleted'); fetchAll(); } catch { toast.error('Failed'); }
  };

  const deleteSubject = async (id) => {
    if (!window.confirm('Delete subject?')) return;
    try { await API.delete(`/api/subjects/${id}`); toast.success('Deleted'); fetchAll(); } catch { toast.error('Failed'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-white">Courses & Subjects</h1><p className="text-gray-600 text-sm">Manage academic structure</p></div>
        <button onClick={() => { setEditing(null); setCourseForm({ name: '', code: '', department: '', duration: 4, semesters: 8, description: '' }); setSubjectForm({ name: '', code: '', course: '', semester: 1, faculty: '', credits: 3 }); setShowModal(true); }}
          className="px-6 py-2.5 gradient-cyan rounded-xl text-white font-semibold hover:opacity-90 flex items-center gap-2 self-start">
          <HiPlus className="w-5 h-5" /> Add {tab === 'courses' ? 'Course' : 'Subject'}
        </button>
      </div>

      <div className="flex gap-2">
        {['courses', 'subjects'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-5 py-2.5 rounded-xl text-sm font-medium capitalize transition-all ${tab === t ? 'bg-cyan-500 text-white' : 'bg-[#111111] border border-[#2a2a2a] text-gray-500 hover:text-white'}`}>{t}</button>
        ))}
      </div>

      {loading ? <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-16" />)}</div> : (
        tab === 'courses' ? (
          courses.length === 0 ? <EmptyState title="No courses" icon={HiBookOpen} /> : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map(c => (
                <div key={c._id} className="glass p-5 card-hover">
                  <div className="flex items-start justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-cyan-500/10 text-cyan-400">{c.code}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>{c.isActive ? 'Active' : 'Inactive'}</span>
                  </div>
                  <h3 className="text-base font-semibold text-white mb-1">{c.name}</h3>
                  <p className="text-gray-500 text-sm">{c.department}</p>
                  <p className="text-gray-600 text-xs mt-1">{c.duration} years • {c.semesters} semesters</p>
                  <div className="flex gap-2 mt-4 pt-3 border-t border-[#2a2a2a]">
                    <button onClick={() => { setEditing(c._id); setCourseForm({ name: c.name, code: c.code, department: c.department, duration: c.duration, semesters: c.semesters, description: c.description || '' }); setShowModal(true); }} className="flex-1 py-2 bg-[#181818] rounded-lg text-sm text-gray-400 hover:text-cyan-400 flex items-center justify-center gap-1"><HiPencil className="w-3.5 h-3.5" /> Edit</button>
                    <button onClick={() => deleteCourse(c._id)} className="flex-1 py-2 bg-[#181818] rounded-lg text-sm text-gray-400 hover:text-red-400 flex items-center justify-center gap-1"><HiTrash className="w-3.5 h-3.5" /> Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          subjects.length === 0 ? <EmptyState title="No subjects" icon={HiBookOpen} /> : (
            <div className="glass overflow-hidden">
              <table className="w-full">
                <thead><tr className="border-b border-[#2a2a2a]">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Subject</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Code</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Course</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Semester</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Faculty</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr></thead>
                <tbody className="divide-y divide-[#1a1a1a]">
                  {subjects.map(s => (
                    <tr key={s._id} className="hover:bg-[#0a0a0a]">
                      <td className="px-4 py-3 text-sm text-white font-medium">{s.name}</td>
                      <td className="px-4 py-3 text-sm font-mono text-cyan-400">{s.code}</td>
                      <td className="px-4 py-3 text-sm text-gray-400">{s.course?.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-400">Sem {s.semester}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{s.faculty?.user?.name || 'Unassigned'}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => { setEditing(s._id); setSubjectForm({ name: s.name, code: s.code, course: s.course?._id || '', semester: s.semester, faculty: s.faculty?._id || '', credits: s.credits }); setShowModal(true); }} className="p-2 rounded-lg hover:bg-cyan-500/10 text-gray-500 hover:text-cyan-400"><HiPencil className="w-4 h-4" /></button>
                          <button onClick={() => deleteSubject(s._id)} className="p-2 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400"><HiTrash className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-white mb-6">{editing ? 'Edit' : 'Add'} {tab === 'courses' ? 'Course' : 'Subject'}</h2>
            {tab === 'courses' ? (
              <form onSubmit={handleCourseSubmit} className="space-y-4">
                <div><label className="block text-sm text-gray-500 mb-1">Course Name *</label><input value={courseForm.name} onChange={e => setCourseForm({...courseForm, name: e.target.value})} placeholder="e.g. B.Tech Computer Science" className={ic} /></div>
                <div><label className="block text-sm text-gray-500 mb-1">Code *</label><input value={courseForm.code} onChange={e => setCourseForm({...courseForm, code: e.target.value})} placeholder="e.g. BTCS" className={ic} /></div>
                <div><label className="block text-sm text-gray-500 mb-1">Department *</label><input value={courseForm.department} onChange={e => setCourseForm({...courseForm, department: e.target.value})} placeholder="e.g. Computer Science" className={ic} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm text-gray-500 mb-1">Duration (years)</label><input type="number" value={courseForm.duration} onChange={e => setCourseForm({...courseForm, duration: parseInt(e.target.value)})} className={ic} /></div>
                  <div><label className="block text-sm text-gray-500 mb-1">Semesters</label><input type="number" value={courseForm.semesters} onChange={e => setCourseForm({...courseForm, semesters: parseInt(e.target.value)})} className={ic} /></div>
                </div>
                <div><label className="block text-sm text-gray-500 mb-1">Description</label><textarea value={courseForm.description} onChange={e => setCourseForm({...courseForm, description: e.target.value})} className={`${ic} h-20 resize-none`} /></div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex-1 py-3 gradient-cyan rounded-xl text-white font-semibold">{editing ? 'Update' : 'Create'}</button>
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 bg-[#181818] border border-[#2a2a2a] rounded-xl text-gray-400">Cancel</button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubjectSubmit} className="space-y-4">
                <div><label className="block text-sm text-gray-500 mb-1">Subject Name *</label><input value={subjectForm.name} onChange={e => setSubjectForm({...subjectForm, name: e.target.value})} placeholder="e.g. Data Structures" className={ic} /></div>
                <div><label className="block text-sm text-gray-500 mb-1">Code *</label><input value={subjectForm.code} onChange={e => setSubjectForm({...subjectForm, code: e.target.value})} placeholder="e.g. CS301" className={ic} /></div>
                <div><label className="block text-sm text-gray-500 mb-1">Course *</label>
                  <select value={subjectForm.course} onChange={e => setSubjectForm({...subjectForm, course: e.target.value})} className={ic}>
                    <option value="">Select Course</option>
                    {courses.map(c => <option key={c._id} value={c._id}>{c.name} ({c.code})</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm text-gray-500 mb-1">Semester</label>
                    <select value={subjectForm.semester} onChange={e => setSubjectForm({...subjectForm, semester: parseInt(e.target.value)})} className={ic}>
                      {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Sem {s}</option>)}
                    </select>
                  </div>
                  <div><label className="block text-sm text-gray-500 mb-1">Credits</label><input type="number" value={subjectForm.credits} onChange={e => setSubjectForm({...subjectForm, credits: parseInt(e.target.value)})} className={ic} /></div>
                </div>
                <div><label className="block text-sm text-gray-500 mb-1">Assign Faculty</label>
                  <select value={subjectForm.faculty} onChange={e => setSubjectForm({...subjectForm, faculty: e.target.value})} className={ic}>
                    <option value="">Unassigned</option>
                    {faculty.map(f => <option key={f._id} value={f._id}>{f.user?.name} ({f.department})</option>)}
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex-1 py-3 gradient-cyan rounded-xl text-white font-semibold">{editing ? 'Update' : 'Create'}</button>
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 bg-[#181818] border border-[#2a2a2a] rounded-xl text-gray-400">Cancel</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;
