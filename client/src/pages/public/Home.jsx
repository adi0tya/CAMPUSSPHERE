import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiMagnifyingGlass, HiTruck, HiShieldCheck, HiClock, HiGlobeAlt } from 'react-icons/hi2';

const Home = () => {
  const [trackingId, setTrackingId] = useState('');
  const navigate = useNavigate();

  const handleTrack = (e) => {
    e.preventDefault();
    if (trackingId.trim()) navigate(`/track/${trackingId.trim().toUpperCase()}`);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/3 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/3 rounded-full blur-3xl" />
      </div>

      <header className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-cyan flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
          </div>
          <span className="text-xl font-bold text-white">Track<span className="text-gradient">Sphere</span></span>
        </div>
        <button onClick={() => navigate('/select-role')} className="px-6 py-2.5 gradient-cyan rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity">Login</button>
      </header>

      <main className="relative z-10 flex flex-col items-center justify-center px-6 pt-20 pb-32">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/8 border border-cyan-500/15 mb-8">
          <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          <span className="text-cyan-400 text-sm font-medium">Real-Time Tracking Active</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white text-center max-w-4xl leading-tight mb-6">
          Track Your <span className="text-gradient">Shipments</span> in Real-Time
        </h1>

        <p className="text-gray-500 text-lg md:text-xl text-center max-w-2xl mb-12">
          Enterprise-grade logistics tracking platform. Monitor shipments, manage warehouses, and deliver excellence.
        </p>

        <form onSubmit={handleTrack} className="w-full max-w-lg">
          <div className="relative">
            <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-600" />
            <input type="text" value={trackingId} onChange={(e) => setTrackingId(e.target.value)} placeholder="Enter tracking ID (e.g., TS-DEL-2026-1001)"
              className="w-full pl-12 pr-36 py-4 bg-[#111111] border border-[#2a2a2a] rounded-2xl text-white text-lg placeholder-gray-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10" />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 gradient-cyan rounded-xl text-white font-semibold hover:opacity-90 transition-opacity">Track Now</button>
          </div>
        </form>

        {/* Sample IDs */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {['TS-DEL-2026-1001', 'TS-MUM-2026-1002', 'TS-BLR-2026-1003'].map(id => (
            <button key={id} onClick={() => { setTrackingId(id); navigate(`/track/${id}`); }}
              className="px-3 py-1.5 bg-[#111111] border border-[#2a2a2a] rounded-lg text-xs font-mono text-cyan-400 hover:border-cyan-500/30 transition-colors">
              {id}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-4xl w-full">
          {[
            { icon: HiTruck, label: 'Live Tracking', desc: 'Real-time GPS tracking' },
            { icon: HiShieldCheck, label: 'Secure', desc: 'End-to-end encryption' },
            { icon: HiClock, label: '24/7 Updates', desc: 'Always stay informed' },
            { icon: HiGlobeAlt, label: 'Nationwide', desc: 'Pan-India coverage' },
          ].map((f, i) => (
            <div key={i} className="glass p-6 text-center card-hover">
              <f.icon className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-1">{f.label}</h3>
              <p className="text-gray-600 text-xs">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
