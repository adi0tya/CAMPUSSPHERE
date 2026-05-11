import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Reports = () => {
  const [tab, setTab] = useState('shipments');
  const [shipmentReport, setShipmentReport] = useState(null);
  const [empPerformance, setEmpPerformance] = useState([]);
  const [whPerformance, setWhPerformance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchReports(); }, []);
  const fetchReports = async () => {
    try {
      const [sr, ep, wp] = await Promise.all([API.get('/api/reports/shipments'), API.get('/api/reports/employees'), API.get('/api/reports/warehouses')]);
      setShipmentReport(sr.data); setEmpPerformance(ep.data.performance); setWhPerformance(wp.data.performance);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">Reports</h1><p className="text-gray-600 text-sm">Analytics and performance</p></div>
      <div className="flex gap-2 overflow-x-auto">
        {[{ id: 'shipments', label: 'Shipments' }, { id: 'employees', label: 'Employees' }, { id: 'warehouses', label: 'Warehouses' }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${tab === t.id ? 'bg-cyan-500 text-white' : 'bg-[#111111] border border-[#2a2a2a] text-gray-500 hover:text-white'}`}>{t.label}</button>
        ))}
      </div>

      {tab === 'shipments' && shipmentReport && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(shipmentReport.summary || {}).map(([key, val]) => (
            <div key={key} className="glass p-4 text-center"><p className="text-2xl font-bold text-white">{val}</p><p className="text-gray-600 text-xs capitalize mt-1">{key}</p></div>
          ))}
        </div>
      )}

      {tab === 'employees' && (
        <div className="space-y-6">
          <div className="glass p-6">
            <Bar data={{ labels: empPerformance.map(e => e.name), datasets: [{ label: 'Delivered', data: empPerformance.map(e => e.delivered), backgroundColor: '#10b981', borderRadius: 4 }, { label: 'Failed', data: empPerformance.map(e => e.failed), backgroundColor: '#ef4444', borderRadius: 4 }] }} options={{ responsive: true, plugins: { legend: { labels: { color: '#888' } } }, scales: { x: { ticks: { color: '#555' }, grid: { display: false } }, y: { ticks: { color: '#555' }, grid: { color: '#1a1a1a' } } } }} />
          </div>
          <div className="glass overflow-hidden">
            <table className="w-full">
              <thead><tr className="border-b border-[#2a2a2a]">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Delivered</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Failed</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Rate</th>
              </tr></thead>
              <tbody className="divide-y divide-[#1a1a1a]">
                {empPerformance.map(e => (
                  <tr key={e._id} className="hover:bg-[#0a0a0a]">
                    <td className="px-6 py-4 text-sm text-white font-medium">{e.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{e.total}</td>
                    <td className="px-6 py-4 text-sm text-emerald-400">{e.delivered}</td>
                    <td className="px-6 py-4 text-sm text-red-400">{e.failed}</td>
                    <td className="px-6 py-4 text-sm text-cyan-400">{e.successRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'warehouses' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {whPerformance.map(w => (
            <div key={w._id} className="glass p-5">
              <h3 className="text-base font-semibold text-white mb-1">{w.name}</h3>
              <p className="text-gray-500 text-sm mb-4">{w.city}</p>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center"><p className="text-xl font-bold text-white">{w.total}</p><p className="text-gray-600 text-xs">Total</p></div>
                <div className="text-center"><p className="text-xl font-bold text-emerald-400">{w.delivered}</p><p className="text-gray-600 text-xs">Delivered</p></div>
                <div className="text-center"><p className="text-xl font-bold text-cyan-400">{w.active}</p><p className="text-gray-600 text-xs">Active</p></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reports;
