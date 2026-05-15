import { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { HiMagnifyingGlass, HiPlus, HiHandRaised, HiCheckBadge } from 'react-icons/hi2';
import EmptyState from '../../components/common/EmptyState';

const LostFound = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', location: '', type: 'Lost', date: '' });

  const fetchItems = async () => {
    try {
      const { data } = await API.get('/api/lost-found');
      setItems(data.items || []);
    } catch (err) {
      toast.error('Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/api/lost-found', formData);
      toast.success('Item posted successfully!');
      setShowForm(false);
      setFormData({ title: '', description: '', location: '', type: 'Lost', date: '' });
      fetchItems();
    } catch (err) {
      toast.error('Failed to post item');
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Lost & Found</h1>
          <p className="text-gray-600 text-sm">Report lost belongings or find items you've misplaced</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <HiPlus /> Report Item
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="glass p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <h2 className="col-span-full text-lg font-bold text-white mb-2">Item Details</h2>
          <div className="md:col-span-2 flex gap-4">
            <button type="button" onClick={() => setFormData({...formData, type: 'Lost'})} className={`flex-1 py-3 rounded-xl border font-bold transition-all ${formData.type === 'Lost' ? 'border-red-500 bg-red-500/10 text-red-400' : 'border-white/5 bg-white/5 text-gray-500'}`}>LOST</button>
            <button type="button" onClick={() => setFormData({...formData, type: 'Found'})} className={`flex-1 py-3 rounded-xl border font-bold transition-all ${formData.type === 'Found' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-white/5 bg-white/5 text-gray-500'}`}>FOUND</button>
          </div>
          <input required placeholder="Item Name (e.g. Blue Wallet)" className="input-field" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          <input required placeholder="Location (e.g. Library Desk 4)" className="input-field" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
          <input type="date" className="input-field md:col-span-2" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
          <textarea required placeholder="Brief description of the item..." className="input-field md:col-span-2 resize-none" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
          <div className="md:col-span-2 flex justify-end gap-3">
            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 text-gray-500">Cancel</button>
            <button type="submit" className="btn-primary">Post Item</button>
          </div>
        </form>
      )}

      {items.length === 0 ? <EmptyState title="Nothing reported yet" icon={HiMagnifyingGlass} /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {items.map(item => (
            <div key={item._id} className={`glass p-5 border-l-4 card-hover ${item.type === 'Lost' ? 'border-red-500' : 'border-emerald-500'}`}>
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${item.type === 'Lost' ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                  {item.type}
                </span>
                <span className="text-[10px] text-gray-600">{new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2">{item.description}</p>
              <div className="flex flex-col gap-2 pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <HiHandRaised className="text-gray-600" />
                  <span>Located at: <span className="text-gray-300 font-medium">{item.location}</span></span>
                </div>
                {item.status === 'Resolved' ? (
                  <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold mt-2">
                    <HiCheckBadge /> ITEM RECOVERED
                  </div>
                ) : (
                  <p className="text-[10px] text-gray-600 mt-2">Posted by: {item.user?.name}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LostFound;
