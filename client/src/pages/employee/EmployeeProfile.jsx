import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const EmployeeProfile = () => {
  const { user, fetchUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', vehicleNumber: user?.vehicleNumber || '' });
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => { e.preventDefault(); setLoading(true); try { await API.put('/api/auth/profile', form); await fetchUser(); toast.success('Updated'); } catch { toast.error('Failed'); } finally { setLoading(false); } };
  const handlePassword = async (e) => { e.preventDefault(); if (!passForm.currentPassword || !passForm.newPassword) return toast.error('Fill all fields'); try { await API.put('/api/auth/change-password', passForm); toast.success('Password updated'); setPassForm({ currentPassword: '', newPassword: '' }); } catch (err) { toast.error(err.response?.data?.message || 'Failed'); } };

  const ic = "w-full px-4 py-3 bg-black border border-[#2a2a2a] rounded-xl text-white text-sm focus:border-cyan-500";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">Profile</h1>
      <div className="glass p-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl gradient-success flex items-center justify-center text-white text-2xl font-bold">{user?.name?.charAt(0)}</div>
        <div><p className="text-xl font-bold text-white">{user?.name}</p><p className="text-gray-500">{user?.email}</p>
          <div className="flex gap-2 mt-1">
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 capitalize">{user?.role}</span>
            {user?.employeeType && <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 capitalize">{user?.employeeType}</span>}
          </div>
        </div>
      </div>
      <form onSubmit={handleUpdate} className="glass p-6 space-y-4">
        <h3 className="text-base font-semibold text-white">Edit Profile</h3>
        <div><label className="block text-sm text-gray-500 mb-1">Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={ic} /></div>
        <div><label className="block text-sm text-gray-500 mb-1">Phone</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className={ic} /></div>
        {user?.employeeType === 'driver' && <div><label className="block text-sm text-gray-500 mb-1">Vehicle Number</label><input value={form.vehicleNumber} onChange={e => setForm({ ...form, vehicleNumber: e.target.value })} className={ic} /></div>}
        <button type="submit" disabled={loading} className="px-6 py-2.5 gradient-cyan rounded-xl text-white font-semibold disabled:opacity-50">Save</button>
      </form>
      <form onSubmit={handlePassword} className="glass p-6 space-y-4">
        <h3 className="text-base font-semibold text-white">Change Password</h3>
        <div><label className="block text-sm text-gray-500 mb-1">Current Password</label><input type="password" value={passForm.currentPassword} onChange={e => setPassForm({ ...passForm, currentPassword: e.target.value })} className={ic} /></div>
        <div><label className="block text-sm text-gray-500 mb-1">New Password</label><input type="password" value={passForm.newPassword} onChange={e => setPassForm({ ...passForm, newPassword: e.target.value })} className={ic} /></div>
        <button type="submit" className="px-6 py-2.5 bg-[#181818] border border-[#2a2a2a] rounded-xl text-white font-semibold hover:border-[#333]">Update</button>
      </form>
    </div>
  );
};

export default EmployeeProfile;
