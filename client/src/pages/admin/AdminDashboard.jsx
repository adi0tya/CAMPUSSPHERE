import { useState, useEffect } from 'react';
import API from '../../api/axios';
import StatCard from '../../components/common/StatCard';
import { HiUsers, HiAcademicCap, HiBookOpen, HiBell, HiBuildingOffice2, HiCurrencyRupee, HiClipboardDocumentList, HiChartBar } from 'react-icons/hi2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [resStats, resPayments] = await Promise.all([
        API.get('/api/reports/overview'),
        API.get('/api/payments/history')
      ]);
      setStats(resStats.data.stats);
      setPayments(resPayments.data.payments || []);
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

  const completedPayments = payments.filter(p => p.status === 'Completed');
  const totalRevenue = completedPayments.reduce((acc, curr) => acc + curr.amount, 0);
  const pendingTransactions = payments.filter(p => p.status === 'Pending').length;

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

      {/* Payment Revenue & Monitoring Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass p-5">
          <p className="text-gray-500 text-xs font-medium mb-1">Total Gateway Revenue</p>
          <p className="text-2xl font-bold text-cyan-400">₹{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="glass p-5">
          <p className="text-gray-500 text-xs font-medium mb-1">Completed Payments</p>
          <p className="text-2xl font-bold text-emerald-400">{completedPayments.length}</p>
        </div>
        <div className="glass p-5">
          <p className="text-gray-500 text-xs font-medium mb-1">Pending Checkout Sessions</p>
          <p className="text-2xl font-bold text-amber-400">{pendingTransactions}</p>
        </div>
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

      {/* Payment Monitoring & Revenue Logs */}
      <div className="glass p-6">
        <h3 className="text-base font-semibold text-white mb-4">Payment Gateway Monitoring</h3>
        {payments.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No payments initiated yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#2a2a2a] text-xs font-semibold text-gray-600 uppercase">
                  <th className="px-4 py-3">Purpose</th>
                  <th className="px-4 py-3">Transaction Reference</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]">
                {payments.slice(0, 5).map((pay) => (
                  <tr key={pay._id} className="hover:bg-[#0a0a0a] transition-colors">
                    <td className="px-4 py-3 text-white font-medium">{pay.purpose}</td>
                    <td className="px-4 py-3 text-xs font-mono text-cyan-400">{pay.razorpayPaymentId || `MOCK_TXN_${pay._id.slice(-6).toUpperCase()}`}</td>
                    <td className="px-4 py-3 text-white font-mono">₹{pay.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-500">{new Date(pay.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        pay.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {pay.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
