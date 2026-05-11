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

const MyFees = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/api/fees/my').then(({ data }) => setFees(data.fees)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" /></div>;

  const totalPaid = fees.filter(f => f.paymentStatus === 'paid').reduce((s, f) => s + f.amount, 0);
  const totalPending = fees.filter(f => f.paymentStatus !== 'paid').reduce((s, f) => s + f.amount, 0);

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">My Fees</h1><p className="text-gray-600 text-sm">View your fee records and payment status</p></div>

      <div className="grid grid-cols-3 gap-4">
        <div className="glass p-5"><p className="text-gray-500 text-xs mb-1">Total Records</p><p className="text-2xl font-bold text-white">{fees.length}</p></div>
        <div className="glass p-5"><p className="text-gray-500 text-xs mb-1">Paid</p><p className="text-2xl font-bold text-emerald-400">₹{totalPaid.toLocaleString()}</p></div>
        <div className="glass p-5"><p className="text-gray-500 text-xs mb-1">Pending</p><p className="text-2xl font-bold text-amber-400">₹{totalPending.toLocaleString()}</p></div>
      </div>

      {fees.length === 0 ? <EmptyState title="No fee records" icon={HiCurrencyRupee} /> : (
        <div className="space-y-4">
          {fees.map(f => (
            <div key={f._id} className="glass p-5 card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-white">{f.description}</h3>
                  <p className="text-gray-500 text-sm mt-1">Due: {new Date(f.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  {f.paidDate && <p className="text-gray-600 text-xs mt-1">Paid on: {new Date(f.paidDate).toLocaleDateString('en-IN')}</p>}
                  {f.receiptNumber && <p className="text-xs font-mono text-cyan-400 mt-1">Receipt: {f.receiptNumber}</p>}
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-white">₹{f.amount.toLocaleString()}</p>
                  <span className={`mt-1 inline-block px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[f.paymentStatus]}`}>{f.paymentStatus}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyFees;
