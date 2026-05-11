import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const chartOpts = {
  responsive: true,
  plugins: { legend: { labels: { color: '#888' } } },
  scales: { x: { ticks: { color: '#555' }, grid: { display: false } }, y: { ticks: { color: '#555' }, grid: { color: '#1a1a1a' } } }
};

const Reports = () => {
  const [tab, setTab] = useState('students');
  const [studentReport, setStudentReport] = useState(null);
  const [facultyReport, setFacultyReport] = useState(null);
  const [feeReport, setFeeReport] = useState(null);
  const [attReport, setAttReport] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchReports(); }, []);

  const fetchReports = async () => {
    try {
      const [sr, fr, fee, att] = await Promise.all([
        API.get('/api/reports/students'),
        API.get('/api/reports/faculty'),
        API.get('/api/reports/fees'),
        API.get('/api/reports/attendance')
      ]);
      setStudentReport(sr.data);
      setFacultyReport(fr.data);
      setFeeReport(fee.data);
      setAttReport(att.data.report || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" /></div>;

  const tabs = [
    { id: 'students', label: 'Students' },
    { id: 'faculty', label: 'Faculty' },
    { id: 'fees', label: 'Fees' },
    { id: 'attendance', label: 'Attendance' }
  ];

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">Reports & Analytics</h1><p className="text-gray-600 text-sm">Comprehensive ERP reports</p></div>

      <div className="flex gap-2 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${tab === t.id ? 'bg-cyan-500 text-white' : 'bg-[#111111] border border-[#2a2a2a] text-gray-500 hover:text-white'}`}>{t.label}</button>
        ))}
      </div>

      {tab === 'students' && studentReport && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass p-6">
            <h3 className="text-base font-semibold text-white mb-4">Students by Department</h3>
            <Bar data={{
              labels: studentReport.byDepartment.map(d => d._id),
              datasets: [{ label: 'Students', data: studentReport.byDepartment.map(d => d.count), backgroundColor: '#06b6d4', borderRadius: 6 }]
            }} options={chartOpts} />
          </div>
          <div className="glass p-6">
            <h3 className="text-base font-semibold text-white mb-4">Students by Semester</h3>
            <Bar data={{
              labels: studentReport.bySemester.map(s => `Sem ${s._id}`),
              datasets: [{ label: 'Students', data: studentReport.bySemester.map(s => s.count), backgroundColor: '#6366f1', borderRadius: 6 }]
            }} options={chartOpts} />
          </div>
        </div>
      )}

      {tab === 'faculty' && facultyReport && (
        <div className="glass p-6">
          <h3 className="text-base font-semibold text-white mb-4">Faculty by Department</h3>
          <Bar data={{
            labels: facultyReport.byDepartment.map(d => d._id),
            datasets: [{ label: 'Faculty', data: facultyReport.byDepartment.map(d => d.count), backgroundColor: '#10b981', borderRadius: 6 }]
          }} options={chartOpts} />
        </div>
      )}

      {tab === 'fees' && feeReport && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass p-6">
            <h3 className="text-base font-semibold text-white mb-4">Fee Status Distribution</h3>
            <Doughnut data={{
              labels: feeReport.summary.map(s => s._id),
              datasets: [{ data: feeReport.summary.map(s => s.amount), backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#06b6d4'], borderWidth: 0 }]
            }} options={{ responsive: true, plugins: { legend: { position: 'bottom', labels: { color: '#888', padding: 16 } } }, cutout: '65%' }} />
          </div>
          <div className="glass p-6">
            <h3 className="text-base font-semibold text-white mb-4">Monthly Collections</h3>
            <Bar data={{
              labels: feeReport.monthly.map(m => {
                const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                return months[(m._id?.month || 1) - 1];
              }),
              datasets: [{ label: 'Amount (₹)', data: feeReport.monthly.map(m => m.amount), backgroundColor: '#10b981', borderRadius: 6 }]
            }} options={chartOpts} />
          </div>
        </div>
      )}

      {tab === 'attendance' && (
        <div className="glass p-6">
          <h3 className="text-base font-semibold text-white mb-4">Attendance by Semester</h3>
          {attReport.length === 0 ? <p className="text-gray-600 text-center py-8">No attendance data</p> : (
            <Bar data={{
              labels: attReport.map(r => `Sem ${r._id}`),
              datasets: [
                { label: 'Present', data: attReport.map(r => r.present), backgroundColor: '#10b981', borderRadius: 4 },
                { label: 'Absent', data: attReport.map(r => r.absent), backgroundColor: '#ef4444', borderRadius: 4 }
              ]
            }} options={chartOpts} />
          )}
        </div>
      )}
    </div>
  );
};

export default Reports;
