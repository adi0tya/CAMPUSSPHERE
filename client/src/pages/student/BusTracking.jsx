import { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { HiTruck, HiMapPin, HiTicket, HiQrCode } from 'react-icons/hi2';
import EmptyState from '../../components/common/EmptyState';

const BusTracking = () => {
  const [routes, setRoutes] = useState([]);
  const [busPass, setBusPass] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [routesRes, passRes] = await Promise.all([
        API.get('/api/buses/routes'),
        API.get('/api/buses/my-pass')
      ]);
      setRoutes(routesRes.data.routes || []);
      setBusPass(passRes.data.pass || null);
    } catch (err) {
      toast.error('Failed to load bus tracking data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApplyPass = async (routeId) => {
    try {
      await API.post('/api/buses/apply-pass', { routeId });
      toast.success('Bus pass application submitted!');
      fetchData();
    } catch (err) {
      toast.error('Application failed');
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">College Bus Tracking</h1>
        <p className="text-gray-600 text-sm">Real-time bus schedules and digital bus pass management</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Route Information */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <HiMapPin className="text-cyan-400" /> Active Routes
          </h2>
          {routes.length === 0 ? <EmptyState title="No active routes" icon={HiTruck} /> : (
            <div className="space-y-4">
              {routes.map(r => (
                <div key={r._id} className="glass p-5 card-hover">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-white font-semibold text-lg">{r.routeName}</h3>
                      <div className="flex gap-4 mt-2">
                        <div className="text-xs text-gray-500">
                          <p className="font-bold text-gray-400">PICKUP</p>
                          <p>{r.pickupPoint} ({r.pickupTime})</p>
                        </div>
                        <div className="text-xs text-gray-500">
                          <p className="font-bold text-gray-400">BUS NUMBER</p>
                          <p className="text-cyan-400 font-mono">{r.busNumber}</p>
                        </div>
                      </div>
                    </div>
                    {!busPass && (
                      <button onClick={() => handleApplyPass(r._id)} className="btn-primary text-xs py-2">
                        Apply Pass
                      </button>
                    )}
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-500 w-[65%] animate-pulse"></div>
                    </div>
                    <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">LIVE IN 12 MIN</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Digital Bus Pass */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <HiTicket className="text-cyan-400" /> Digital Bus Pass
          </h2>
          {busPass ? (
            <div className={`glass p-6 border-t-4 ${busPass.status === 'Active' ? 'border-emerald-500' : 'border-amber-500'} relative overflow-hidden`}>
              <div className="absolute -right-8 -bottom-8 text-white/5 transform -rotate-12">
                <HiTruck className="w-32 h-32" />
              </div>
              <div className="relative z-10 text-center">
                <div className="w-24 h-24 bg-white rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <HiQrCode className="w-20 h-20 text-black" />
                </div>
                <h3 className="text-white font-bold">{busPass.user?.name}</h3>
                <p className="text-gray-500 text-xs mt-1">Route: {busPass.route?.routeName}</p>
                <div className="mt-6 flex justify-between items-center text-[10px]">
                  <div className="text-left">
                    <p className="text-gray-600 font-bold">STATUS</p>
                    <p className={busPass.status === 'Active' ? 'text-emerald-400' : 'text-amber-400'}>{busPass.status.toUpperCase()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600 font-bold">EXPIRES</p>
                    <p className="text-gray-400">{new Date(busPass.expiryDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass p-10 text-center border-dashed border-white/5">
              <HiTicket className="w-12 h-12 text-gray-800 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Apply for a bus pass to see your digital QR card here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusTracking;
