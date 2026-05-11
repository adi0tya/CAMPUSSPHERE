import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useSocket } from '../../context/SocketContext';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => { if (center) map.setView(center, 15); }, [center, map]);
  return null;
};

const LiveTrackingMap = ({ trackingId, initialPosition }) => {
  const socket = useSocket();
  const [position, setPosition] = useState(initialPosition || [20.5937, 78.9629]);

  useEffect(() => {
    if (!socket || !trackingId) return;
    socket.emit('shipment:join', trackingId);
    socket.on('shipment:location:update', (data) => {
      if (data.trackingId === trackingId) {
        setPosition([data.lat, data.lng]);
      }
    });
    return () => {
      socket.emit('shipment:leave', trackingId);
      socket.off('shipment:location:update');
    };
  }, [socket, trackingId]);

  return (
    <MapContainer center={position} zoom={13} className="h-[400px] w-full rounded-2xl z-0" scrollWheelZoom={true}>
      <TileLayer attribution='&copy; <a href="https://carto.com/">CARTO</a>' url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
      <MapUpdater center={position} />
      <Marker position={position}>
        <Popup>
          <strong>Live Location</strong><br />
          Tracking: {trackingId}
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default LiveTrackingMap;
