import { useState, useEffect } from 'react';
import API from '../../api/axios';
import StatCard from '../../components/common/StatCard';
import { HiCurrencyRupee, HiCheckCircle, HiClock, HiExclamationCircle } from 'react-icons/hi2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const AccountantFeeReports = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { API.get('/api/fees').then(({ data }) => setFees(data.fees || [])).catch(console.error).finally(() => setLoading(false)); }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" /></div>;

  const paid = fees.filter(f => f.paymentStatus === 'paid');
  const pending = fees.filter(f => f.paymentStatus === 'pending');
  const overdue = fees.filter(f => f.paymentStatus === 'overdue');
  const totalCollected = paid.reduce((s, f) => s + f.amount, 0);
  const totalPending = pending.reduce((s, f) => s + f.amount, 0);
  const totalOverdue = overdue.reduce((s, f) => s + f.amount, 0);

  const doughnutData = {
    labels: ['Paid', 'Pending', 'Overdue'],
    datasets: [{ data: [paid.length, pending.length, overdue.length], backgroundColor: ['#10b981', '#f59e0b', '#ef4444'], borderWidth: 0, borderRadius: 4 }]
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">Fee Reports</h1><p className="text-gray-600 text-sm">Financial analytics and summary</p></div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Collected" value={`₹${(totalCollected / 1000).toFixed(0)}K`} icon={HiCurrencyRupee} color="success" />
        <StatCard title="Pending Amount" value={`₹${(totalPending / 1000).toFixed(0)}K`} icon={HiClock} color="warning" />
        <StatCard title="Overdue Amount" value={`₹${(totalOverdue / 1000).toFixed(0)}K`} icon={HiExclamationCircle} color="danger" />
        <StatCard title="Total Records" value={fees.length} icon={HiCheckCircle} color="primary" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass p-6">
          <h3 className="text-base font-semibold text-white mb-4">Payment Status Distribution</h3>
          <div className="max-w-[280px] mx-auto"><Doughnut data={doughnutData} options={{ responsive: true, plugins: { legend: { position: 'bottom', labels: { color: '#888', padding: 16 } } }, cutout: '65%' }} /></div>
        </div>
        <div className="glass p-6">
          <h3 className="text-base font-semibold text-white mb-4">Amount Summary</h3>
          <div className="space-y-4 mt-6">
            <div className="flex items-center justify-between p-4 bg-[#0a0a0a] rounded-xl border border-[#1a1a1a]">
              <span className="text-gray-400">Total Revenue</span><span className="text-xl font-bold text-white">₹{(totalCollected + totalPending + totalOverdue).toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-[#0a0a0a] rounded-xl border border-[#1a1a1a]">
              <span className="text-gray-400">Collected</span><span className="text-xl font-bold text-emerald-400">₹{totalCollected.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-[#0a0a0a] rounded-xl border border-[#1a1a1a]">
              <span className="text-gray-400">Outstanding</span><span className="text-xl font-bold text-amber-400">₹{(totalPending + totalOverdue).toLocaleString()}</span>
            </div>
            <div className="w-full bg-[#1a1a1a] rounded-full h-3 overflow-hidden">
              <div className="bg-emerald-500 h-3 rounded-full" style={{ width: `${fees.length > 0 ? (paid.length / fees.length * 100) : 0}%` }} />
            </div>
            <p className="text-gray-600 text-xs text-center">{fees.length > 0 ? (paid.length / fees.length * 100).toFixed(1) : 0}% collection rate</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountantFeeReports;
