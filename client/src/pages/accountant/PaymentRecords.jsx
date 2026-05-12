import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { HiDocumentText } from 'react-icons/hi2';

const PaymentRecords = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/api/fees', { params: { status: 'paid' } }).then(({ data }) => setFees(data.fees || [])).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">Payment Records</h1><p className="text-gray-600 text-sm">All completed payments</p></div>

      {fees.length === 0 ? (
        <div className="glass p-12 text-center"><HiDocumentText className="w-12 h-12 text-gray-700 mx-auto mb-3" /><p className="text-gray-500">No payment records found</p></div>
      ) : (
        <div className="glass overflow-hidden">
          <table className="w-full">
            <thead><tr className="border-b border-[#2a2a2a]">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Receipt #</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Student</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Paid Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Description</th>
            </tr></thead>
            <tbody className="divide-y divide-[#1a1a1a]">
              {fees.map(f => (
                <tr key={f._id} className="hover:bg-[#0a0a0a]">
                  <td className="px-4 py-3 text-xs font-mono text-cyan-400">{f.receiptNumber || '-'}</td>
                  <td className="px-4 py-3 text-sm text-white">{f.student?.user?.name || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm font-medium text-emerald-400">₹{f.amount?.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{f.paidDate ? new Date(f.paidDate).toLocaleDateString('en-IN') : '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{f.description || 'Tuition Fee'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="glass p-5">
        <div className="flex items-center justify-between">
          <span className="text-gray-500 text-sm">Total Payments: {fees.length}</span>
          <span className="text-lg font-bold text-emerald-400">₹{fees.reduce((s, f) => s + (f.amount || 0), 0).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentRecords;
