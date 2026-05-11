import { useState, useEffect } from 'react';
import API from '../../api/axios';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import { HiTruck, HiClock, HiCheckCircle, HiExclamationCircle } from 'react-icons/hi2';

const EmployeeDashboard = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => { try { const { data } = await API.get('/api/shipments/employee/assigned', { params: { limit: 50 } }); setShipments(data.shipments); } catch (err) { console.error(err); } finally { setLoading(false); } };

  const pending = shipments.filter(s => ['pending', 'picked_up', 'received_at_warehouse'].includes(s.status)).length;
  const active = shipments.filter(s => ['in_transit', 'out_for_delivery'].includes(s.status)).length;
  const delivered = shipments.filter(s => s.status === 'delivered').length;
  const failed = shipments.filter(s => s.status === 'failed').length;

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">Employee Dashboard</h1><p className="text-gray-600 text-sm">Your delivery overview</p></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Pending" value={pending} icon={HiClock} color="warning" />
        <StatCard title="Active" value={active} icon={HiTruck} color="info" />
        <StatCard title="Completed" value={delivered} icon={HiCheckCircle} color="success" />
        <StatCard title="Failed" value={failed} icon={HiExclamationCircle} color="danger" />
      </div>
      <div className="glass p-6">
        <h3 className="text-base font-semibold text-white mb-4">Recent Assignments</h3>
        {shipments.length === 0 ? <p className="text-gray-600 text-center py-8">No shipments assigned yet</p> : (
          <div className="space-y-3">
            {shipments.slice(0, 5).map(s => (
              <div key={s._id} className="flex items-center justify-between p-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl hover:border-[#2a2a2a] transition-colors">
                <div>
                  <p className="text-sm font-mono text-cyan-400">{s.trackingId}</p>
                  <p className="text-xs text-gray-600 mt-1">{s.receiverName} • {s.receiverAddress?.substring(0, 40)}...</p>
                </div>
                <StatusBadge status={s.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
