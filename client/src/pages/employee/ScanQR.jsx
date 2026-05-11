import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import QRScanner from '../../components/shipment/QRScanner';
import StatusBadge from '../../components/common/StatusBadge';
import toast from 'react-hot-toast';

const ScanQR = () => {
  const [shipment, setShipment] = useState(null);
  const [scanning, setScanning] = useState(true);
  const navigate = useNavigate();

  const handleScan = async (trackingId) => {
    try { setScanning(false); const { data } = await API.get(`/api/shipments/scan/${trackingId}`); setShipment(data.shipment); toast.success('Shipment found!'); }
    catch { toast.error('Shipment not found'); setScanning(true); }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center"><h1 className="text-2xl font-bold text-white">Scan QR Code</h1><p className="text-gray-600 text-sm">Scan shipment QR to view details</p></div>
      {scanning ? (
        <div className="glass p-6"><QRScanner onScan={handleScan} /></div>
      ) : shipment ? (
        <div className="glass p-6 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-lg font-mono text-cyan-400 font-bold">{shipment.trackingId}</span>
            <StatusBadge status={shipment.status} />
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-gray-600">Sender:</span> <span className="text-white">{shipment.senderName}</span></div>
            <div><span className="text-gray-600">Receiver:</span> <span className="text-white">{shipment.receiverName}</span></div>
            <div><span className="text-gray-600">Package:</span> <span className="text-white capitalize">{shipment.packageType}</span></div>
            <div><span className="text-gray-600">Priority:</span> <span className="text-white capitalize">{shipment.priority}</span></div>
          </div>
          <div className="flex gap-3 pt-4">
            <button onClick={() => navigate('/employee/update-status', { state: { shipment } })} className="flex-1 py-3 gradient-cyan rounded-xl text-white font-semibold">Update Status</button>
            <button onClick={() => { setShipment(null); setScanning(true); }} className="flex-1 py-3 bg-[#181818] border border-[#2a2a2a] rounded-xl text-gray-400">Scan Again</button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ScanQR;
