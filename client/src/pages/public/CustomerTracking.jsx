import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../../api/axios';
import ShipmentTimeline from '../../components/shipment/ShipmentTimeline';
import LiveTrackingMap from '../../components/maps/LiveTrackingMap';
import MapView from '../../components/maps/MapView';
import StatusBadge from '../../components/common/StatusBadge';
import QRCodeBox from '../../components/shipment/QRCodeBox';
import { HiArrowLeft, HiTruck } from 'react-icons/hi2';

const CustomerTracking = () => {
  const { trackingId } = useParams();
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchShipment(); }, [trackingId]);

  const fetchShipment = async () => {
    try { setLoading(true); const { data } = await API.get(`/api/shipments/track/${trackingId}`); setShipment(data.shipment); }
    catch (err) { setError(err.response?.data?.message || 'Shipment not found'); }
    finally { setLoading(false); }
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="text-center">
        <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
          <HiTruck className="w-10 h-10 text-red-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Shipment Not Found</h2>
        <p className="text-gray-500 mb-6">{error}</p>
        <Link to="/" className="px-6 py-3 gradient-cyan rounded-xl text-white font-semibold">Go Home</Link>
      </div>
    </div>
  );

  const markers = [];
  if (shipment.currentLocation?.lat) markers.push({ lat: shipment.currentLocation.lat, lng: shipment.currentLocation.lng, title: 'Current Location', description: shipment.currentLocation.address });

  return (
    <div className="min-h-screen bg-black p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm">
            <HiArrowLeft className="w-4 h-4" /> Back
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-cyan flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
            </div>
            <span className="text-white font-bold">Track<span className="text-cyan-400">Sphere</span></span>
          </div>
        </div>

        {/* Tracking ID + Status */}
        <div className="glass p-6 mb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-gray-600 text-xs uppercase tracking-wider mb-1">Tracking ID</p>
              <h1 className="text-2xl md:text-3xl font-bold text-cyan-400 font-mono">{shipment.trackingId}</h1>
            </div>
            <StatusBadge status={shipment.status} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="glass p-5">
            <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">Sender</h3>
            <p className="text-white font-medium">{shipment.senderName}</p>
          </div>
          <div className="glass p-5">
            <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">Receiver</h3>
            <p className="text-white font-medium">{shipment.receiverName}</p>
            <p className="text-gray-500 text-sm mt-1">{shipment.receiverAddress}</p>
          </div>
        </div>

        {/* Details */}
        <div className="glass p-5 mb-4">
          <h3 className="text-sm font-semibold text-white mb-4">Shipment Details</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div><p className="text-gray-600 text-xs mb-1">Package</p><p className="text-white text-sm capitalize">{shipment.packageType}</p></div>
            <div><p className="text-gray-600 text-xs mb-1">Weight</p><p className="text-white text-sm">{shipment.weight} kg</p></div>
            <div><p className="text-gray-600 text-xs mb-1">Priority</p><p className={`text-sm font-medium capitalize ${shipment.priority === 'urgent' ? 'text-red-400' : shipment.priority === 'high' ? 'text-amber-400' : 'text-white'}`}>{shipment.priority}</p></div>
            <div><p className="text-gray-600 text-xs mb-1">Est. Delivery</p><p className="text-white text-sm">{shipment.estimatedDelivery ? new Date(shipment.estimatedDelivery).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}</p></div>
          </div>
        </div>

        {/* Map */}
        {markers.length > 0 && (
          <div className="glass p-5 mb-4">
            <h3 className="text-sm font-semibold text-white mb-4">📍 {shipment.status === 'out_for_delivery' ? 'Live Location' : 'Current Location'}</h3>
            {shipment.status === 'out_for_delivery' && shipment.assignedEmployee?.currentLocation ? (
              <LiveTrackingMap trackingId={shipment.trackingId} initialPosition={[shipment.assignedEmployee.currentLocation.lat, shipment.assignedEmployee.currentLocation.lng]} />
            ) : (
              <MapView center={[markers[0].lat, markers[0].lng]} zoom={13} markers={markers} />
            )}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-4 mb-4">
          {/* Timeline */}
          <div className="md:col-span-2 glass p-5">
            <h3 className="text-sm font-semibold text-white mb-6">Shipment Timeline</h3>
            <ShipmentTimeline history={[...(shipment.history || [])].reverse()} />
          </div>

          {/* QR Code */}
          <div className="glass p-5 flex flex-col items-center justify-center">
            <h3 className="text-sm font-semibold text-white mb-4">QR Code</h3>
            <QRCodeBox value={shipment.trackingId} size={160} />
            <p className="text-gray-600 text-xs mt-3 text-center">Scan to track this shipment</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerTracking;
