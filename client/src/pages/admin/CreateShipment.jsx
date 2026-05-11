import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const CreateShipment = () => {
  const [form, setForm] = useState({ senderName: '', senderPhone: '', senderAddress: '', receiverName: '', receiverPhone: '', receiverAddress: '', packageType: 'parcel', weight: '', priority: 'medium', assignedEmployee: '', assignedWarehouse: '', estimatedDelivery: '' });
  const [employees, setEmployees] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([API.get('/api/employees'), API.get('/api/warehouses')]).then(([e, w]) => {
      setEmployees(e.data.employees || []);
      setWarehouses(w.data.warehouses || []);
    }).catch(console.error);
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.senderName || !form.senderPhone || !form.senderAddress || !form.receiverName || !form.receiverPhone || !form.receiverAddress) return toast.error('Fill required fields');
    setLoading(true);
    try {
      const payload = { ...form };
      if (!payload.assignedEmployee) delete payload.assignedEmployee;
      if (!payload.assignedWarehouse) delete payload.assignedWarehouse;
      if (payload.weight) payload.weight = parseFloat(payload.weight);
      const { data } = await API.post('/api/shipments', payload);
      toast.success(`Created! Tracking: ${data.shipment.trackingId}`);
      navigate('/admin/shipments');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  const ic = "w-full px-4 py-3 bg-black border border-[#2a2a2a] rounded-xl text-white placeholder-gray-600 text-sm focus:border-cyan-500";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div><h1 className="text-2xl font-bold text-white">Create Shipment</h1><p className="text-gray-600 text-sm">Fill in details to create a new shipment</p></div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass p-6">
          <h3 className="text-base font-semibold text-white mb-4">Sender Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className="block text-sm text-gray-500 mb-1">Name *</label><input name="senderName" value={form.senderName} onChange={handleChange} placeholder="Sender name" className={ic} /></div>
            <div><label className="block text-sm text-gray-500 mb-1">Phone *</label><input name="senderPhone" value={form.senderPhone} onChange={handleChange} placeholder="Phone" className={ic} /></div>
            <div className="md:col-span-2"><label className="block text-sm text-gray-500 mb-1">Address *</label><textarea name="senderAddress" value={form.senderAddress} onChange={handleChange} placeholder="Full address" className={`${ic} h-20 resize-none`} /></div>
          </div>
        </div>
        <div className="glass p-6">
          <h3 className="text-base font-semibold text-white mb-4">Receiver Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className="block text-sm text-gray-500 mb-1">Name *</label><input name="receiverName" value={form.receiverName} onChange={handleChange} placeholder="Receiver name" className={ic} /></div>
            <div><label className="block text-sm text-gray-500 mb-1">Phone *</label><input name="receiverPhone" value={form.receiverPhone} onChange={handleChange} placeholder="Phone" className={ic} /></div>
            <div className="md:col-span-2"><label className="block text-sm text-gray-500 mb-1">Address *</label><textarea name="receiverAddress" value={form.receiverAddress} onChange={handleChange} placeholder="Full address" className={`${ic} h-20 resize-none`} /></div>
          </div>
        </div>
        <div className="glass p-6">
          <h3 className="text-base font-semibold text-white mb-4">Package Details</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div><label className="block text-sm text-gray-500 mb-1">Type</label><select name="packageType" value={form.packageType} onChange={handleChange} className={ic}><option value="document">Document</option><option value="parcel">Parcel</option><option value="fragile">Fragile</option><option value="heavy">Heavy</option><option value="perishable">Perishable</option><option value="electronics">Electronics</option></select></div>
            <div><label className="block text-sm text-gray-500 mb-1">Weight (kg)</label><input type="number" step="0.1" name="weight" value={form.weight} onChange={handleChange} placeholder="0.0" className={ic} /></div>
            <div><label className="block text-sm text-gray-500 mb-1">Priority</label><select name="priority" value={form.priority} onChange={handleChange} className={ic}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="urgent">Urgent</option></select></div>
          </div>
        </div>
        <div className="glass p-6">
          <h3 className="text-base font-semibold text-white mb-4">Assignment</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div><label className="block text-sm text-gray-500 mb-1">Employee</label><select name="assignedEmployee" value={form.assignedEmployee} onChange={handleChange} className={ic}><option value="">Select</option>{employees.map(e => <option key={e._id} value={e._id}>{e.name} ({e.employeeType})</option>)}</select></div>
            <div><label className="block text-sm text-gray-500 mb-1">Warehouse</label><select name="assignedWarehouse" value={form.assignedWarehouse} onChange={handleChange} className={ic}><option value="">Select</option>{warehouses.map(w => <option key={w._id} value={w._id}>{w.name} - {w.city}</option>)}</select></div>
            <div><label className="block text-sm text-gray-500 mb-1">Est. Delivery</label><input type="date" name="estimatedDelivery" value={form.estimatedDelivery} onChange={handleChange} className={ic} /></div>
          </div>
        </div>
        <div className="flex gap-4">
          <button type="submit" disabled={loading} className="px-8 py-3 gradient-cyan rounded-xl text-white font-semibold hover:opacity-90 disabled:opacity-50 flex items-center gap-2">
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Create Shipment'}
          </button>
          <button type="button" onClick={() => navigate('/admin/shipments')} className="px-8 py-3 bg-[#111111] border border-[#2a2a2a] rounded-xl text-gray-400 font-semibold hover:border-[#333]">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default CreateShipment;
