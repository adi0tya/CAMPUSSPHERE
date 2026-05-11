import { useState, useEffect } from 'react';
import API from '../../api/axios';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import { HiTruck, HiMapPin } from 'react-icons/hi2';

const AssignedShipments = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => { fetchShipments(); }, [statusFilter]);
  const fetchShipments = async () => { try { const params = { limit: 50 }; if (statusFilter) params.status = statusFilter; const { data } = await API.get('/api/shipments/employee/assigned', { params }); setShipments(data.shipments); } catch (err) { console.error(err); } finally { setLoading(false); } };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">Assigned Shipments</h1></div>
      <div className="flex gap-2 flex-wrap">
        {['', 'pending', 'in_transit', 'out_for_delivery', 'delivered', 'failed'].map(f => (
          <button key={f} onClick={() => setStatusFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${statusFilter === f ? 'bg-cyan-500 text-white' : 'bg-[#111111] border border-[#2a2a2a] text-gray-500'}`}>
            {f === '' ? 'All' : f.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
          </button>
        ))}
      </div>
      {loading ? <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-24" />)}</div> : shipments.length === 0 ? <EmptyState title="No shipments" icon={HiTruck} /> : (
        <div className="space-y-3">
          {shipments.map(s => (
            <div key={s._id} onClick={() => setSelected(selected?._id === s._id ? null : s)} className="glass p-5 cursor-pointer card-hover">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-mono text-cyan-400 font-semibold">{s.trackingId}</span>
                <StatusBadge status={s.status} />
              </div>
              <div className="grid md:grid-cols-2 gap-2 text-sm">
                <div><span className="text-gray-600">Receiver:</span> <span className="text-gray-300">{s.receiverName}</span></div>
                <div><span className="text-gray-600">Phone:</span> <span className="text-gray-300">{s.receiverPhone}</span></div>
              </div>
              <p className="text-xs text-gray-600 mt-2 flex items-center gap-1"><HiMapPin className="w-3 h-3" /> {s.receiverAddress}</p>
              {selected?._id === s._id && (
                <div className="mt-4 pt-4 border-t border-[#2a2a2a] space-y-2 text-sm animate-fade-in">
                  <div className="grid grid-cols-2 gap-2">
                    <div><span className="text-gray-600">Package:</span> <span className="text-gray-300 capitalize">{s.packageType}</span></div>
                    <div><span className="text-gray-600">Weight:</span> <span className="text-gray-300">{s.weight} kg</span></div>
                    <div><span className="text-gray-600">Priority:</span> <span className="text-gray-300 capitalize">{s.priority}</span></div>
                    <div><span className="text-gray-600">Warehouse:</span> <span className="text-gray-300">{s.assignedWarehouse?.name || 'N/A'}</span></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignedShipments;
