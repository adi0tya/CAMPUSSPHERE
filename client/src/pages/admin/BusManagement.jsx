import { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { HiTruck, HiPlus, HiCheck, HiXMark } from 'react-icons/hi2';
import EmptyState from '../../components/common/EmptyState';

const BusManagement = () => {
  const [routes, setRoutes] = useState([]);
  const [passes, setPasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddRoute, setShowAddRoute] = useState(false);
  const [newRoute, setNewRoute] = useState({ routeName: '', busNumber: '', driverName: '', pickupPoint: '', pickupTime: '' });

  const fetchData = async () => {
    try {
      const [routesRes, passesRes] = await Promise.all([
        API.get('/api/buses/routes'),
        API.get('/api/buses/all-passes')
      ]);
      setRoutes(routesRes.data.routes || []);
      setPasses(passesRes.data.passes || []);
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddRoute = async (e) => {
    e.preventDefault();
    try {
      await API.post('/api/buses/routes', newRoute);
      toast.success('New route added');
      setShowAddRoute(false);
      fetchData();
    } catch (err) {
      toast.error('Failed to add route');
    }
  };

  const handlePassStatus = async (id, status) => {
    try {
      await API.put(`/api/buses/pass/${id}`, { status });
      toast.success(`Pass ${status}`);
      fetchData();
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Transport Management</h1>
          <p className="text-gray-600 text-sm">Manage bus routes and verify student passes</p>
        </div>
        <button onClick={() => setShowAddRoute(true)} className="btn-primary flex items-center gap-2">
          <HiPlus /> Add Route
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Pass Requests */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <HiCheck className="text-amber-400" /> Pass Applications
          </h2>
          {passes.filter(p => p.status === 'Pending').length === 0 ? (
            <div className="glass p-8 text-center text-gray-500 text-sm">No pending pass applications</div>
          ) : (
            <div className="space-y-3">
              {passes.filter(p => p.status === 'Pending').map(p => (
                <div key={p._id} className="glass p-4 flex justify-between items-center">
                  <div>
                    <h4 className="text-white font-medium">{p.user?.name}</h4>
                    <p className="text-gray-500 text-xs">Route: {p.route?.routeName}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handlePassStatus(p._id, 'Active')} className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"><HiCheck /></button>
                    <button onClick={() => handlePassStatus(p._id, 'Rejected')} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"><HiXMark /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Route Catalog */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <HiTruck className="text-cyan-400" /> Current Routes
          </h2>
          <div className="glass overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-[10px] uppercase tracking-wider text-gray-400">
                <tr>
                  <th className="px-4 py-3">Route & Bus</th>
                  <th className="px-4 py-3">Schedule</th>
                  <th className="px-4 py-3">Driver</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {routes.map(r => (
                  <tr key={r._id} className="text-sm hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-white font-medium">{r.routeName}</p>
                      <p className="text-cyan-400 text-xs font-mono">{r.busNumber}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      <p>{r.pickupPoint}</p>
                      <p className="text-[10px]">{r.pickupTime}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{r.driverName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusManagement;
