import { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { HiPlus, HiPencil, HiTrash, HiBuildingOffice2 } from 'react-icons/hi2';
import EmptyState from '../../components/common/EmptyState';

const WarehouseManagement = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', address: '', city: '', latitude: '', longitude: '', capacity: '', phone: '' });

  useEffect(() => { fetchWarehouses(); }, []);
  const fetchWarehouses = async () => { try { const { data } = await API.get('/api/warehouses'); setWarehouses(data.warehouses); } catch (err) { console.error(err); } finally { setLoading(false); } };
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.address || !form.city || !form.latitude || !form.longitude) return toast.error('Fill required fields');
    try {
      const payload = { ...form, latitude: parseFloat(form.latitude), longitude: parseFloat(form.longitude), capacity: parseInt(form.capacity) || 1000 };
      if (editing) { await API.put(`/api/warehouses/${editing}`, payload); toast.success('Updated'); }
      else { await API.post('/api/warehouses', payload); toast.success('Created'); }
      setShowModal(false); setEditing(null); setForm({ name: '', address: '', city: '', latitude: '', longitude: '', capacity: '', phone: '' }); fetchWarehouses();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleEdit = (wh) => { setForm({ name: wh.name, address: wh.address, city: wh.city, latitude: wh.latitude, longitude: wh.longitude, capacity: wh.capacity, phone: wh.phone || '' }); setEditing(wh._id); setShowModal(true); };
  const handleDelete = async (id) => { if (!window.confirm('Delete?')) return; try { await API.delete(`/api/warehouses/${id}`); toast.success('Deleted'); fetchWarehouses(); } catch (err) { toast.error('Failed'); } };

  const ic = "w-full px-4 py-3 bg-black border border-[#2a2a2a] rounded-xl text-white placeholder-gray-600 text-sm focus:border-cyan-500";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div><h1 className="text-2xl font-bold text-white">Warehouses</h1><p className="text-gray-600 text-sm">Manage logistics hubs</p></div>
        <button onClick={() => { setEditing(null); setForm({ name: '', address: '', city: '', latitude: '', longitude: '', capacity: '', phone: '' }); setShowModal(true); }} className="px-6 py-2.5 gradient-cyan rounded-xl text-white font-semibold hover:opacity-90 flex items-center gap-2"><HiPlus className="w-5 h-5" /> Add</button>
      </div>

      {loading ? <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-32" />)}</div> : warehouses.length === 0 ? <EmptyState title="No warehouses" icon={HiBuildingOffice2} /> : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {warehouses.map(wh => (
            <div key={wh._id} className="glass p-5 card-hover">
              <div className="flex items-start justify-between mb-3">
                <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center"><HiBuildingOffice2 className="w-5 h-5 text-purple-400" /></div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${wh.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>{wh.isActive ? 'Active' : 'Inactive'}</span>
              </div>
              <h3 className="text-base font-semibold text-white mb-1">{wh.name}</h3>
              <p className="text-gray-500 text-sm">{wh.city}</p>
              <p className="text-gray-600 text-xs mt-1 mb-3">{wh.address}</p>
              <div className="text-xs text-gray-600">Capacity: {wh.capacity}</div>
              <div className="flex gap-2 mt-4 pt-3 border-t border-[#2a2a2a]">
                <button onClick={() => handleEdit(wh)} className="flex-1 py-2 bg-[#181818] rounded-lg text-sm text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/5 transition-colors flex items-center justify-center gap-1"><HiPencil className="w-3.5 h-3.5" /> Edit</button>
                <button onClick={() => handleDelete(wh._id)} className="flex-1 py-2 bg-[#181818] rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-colors flex items-center justify-center gap-1"><HiTrash className="w-3.5 h-3.5" /> Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-white mb-6">{editing ? 'Edit' : 'Add'} Warehouse</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm text-gray-500 mb-1">Name *</label><input name="name" value={form.name} onChange={handleChange} className={ic} /></div>
              <div><label className="block text-sm text-gray-500 mb-1">Address *</label><input name="address" value={form.address} onChange={handleChange} className={ic} /></div>
              <div><label className="block text-sm text-gray-500 mb-1">City *</label><input name="city" value={form.city} onChange={handleChange} className={ic} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm text-gray-500 mb-1">Latitude *</label><input name="latitude" type="number" step="any" value={form.latitude} onChange={handleChange} className={ic} /></div>
                <div><label className="block text-sm text-gray-500 mb-1">Longitude *</label><input name="longitude" type="number" step="any" value={form.longitude} onChange={handleChange} className={ic} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm text-gray-500 mb-1">Capacity</label><input name="capacity" type="number" value={form.capacity} onChange={handleChange} className={ic} /></div>
                <div><label className="block text-sm text-gray-500 mb-1">Phone</label><input name="phone" value={form.phone} onChange={handleChange} className={ic} /></div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 py-3 gradient-cyan rounded-xl text-white font-semibold">{editing ? 'Update' : 'Create'}</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 bg-[#181818] border border-[#2a2a2a] rounded-xl text-gray-400">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WarehouseManagement;
