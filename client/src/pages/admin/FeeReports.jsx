import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { HiCurrencyRupee, HiPlus, HiTrash, HiCheckCircle, HiArrowPath } from 'react-icons/hi2';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';

const statusColors = {
  paid: 'bg-emerald-500/10 text-emerald-400',
  pending: 'bg-amber-500/10 text-amber-400',
  overdue: 'bg-red-500/10 text-red-400',
  partial: 'bg-blue-500/10 text-blue-400'
};

const FeeReports = () => {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' or 'transactions'
  
  // Modals state
  const [showModal, setShowModal] = useState(false);
  const [isBatch, setIsBatch] = useState(false);
  const [form, setForm] = useState({
    student: '',
    amount: '',
    dueDate: '',
    description: '',
    category: 'Semester fees',
    semester: '',
    academicYear: '2026'
  });

  useEffect(() => {
    fetchData();
  }, [statusFilter, categoryFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.paymentStatus = statusFilter;
      const [feesRes, studentsRes, paymentsRes] = await Promise.all([
        API.get('/api/fees', { params }),
        API.get('/api/students'),
        API.get('/api/payments/history')
      ]);
      setFees(feesRes.data.fees || []);
      setStudents(studentsRes.data.students || []);
      setPayments(paymentsRes.data.payments || []);
    } catch (err) {
      console.error(err);
      toast.error('Error fetching fee information');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFee = async (e) => {
    e.preventDefault();
    if (!form.amount || !form.dueDate || !form.category) {
      return toast.error('Please fill in required fields');
    }

    if (!isBatch && !form.student) {
      return toast.error('Please select a student for individual assignment');
    }

    try {
      if (isBatch) {
        await API.post('/api/fees/batch', {
          amount: parseFloat(form.amount),
          dueDate: form.dueDate,
          description: form.description || `${form.category} Structure`,
          category: form.category,
          semester: form.semester ? parseInt(form.semester) : undefined,
          academicYear: form.academicYear
        });
        toast.success('Batch fees successfully assigned to all students!');
      } else {
        await API.post('/api/fees', {
          student: form.student,
          amount: parseFloat(form.amount),
          dueDate: form.dueDate,
          description: form.description || `${form.category} Structure`,
          category: form.category,
          semester: form.semester ? parseInt(form.semester) : undefined,
          academicYear: form.academicYear
        });
        toast.success('Fee structure assigned to student!');
      }
      setShowModal(false);
      setForm({
        student: '',
        amount: '',
        dueDate: '',
        description: '',
        category: 'Semester fees',
        semester: '',
        academicYear: '2026'
      });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to assign fee structure');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await API.patch(`/api/fees/${id}/status`, { paymentStatus: status });
      toast.success(`Marked fee record as ${status}`);
      fetchData();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteFee = async (id) => {
    if (!window.confirm('Are you sure you want to delete this fee record?')) return;
    try {
      await API.delete(`/api/fees/${id}`);
      toast.success('Fee record deleted');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete fee record');
    }
  };

  // Filtered fees client-side if category is set
  const displayedFees = categoryFilter ? fees.filter(f => f.category === categoryFilter) : fees;

  const totalAssigned = displayedFees.reduce((s, f) => s + f.amount, 0);
  const totalPaid = displayedFees.filter(f => f.paymentStatus === 'paid').reduce((s, f) => s + f.amount, 0);
  const totalPending = displayedFees.filter(f => f.paymentStatus !== 'paid').reduce((s, f) => s + f.amount, 0);

  const inputClass = "w-full px-4 py-3 bg-[#111111] border border-[#2a2a2a] rounded-xl text-white placeholder-gray-600 text-sm focus:border-cyan-500 focus:outline-none";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Fees Management</h1>
          <p className="text-gray-600 text-sm">Assign fee structures and track campus collections</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setIsBatch(false); setShowModal(true); }} className="px-5 py-2.5 bg-[#111111] border border-[#2a2a2a] hover:bg-[#181818] rounded-xl text-white font-semibold flex items-center gap-2 text-sm transition-all">
            <HiPlus className="w-4 h-4" /> Single Fee
          </button>
          <button onClick={() => { setIsBatch(true); setShowModal(true); }} className="px-5 py-2.5 gradient-cyan rounded-xl text-white font-semibold flex items-center gap-2 text-sm hover:opacity-90 transition-all">
            <HiPlus className="w-4 h-4" /> Batch Assign
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass p-5"><p className="text-gray-500 text-xs mb-1">Total Assigned</p><p className="text-2xl font-bold text-white">₹{totalAssigned.toLocaleString()}</p></div>
        <div className="glass p-5"><p className="text-gray-500 text-xs mb-1">Revenue Collected</p><p className="text-2xl font-bold text-emerald-400">₹{totalPaid.toLocaleString()}</p></div>
        <div className="glass p-5"><p className="text-gray-500 text-xs mb-1">Pending Dues</p><p className="text-2xl font-bold text-amber-400">₹{totalPending.toLocaleString()}</p></div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#2a2a2a] gap-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 font-semibold text-sm transition-all border-b-2 ${activeTab === 'overview' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-gray-500'}`}
        >
          Fee Collections Overview
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`pb-3 font-semibold text-sm transition-all border-b-2 ${activeTab === 'transactions' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-gray-500'}`}
        >
          Recent Gateway Transactions
        </button>
      </div>

      {activeTab === 'overview' ? (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Status Filter */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 sm:pb-0">
              {['', 'paid', 'pending', 'overdue'].map(s => (
                <button key={s} onClick={() => setStatusFilter(s)} className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all whitespace-nowrap ${statusFilter === s ? 'bg-cyan-500 text-black font-bold' : 'bg-[#111111] border border-[#2a2a2a] text-gray-500'}`}>
                  {s || 'All Status'}
                </button>
              ))}
            </div>

            {/* Category Filter */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 sm:pb-0 sm:ml-auto">
              {['', 'Semester fees', 'Hostel fees', 'Bus fees', 'Library fines', 'Exam fees', 'Custom fees'].map(c => (
                <button key={c} onClick={() => setCategoryFilter(c)} className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all whitespace-nowrap ${categoryFilter === c ? 'bg-white text-black font-bold' : 'bg-[#111111] border border-[#2a2a2a] text-gray-500'}`}>
                  {c || 'All Categories'}
                </button>
              ))}
            </div>
          </div>

          {loading ? <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-14" />)}</div> : displayedFees.length === 0 ? (
            <EmptyState title="No assigned fee structures found" icon={HiCurrencyRupee} />
          ) : (
            <div className="glass overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#2a2a2a] text-xs font-semibold text-gray-600 uppercase">
                      <th className="px-4 py-3">Student</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Description</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Due Date</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1a1a1a]">
                    {displayedFees.map(f => (
                      <tr key={f._id} className="hover:bg-[#0a0a0a]/50 transition-colors">
                        <td className="px-4 py-3 text-white font-medium">
                          {f.student?.user?.name || 'Deleted Student'}
                          <span className="block text-gray-500 text-xs">{f.student?.rollNumber || ''}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs font-semibold uppercase">{f.category || 'Semester fees'}</td>
                        <td className="px-4 py-3 text-gray-300 text-xs">{f.description}</td>
                        <td className="px-4 py-3 text-white font-mono font-medium">₹{f.amount.toLocaleString()}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{new Date(f.dueDate).toLocaleDateString('en-IN')}</td>
                        <td className="px-4 py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[f.paymentStatus]}`}>{f.paymentStatus}</span></td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-1.5">
                            {f.paymentStatus !== 'paid' && (
                              <>
                                <button onClick={() => handleStatusUpdate(f._id, 'paid')} className="px-2 py-1 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs rounded-lg transition-colors font-medium">Mark Paid</button>
                                <button onClick={() => handleStatusUpdate(f._id, 'overdue')} className="px-2 py-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs rounded-lg transition-colors font-medium">Overdue</button>
                              </>
                            )}
                            <button onClick={() => handleDeleteFee(f._id)} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors">
                              <HiTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        payments.length === 0 ? <EmptyState title="No transactions record" icon={HiCheckCircle} /> : (
          <div className="glass overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#2a2a2a] text-xs text-gray-600 font-semibold uppercase">
                    <th className="px-5 py-4">Purpose</th>
                    <th className="px-5 py-4">Transaction Reference</th>
                    <th className="px-5 py-4">Amount</th>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1a1a1a]">
                  {payments.map(h => (
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

      {/* Assignment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">{isBatch ? 'Batch Assign Fee' : 'Assign Fee Record'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white"><HiXMark className="w-6 h-6" /></button>
            </div>
            
            <form onSubmit={handleCreateFee} className="space-y-4">
              {!isBatch && (
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 uppercase font-semibold">Select Student *</label>
                  <select
                    value={form.student}
                    onChange={e => setForm({ ...form, student: e.target.value })}
                    className={inputClass}
                  >
                    <option value="">Select student</option>
                    {students.map(s => <option key={s._id} value={s._id}>{s.user?.name} - {s.rollNumber}</option>)}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs text-gray-500 mb-1.5 uppercase font-semibold">Fee Category *</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className={inputClass}
                >
                  <option value="Semester fees">Semester fees</option>
                  <option value="Hostel fees">Hostel fees</option>
                  <option value="Bus fees">Bus fees</option>
                  <option value="Library fines">Library fines</option>
                  <option value="Exam fees">Exam fees</option>
                  <option value="Custom fees">Custom fees</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1.5 uppercase font-semibold">Amount (₹) *</label>
                <input
                  type="number"
                  placeholder="25000"
                  value={form.amount}
                  onChange={e => setForm({ ...form, amount: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1.5 uppercase font-semibold">Due Date *</label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={e => setForm({ ...form, dueDate: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1.5 uppercase font-semibold">Description</label>
                <input
                  type="text"
                  placeholder="Tuition Fee Semester 4"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 uppercase font-semibold">Semester</label>
                  <input
                    type="number"
                    placeholder="4"
                    value={form.semester}
                    onChange={e => setForm({ ...form, semester: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 uppercase font-semibold">Academic Year</label>
                  <input
                    type="text"
                    placeholder="2026"
                    value={form.academicYear}
                    onChange={e => setForm({ ...form, academicYear: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 py-3 gradient-cyan rounded-xl text-white font-semibold hover:opacity-90 transition-all">Assign</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 bg-[#181818] border border-[#2a2a2a] text-gray-400 rounded-xl">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeReports;
