import { useState, useEffect } from 'react';
import API from '../../api/axios';
import StatCard from '../../components/common/StatCard';
import { HiUsers, HiAcademicCap, HiBookOpen, HiBell, HiBuildingOffice2, HiCurrencyRupee, HiClipboardDocumentList, HiChartBar } from 'react-icons/hi2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const { data } = await API.get('/api/reports/overview');
      setStats(data.stats);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
    </div>
  );

  const feeStats = stats?.feeStats || {};
  const attStats = stats?.attendanceStats || {};
  const attPct = attStats.total > 0 ? ((attStats.present / attStats.total) * 100).toFixed(1) : 0;

  const doughnutData = {
    labels: ['Paid', 'Pending', 'Overdue'],
    datasets: [{
      data: [feeStats.paidAmount || 0, feeStats.pendingAmount || 0, feeStats.overdueAmount || 0],
      backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
      borderWidth: 0, borderRadius: 4
    }]
  };

  const attData = {
    labels: ['Present', 'Absent'],
    datasets: [{
      data: [attStats.present || 0, attStats.absent || 0],
      backgroundColor: ['#06b6d4', '#ef4444'],
      borderWidth: 0, borderRadius: 4
    }]
  };

  const chartOpts = {
    responsive: true,
    plugins: { legend: { position: 'bottom', labels: { color: '#888', padding: 16 } } },
    cutout: '65%'
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-gray-600 text-sm">Overview of CampusSphere ERP</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard title="Students" value={stats?.totalStudents || 0} icon={HiUsers} color="primary" />
        <StatCard title="Faculty" value={stats?.totalFaculty || 0} icon={HiAcademicCap} color="info" />
        <StatCard title="Courses" value={stats?.totalCourses || 0} icon={HiBookOpen} color="success" />
        <StatCard title="Departments" value={stats?.totalDepartments || 0} icon={HiBuildingOffice2} color="purple" />
        <StatCard title="Notices" value={stats?.totalNotices || 0} icon={HiBell} color="warning" />
        <StatCard title="Attendance %" value={`${attPct}%`} icon={HiClipboardDocumentList} color="danger" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass p-5">
          <p className="text-gray-500 text-xs font-medium mb-1">Total Fee Collection</p>
          <p className="text-2xl font-bold text-white">₹{(feeStats.totalAmount || 0).toLocaleString()}</p>
        </div>
        <div className="glass p-5">
          <p className="text-gray-500 text-xs font-medium mb-1">Paid Amount</p>
          <p className="text-2xl font-bold text-emerald-400">₹{(feeStats.paidAmount || 0).toLocaleString()}</p>
        </div>
        <div className="glass p-5">
          <p className="text-gray-500 text-xs font-medium mb-1">Pending Amount</p>
          <p className="text-2xl font-bold text-amber-400">₹{(feeStats.pendingAmount || 0).toLocaleString()}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass p-6">
          <h3 className="text-base font-semibold text-white mb-4">Fee Collection Status</h3>
          <Doughnut data={doughnutData} options={chartOpts} />
        </div>
        <div className="glass p-6">
          <h3 className="text-base font-semibold text-white mb-4">Attendance Overview</h3>
          <Doughnut data={attData} options={chartOpts} />
        </div>
      </div>

      <div className="glass p-6">
        <h3 className="text-base font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Add Student', path: '/admin/students', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
            { label: 'Add Faculty', path: '/admin/faculty', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
            { label: 'Create Notice', path: '/admin/notices', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
            { label: 'View Reports', path: '/admin/reports', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
          ].map((action, i) => (
            <a key={i} href={action.path} className={`p-4 rounded-xl border text-sm font-medium text-center transition-all hover:scale-105 ${action.color}`}>
              {action.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
