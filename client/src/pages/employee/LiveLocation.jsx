import { useState, useEffect } from 'react';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import MapView from '../../components/maps/MapView';
import { HiMapPin, HiSignal } from 'react-icons/hi2';
import toast from 'react-hot-toast';

const LiveLocation = () => {
  const { user } = useAuth();
  const socket = useSocket();
  const [sharing, setSharing] = useState(false);
  const [position, setPosition] = useState(null);
  const [watchId, setWatchId] = useState(null);

  const startSharing = () => {
    if (!navigator.geolocation) return toast.error('Geolocation not supported');
    const id = navigator.geolocation.watchPosition(
      (pos) => { const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude }; setPosition(loc); if (socket) socket.emit('employee:location:update', { userId: user._id, ...loc }); },
      () => toast.error('Location access denied'),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );
    setWatchId(id); setSharing(true); toast.success('Sharing started');
  };

  const stopSharing = () => { if (watchId !== null) navigator.geolocation.clearWatch(watchId); setSharing(false); setWatchId(null); toast.success('Stopped'); };
  useEffect(() => () => { if (watchId !== null) navigator.geolocation.clearWatch(watchId); }, [watchId]);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div><h1 className="text-2xl font-bold text-white">Live Location</h1><p className="text-gray-600 text-sm">Share your GPS location in real-time</p></div>
      <div className="glass p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${sharing ? 'bg-emerald-400 animate-pulse' : 'bg-gray-600'}`} />
            <span className="text-white font-medium">{sharing ? 'Sharing' : 'Off'}</span>
          </div>
          <button onClick={sharing ? stopSharing : startSharing} className={`px-6 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 ${sharing ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'gradient-cyan text-white'}`}>
            <HiSignal className="w-5 h-5" />{sharing ? 'Stop' : 'Start Sharing'}
          </button>
        </div>
        {position ? <MapView center={[position.lat, position.lng]} zoom={15} markers={[{ lat: position.lat, lng: position.lng, title: 'You' }]} /> : (
          <div className="flex flex-col items-center py-16"><HiMapPin className="w-16 h-16 text-gray-700 mb-4" /><p className="text-gray-600">Start sharing to see your location</p></div>
        )}
      </div>
    </div>
  );
};

export default LiveLocation;
