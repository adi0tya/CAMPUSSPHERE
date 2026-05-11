import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { HiClipboardDocumentList } from 'react-icons/hi2';
import EmptyState from '../../components/common/EmptyState';

const MyAttendance = () => {
  const [summary, setSummary] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('summary');

  useEffect(() => {
    API.get('/api/attendance/my').then(({ data }) => { setSummary(data.summary); setRecords(data.attendance); }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" /></div>;

  const statusColors = { present: 'bg-emerald-500/10 text-emerald-400', absent: 'bg-red-500/10 text-red-400', late: 'bg-amber-500/10 text-amber-400' };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">My Attendance</h1><p className="text-gray-600 text-sm">Track your attendance across subjects</p></div>

      <div className="flex gap-2">
        {['summary', 'records'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-5 py-2.5 rounded-xl text-sm font-medium capitalize transition-all ${tab === t ? 'bg-cyan-500 text-white' : 'bg-[#111111] border border-[#2a2a2a] text-gray-500'}`}>{t}</button>
        ))}
      </div>

      {tab === 'summary' && (
        summary.length === 0 ? <EmptyState title="No attendance records" icon={HiClipboardDocumentList} /> : (
          <div className="space-y-4">
            {summary.map((s, i) => (
              <div key={i} className="glass p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-base font-semibold text-white">{s.subject?.name}</h3>
                    <p className="text-xs text-gray-500">{s.subject?.code}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${parseFloat(s.percentage) >= 75 ? 'text-emerald-400' : 'text-red-400'}`}>{s.percentage}%</p>
                    <p className="text-xs text-gray-600">{s.present}/{s.total} classes</p>
                  </div>
                </div>
                <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${parseFloat(s.percentage) >= 75 ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${s.percentage}%` }} />
                </div>
                {parseFloat(s.percentage) < 75 && (
                  <p className="text-xs text-red-400 mt-2">⚠ Below 75% attendance threshold</p>
                )}
              </div>
            ))}
          </div>
        )
      )}

      {tab === 'records' && (
        records.length === 0 ? <EmptyState title="No records" icon={HiClipboardDocumentList} /> : (
          <div className="glass overflow-hidden">
            <table className="w-full">
              <thead><tr className="border-b border-[#2a2a2a]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Subject</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              </tr></thead>
              <tbody className="divide-y divide-[#1a1a1a]">
                {records.map(r => (
                  <tr key={r._id} className="hover:bg-[#0a0a0a]">
                    <td className="px-4 py-3 text-sm text-white">{r.subject?.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{new Date(r.date).toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[r.status]}`}>{r.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
};

export default MyAttendance;
