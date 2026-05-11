import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { HiCurrencyRupee } from 'react-icons/hi2';
import EmptyState from '../../components/common/EmptyState';

const statusColors = {
  paid: 'bg-emerald-500/10 text-emerald-400',
  pending: 'bg-amber-500/10 text-amber-400',
  overdue: 'bg-red-500/10 text-red-400',
  partial: 'bg-blue-500/10 text-blue-400'
};

const FeeReports = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => { fetchFees(); }, [statusFilter]);

  const fetchFees = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.paymentStatus = statusFilter;
      const { data } = await API.get('/api/fees', { params });
      setFees(data.fees);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const totalPaid = fees.filter(f => f.paymentStatus === 'paid').reduce((s, f) => s + f.amount, 0);
  const totalPending = fees.filter(f => f.paymentStatus !== 'paid').reduce((s, f) => s + f.amount, 0);

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">Fee Reports</h1><p className="text-gray-600 text-sm">Overview of all fee collections</p></div>

      <div className="grid grid-cols-3 gap-4">
        <div className="glass p-5"><p className="text-gray-500 text-xs mb-1">Total Records</p><p className="text-2xl font-bold text-white">{fees.length}</p></div>
        <div className="glass p-5"><p className="text-gray-500 text-xs mb-1">Collected</p><p className="text-2xl font-bold text-emerald-400">₹{totalPaid.toLocaleString()}</p></div>
        <div className="glass p-5"><p className="text-gray-500 text-xs mb-1">Pending</p><p className="text-2xl font-bold text-amber-400">₹{totalPending.toLocaleString()}</p></div>
      </div>

      <div className="flex gap-2">
        {['', 'paid', 'pending', 'overdue', 'partial'].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${statusFilter === s ? 'bg-cyan-500 text-white' : 'bg-[#111111] border border-[#2a2a2a] text-gray-500'}`}>
            {s || 'All'}
          </button>
        ))}
      </div>

      {loading ? <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-14" />)}</div> : fees.length === 0 ? (
        <EmptyState title="No fee records" icon={HiCurrencyRupee} />
      ) : (
        <div className="glass overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-[#2a2a2a]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Student</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Description</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Due Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Receipt</th>
              </tr></thead>
              <tbody className="divide-y divide-[#1a1a1a]">
                {fees.map(f => (
                  <tr key={f._id} className="hover:bg-[#0a0a0a]">
                    <td className="px-4 py-3 text-sm text-white">{f.student?.user?.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{f.description}</td>
                    <td className="px-4 py-3 text-sm font-medium text-white">₹{f.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{new Date(f.dueDate).toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[f.paymentStatus]}`}>{f.paymentStatus}</span></td>
                    <td className="px-4 py-3 text-xs font-mono text-gray-600">{f.receiptNumber || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeReports;
