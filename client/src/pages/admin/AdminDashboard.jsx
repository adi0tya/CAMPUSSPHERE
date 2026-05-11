import { useState, useEffect } from 'react';
import API from '../../api/axios';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import { HiTruck, HiClock, HiCheckCircle, HiExclamationCircle, HiUsers, HiBuildingOffice2 } from 'react-icons/hi2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [shipmentStats, setShipmentStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [statsRes, shipmentRes] = await Promise.all([
        API.get('/api/reports/overview'),
        API.get('/api/shipments/stats/overview')
      ]);
      setStats(statsRes.data.stats);
      setShipmentStats(shipmentRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" /></div>;

  const doughnutData = {
    labels: ['Delivered', 'In Transit', 'Pending', 'Failed'],
    datasets: [{
      data: [
        shipmentStats?.stats?.delivered || 0,
        (shipmentStats?.stats?.inTransit || 0) + (shipmentStats?.stats?.outForDelivery || 0),
        shipmentStats?.stats?.pending || 0,
        shipmentStats?.stats?.failed || 0
      ],
      backgroundColor: ['#10b981', '#06b6d4', '#f59e0b', '#ef4444'],
      borderWidth: 0, borderRadius: 4,
    }]
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const barData = {
    labels: (shipmentStats?.monthlyStats || []).map(s => months[(s._id?.month || 1) - 1]),
    datasets: [
      { label: 'Total', data: (shipmentStats?.monthlyStats || []).map(s => s.count), backgroundColor: '#06b6d4', borderRadius: 6 },
      { label: 'Delivered', data: (shipmentStats?.monthlyStats || []).map(s => s.delivered), backgroundColor: '#10b981', borderRadius: 6 }
    ]
  };

  const chartOpts = {
    responsive: true,
    plugins: { legend: { labels: { color: '#888' } } },
    scales: { x: { ticks: { color: '#555' }, grid: { display: false } }, y: { ticks: { color: '#555' }, grid: { color: '#1a1a1a' } } }
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">Admin Dashboard</h1><p className="text-gray-600 text-sm">Overview of your logistics operations</p></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Total Shipments" value={stats?.totalShipments || 0} icon={HiTruck} color="primary" />
        <StatCard title="Active" value={stats?.activeDeliveries || 0} icon={HiClock} color="info" />
        <StatCard title="Delivered" value={stats?.deliveredCount || 0} icon={HiCheckCircle} color="success" />
        <StatCard title="Pending" value={shipmentStats?.stats?.pending || 0} icon={HiExclamationCircle} color="warning" />
        <StatCard title="Employees" value={stats?.totalEmployees || 0} icon={HiUsers} color="purple" />
        <StatCard title="Warehouses" value={stats?.totalWarehouses || 0} icon={HiBuildingOffice2} color="danger" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass p-6">
          <h3 className="text-base font-semibold text-white mb-4">Monthly Overview</h3>
          <Bar data={barData} options={chartOpts} />
        </div>
        <div className="glass p-6">
          <h3 className="text-base font-semibold text-white mb-4">Status Breakdown</h3>
          <Doughnut data={doughnutData} options={{ responsive: true, plugins: { legend: { position: 'bottom', labels: { color: '#888', padding: 16 } } }, cutout: '65%' }} />
        </div>
      </div>

      <div className="glass p-6">
        <h3 className="text-base font-semibold text-white mb-4">Recent Shipments</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-[#2a2a2a]">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tracking ID</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Receiver</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
            </tr></thead>
            <tbody className="divide-y divide-[#1a1a1a]">
              {(shipmentStats?.recentShipments || []).map(s => (
                <tr key={s._id} className="hover:bg-[#0a0a0a]">
                  <td className="px-4 py-3 text-sm font-mono text-cyan-400">{s.trackingId}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">{s.receiverName}</td>
                  <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                  <td className="px-4 py-3 text-sm text-gray-500">{new Date(s.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
