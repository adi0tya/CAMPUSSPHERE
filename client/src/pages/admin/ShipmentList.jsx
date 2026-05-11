import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import { HiMagnifyingGlass, HiTruck, HiEye, HiTrash } from 'react-icons/hi2';
import toast from 'react-hot-toast';

const ShipmentList = () => {
  const [shipments, setShipments] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => { fetchShipments(); }, [page, statusFilter]);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;
      const { data } = await API.get('/api/shipments', { params });
      setShipments(data.shipments);
      setPagination(data.pagination);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchShipments(); };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this shipment?')) return;
    try { await API.delete(`/api/shipments/${id}`); toast.success('Deleted'); fetchShipments(); }
    catch (err) { toast.error('Failed'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-white">Shipments</h1><p className="text-gray-600 text-sm">Manage all shipments</p></div>
        <button onClick={() => navigate('/admin/create-shipment')} className="px-6 py-2.5 gradient-cyan rounded-xl text-white font-semibold hover:opacity-90 self-start">+ Create Shipment</button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tracking ID, sender, receiver..." className="w-full pl-10 pr-4 py-2.5 bg-[#111111] border border-[#2a2a2a] rounded-xl text-white text-sm placeholder-gray-600" />
        </form>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="px-4 py-2.5 bg-[#111111] border border-[#2a2a2a] rounded-xl text-white text-sm">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in_transit">In Transit</option>
          <option value="out_for_delivery">Out for Delivery</option>
          <option value="delivered">Delivered</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-16 w-full" />)}</div>
      ) : shipments.length === 0 ? (
        <EmptyState title="No shipments found" message="Create your first shipment to get started." icon={HiTruck} />
      ) : (
        <div className="glass overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-[#2a2a2a]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tracking ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Sender</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Receiver</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Priority</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-[#1a1a1a]">
                {shipments.map(s => (
                  <tr key={s._id} className="hover:bg-[#0a0a0a] transition-colors">
                    <td className="px-4 py-3 text-sm font-mono text-cyan-400">{s.trackingId}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{s.senderName}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{s.receiverName}</td>
                    <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                    <td className="px-4 py-3 text-sm capitalize text-gray-400">{s.priority}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{new Date(s.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => navigate(`/track/${s.trackingId}`)} className="p-2 rounded-lg hover:bg-cyan-500/10 text-gray-500 hover:text-cyan-400 transition-colors"><HiEye className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(s._id)} className="p-2 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-colors"><HiTrash className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-[#2a2a2a]">
              <p className="text-sm text-gray-500">Page {pagination.current} of {pagination.pages}</p>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 bg-[#181818] border border-[#2a2a2a] rounded-lg text-sm text-gray-400 disabled:opacity-40 hover:border-[#333]">Prev</button>
                <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages} className="px-3 py-1.5 bg-[#181818] border border-[#2a2a2a] rounded-lg text-sm text-gray-400 disabled:opacity-40 hover:border-[#333]">Next</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShipmentList;
