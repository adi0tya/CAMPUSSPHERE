import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import API from '../../api/axios';
import { useSocket } from '../../context/SocketContext';
import StatusBadge from '../../components/common/StatusBadge';
import toast from 'react-hot-toast';
import { HiArrowPath } from 'react-icons/hi2';

const statuses = [
  { value: 'received_at_warehouse', label: 'Received at Warehouse' },
  { value: 'in_transit', label: 'In Transit' },
  { value: 'out_for_delivery', label: 'Out for Delivery' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'failed', label: 'Failed' },
];

const UpdateStatus = () => {
  const location = useLocation();
  const socket = useSocket();
  const [shipments, setShipments] = useState([]);
  const [selected, setSelected] = useState(location.state?.shipment || null);
  const [newStatus, setNewStatus] = useState('');
  const [statusLocation, setStatusLocation] = useState('');
  const [note, setNote] = useState('');
  const [failureReason, setFailureReason] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (!selected) fetchShipments(); }, []);
  const fetchShipments = async () => { try { const { data } = await API.get('/api/shipments/employee/assigned', { params: { limit: 50 } }); setShipments(data.shipments.filter(s => !['delivered', 'returned'].includes(s.status))); } catch (err) { console.error(err); } };

  const handleUpdate = async () => {
    if (!newStatus) return toast.error('Select a status');
    if (newStatus === 'failed' && !failureReason) return toast.error('Provide failure reason');
    setLoading(true);
    try {
      await API.put(`/api/shipments/${selected._id}/status`, { status: newStatus, location: statusLocation, note, failureReason });
      if (socket) socket.emit('shipment:status:update', { trackingId: selected.trackingId, status: newStatus, location: statusLocation, timestamp: new Date() });
      toast.success('Status updated!');
      setSelected(null); setNewStatus(''); setNote(''); setStatusLocation(''); setFailureReason(''); fetchShipments();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); } finally { setLoading(false); }
  };

  const ic = "w-full px-4 py-3 bg-black border border-[#2a2a2a] rounded-xl text-white text-sm focus:border-cyan-500 placeholder-gray-600";

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div><h1 className="text-2xl font-bold text-white">Update Status</h1><p className="text-gray-600 text-sm">Update shipment delivery status</p></div>

      {!selected ? (
        <div className="space-y-3">
          <p className="text-gray-500 text-sm">Select a shipment:</p>
          {shipments.length === 0 ? <p className="text-gray-600 text-center py-8">No active shipments</p> : shipments.map(s => (
            <button key={s._id} onClick={() => setSelected(s)} className="w-full glass p-4 text-left hover:border-cyan-500/30 transition-colors">
              <div className="flex justify-between items-center">
                <span className="font-mono text-cyan-400 text-sm">{s.trackingId}</span>
                <StatusBadge status={s.status} />
              </div>
              <p className="text-xs text-gray-600 mt-1">{s.receiverName} • {s.receiverAddress?.substring(0, 50)}</p>
            </button>
          ))}
        </div>
      ) : (
        <div className="glass p-6 space-y-5 animate-fade-in">
          <div className="flex justify-between items-center">
            <div><span className="text-lg font-mono text-cyan-400 font-bold">{selected.trackingId}</span><p className="text-xs text-gray-600 mt-1">Current: <StatusBadge status={selected.status} /></p></div>
            <button onClick={() => setSelected(null)} className="text-sm text-gray-500 hover:text-white">Change</button>
          </div>

          <div><label className="block text-sm text-gray-500 mb-2">New Status *</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {statuses.map(s => (
                <button key={s.value} onClick={() => setNewStatus(s.value)} className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${newStatus === s.value ? 'bg-cyan-500 text-white scale-105' : 'bg-[#181818] border border-[#2a2a2a] text-gray-500 hover:text-white'}`}>{s.label}</button>
              ))}
            </div>
          </div>

          <div><label className="block text-sm text-gray-500 mb-1">Location</label><input value={statusLocation} onChange={e => setStatusLocation(e.target.value)} placeholder="Current location" className={ic} /></div>
          <div><label className="block text-sm text-gray-500 mb-1">Note</label><textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Optional note" className={`${ic} h-20 resize-none`} /></div>
          {newStatus === 'failed' && <div><label className="block text-sm text-gray-500 mb-1">Failure Reason *</label><input value={failureReason} onChange={e => setFailureReason(e.target.value)} placeholder="Why?" className={ic} /></div>}

          <button onClick={handleUpdate} disabled={loading} className="w-full py-3 gradient-cyan rounded-xl text-white font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><HiArrowPath className="w-5 h-5" /> Update Status</>}
          </button>
        </div>
      )}
    </div>
  );
};

export default UpdateStatus;
