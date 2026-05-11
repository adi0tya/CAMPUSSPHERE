import { useState, useEffect } from 'react';
import API from '../../api/axios';
import StatCard from '../../components/common/StatCard';
import { HiCurrencyRupee, HiCheckCircle, HiClock, HiExclamationCircle } from 'react-icons/hi2';

const AccountantDashboard = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/api/fees').then(({ data }) => setFees(data.fees)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" /></div>;

  const paid = fees.filter(f => f.paymentStatus === 'paid');
  const pending = fees.filter(f => f.paymentStatus === 'pending');
  const overdue = fees.filter(f => f.paymentStatus === 'overdue');
  const totalCollected = paid.reduce((s, f) => s + f.amount, 0);

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">Accountant Dashboard</h1><p className="text-gray-600 text-sm">Financial overview</p></div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Collected" value={`₹${(totalCollected / 1000).toFixed(0)}K`} icon={HiCurrencyRupee} color="success" />
        <StatCard title="Paid" value={paid.length} icon={HiCheckCircle} color="primary" />
        <StatCard title="Pending" value={pending.length} icon={HiClock} color="warning" />
        <StatCard title="Overdue" value={overdue.length} icon={HiExclamationCircle} color="danger" />
      </div>

      <div className="glass p-6">
        <h3 className="text-base font-semibold text-white mb-4">Recent Transactions</h3>
        {paid.length === 0 ? <p className="text-gray-600 text-center py-8">No payments recorded</p> : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-[#2a2a2a]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Student</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Paid Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Receipt</th>
              </tr></thead>
              <tbody className="divide-y divide-[#1a1a1a]">
                {paid.slice(0, 10).map(f => (
                  <tr key={f._id} className="hover:bg-[#0a0a0a]">
                    <td className="px-4 py-3 text-sm text-white">{f.student?.user?.name}</td>
                    <td className="px-4 py-3 text-sm font-medium text-emerald-400">₹{f.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{f.paidDate ? new Date(f.paidDate).toLocaleDateString('en-IN') : '-'}</td>
                    <td className="px-4 py-3 text-xs font-mono text-cyan-400">{f.receiptNumber || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountantDashboard;
