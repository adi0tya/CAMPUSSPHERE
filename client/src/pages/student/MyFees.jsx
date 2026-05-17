import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { HiCurrencyRupee, HiPrinter, HiXMark, HiCheckCircle, HiArrowPath } from 'react-icons/hi2';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const statusColors = {
  paid: 'bg-emerald-500/10 text-emerald-400',
  pending: 'bg-amber-500/10 text-amber-400',
  overdue: 'bg-red-500/10 text-red-400',
  partial: 'bg-blue-500/10 text-blue-400'
};

const MyFees = () => {
  const { user } = useAuth();
  const [fees, setFees] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('assigned'); // 'assigned' or 'history'
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resFees, resHistory] = await Promise.all([
        API.get('/api/fees/my'),
        API.get('/api/payments/history')
      ]);
      setFees(resFees.data.fees || []);
      setHistory(resHistory.data.payments || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load fee information');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (fee) => {
    try {
      const { data } = await API.post('/api/payments/order', {
        amount: fee.amount,
        purpose: 'Fee',
        referenceId: fee._id
      });

      const options = {
        key: data.key || 'rzp_test_mock',
        amount: data.order.amount,
        currency: 'INR',
        name: 'CampusSphere ERP',
        description: fee.description,
        order_id: data.order.id,
        handler: async (response) => {
          try {
            await API.post('/api/payments/verify', {
              ...response,
              paymentId: data.payment._id
            });
            toast.success('Payment Successful!');
            fetchData();
          } catch (err) {
            toast.error('Payment Verification Failed');
          }
        },
        prefill: {
          name: user?.name || 'Student Name',
          email: user?.email || 'student@example.com'
        },
        theme: { color: '#0ea5e9' }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error('Failed to initiate payment');
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" /></div>;

  const totalPaid = fees.filter(f => f.paymentStatus === 'paid').reduce((s, f) => s + f.amount, 0);
  const totalPending = fees.filter(f => f.paymentStatus !== 'paid').reduce((s, f) => s + f.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">My Fees</h1>
          <p className="text-gray-600 text-sm">View your fee records and payment status</p>
        </div>
        <button onClick={fetchData} className="p-2.5 bg-[#111111] border border-[#2a2a2a] rounded-xl text-gray-400 hover:text-white transition-all">
          <HiArrowPath className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="glass p-5"><p className="text-gray-500 text-xs mb-1">Total Records</p><p className="text-2xl font-bold text-white">{fees.length}</p></div>
        <div className="glass p-5"><p className="text-gray-500 text-xs mb-1">Paid</p><p className="text-2xl font-bold text-emerald-400">₹{totalPaid.toLocaleString()}</p></div>
        <div className="glass p-5"><p className="text-gray-500 text-xs mb-1">Pending</p><p className="text-2xl font-bold text-amber-400">₹{totalPending.toLocaleString()}</p></div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#2a2a2a] gap-6">
        <button
          onClick={() => setActiveTab('assigned')}
          className={`pb-3 font-semibold text-sm transition-all border-b-2 ${activeTab === 'assigned' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-gray-500'}`}
        >
          Assigned Fees
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 font-semibold text-sm transition-all border-b-2 ${activeTab === 'history' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-gray-500'}`}
        >
          Payment History
        </button>
      </div>

      {activeTab === 'assigned' ? (
        fees.length === 0 ? <EmptyState title="No fee records" icon={HiCurrencyRupee} /> : (
          <div className="space-y-4">
            {fees.map(f => (
              <div key={f._id} className="glass p-5 card-hover">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-semibold text-white">{f.description}</h3>
                    <p className="text-gray-500 text-sm mt-1">Due: {new Date(f.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    {f.paidDate && <p className="text-gray-600 text-xs mt-1">Paid on: {new Date(f.paidDate).toLocaleDateString('en-IN')}</p>}
                    {f.receiptNumber && <p className="text-xs font-mono text-cyan-400 mt-1">Receipt: {f.receiptNumber}</p>}
                  </div>
                  <div className="text-left sm:text-right flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start w-full sm:w-auto gap-3 border-t sm:border-none border-[#1a1a1a] pt-3 sm:pt-0">
                    <p className="text-xl font-bold text-white">₹{f.amount.toLocaleString()}</p>
                    <div className="flex items-center gap-3">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[f.paymentStatus]}`}>{f.paymentStatus}</span>
                      {f.paymentStatus === 'paid' && (
                        <button onClick={() => setSelectedReceipt(f)} className="text-xs font-bold bg-[#181818] border border-[#2a2a2a] hover:bg-[#222222] text-white px-4 py-1.5 rounded-lg transition-all flex items-center gap-2">
                          <HiPrinter className="w-4 h-4" /> Receipt
                        </button>
                      )}
                      {f.paymentStatus !== 'paid' && (
                        <button onClick={() => handlePayment(f)} className="text-xs font-bold bg-cyan-500 hover:bg-cyan-600 text-black px-4 py-1.5 rounded-lg transition-all">
                          Pay Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        history.length === 0 ? <EmptyState title="No past payments" icon={HiCheckCircle} /> : (
          <div className="glass overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#2a2a2a] text-xs text-gray-600 font-semibold uppercase">
                    <th className="px-5 py-4">Purpose</th>
                    <th className="px-5 py-4">Reference ID</th>
                    <th className="px-5 py-4">Amount</th>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1a1a1a]">
                  {history.map(h => (
                    <tr key={h._id} className="hover:bg-[#0a0a0a]/50">
                      <td className="px-5 py-4 text-white font-medium">{h.purpose}</td>
                      <td className="px-5 py-4 text-xs font-mono text-cyan-400">{h.razorpayPaymentId || `MOCK_TXN_${h._id.slice(-6).toUpperCase()}`}</td>
                      <td className="px-5 py-4 text-white font-mono">₹{h.amount.toLocaleString()}</td>
                      <td className="px-5 py-4 text-gray-500">{new Date(h.createdAt).toLocaleDateString('en-IN')}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          h.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {h.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

      {/* Dynamic Receipt Print Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setSelectedReceipt(null)}>
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 w-full max-w-md relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedReceipt(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white print:hidden">
              <HiXMark className="w-6 h-6" />
            </button>
            
            <div id="receipt-print-area" className="space-y-6 pt-2">
              <div className="text-center pb-4 border-b border-[#2a2a2a]">
                <h2 className="text-xl font-bold text-white">CAMPUSSPHERE ERP</h2>
                <p className="text-gray-500 text-xs mt-1">Official Payment Receipt</p>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Receipt No:</span>
                  <span className="font-mono text-cyan-400 font-semibold">{selectedReceipt.receiptNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date:</span>
                  <span className="text-white font-medium">{new Date(selectedReceipt.paidDate || selectedReceipt.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Student:</span>
                  <span className="text-white font-medium">{user?.name || 'Student'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Description:</span>
                  <span className="text-white font-medium">{selectedReceipt.description}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-[#2a2a2a]">
                  <span className="text-gray-500 font-semibold">Amount Paid:</span>
                  <span className="text-emerald-400 text-lg font-bold">₹{selectedReceipt.amount.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="text-center pt-4 border-t border-[#2a2a2a] text-xs text-gray-600">
                This is an electronically generated document. No signature required.
              </div>
            </div>
            
            <div className="mt-6 flex gap-3 print:hidden">
              <button onClick={() => window.print()} className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-black rounded-xl font-bold flex items-center justify-center gap-2">
                <HiPrinter className="w-5 h-5" /> Print Receipt
              </button>
              <button onClick={() => setSelectedReceipt(null)} className="flex-1 py-2.5 bg-[#181818] border border-[#2a2a2a] text-gray-400 rounded-xl">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyFees;
