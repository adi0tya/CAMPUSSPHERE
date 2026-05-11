const statusIcons = {
  pending: '📦', picked_up: '🚛', received_at_warehouse: '🏭',
  in_transit: '✈️', out_for_delivery: '🚚', delivered: '✅', failed: '❌', returned: '↩️'
};

const ShipmentTimeline = ({ history = [] }) => {
  if (!history.length) return <p className="text-gray-600 text-sm">No timeline data</p>;

  return (
    <div className="relative pl-8">
      <div className="absolute left-3 top-2 bottom-2 w-px bg-[#2a2a2a]" />
      {history.map((item, i) => (
        <div key={i} className="relative pb-6 last:pb-0">
          <div className={`absolute left-[-21px] w-7 h-7 rounded-full flex items-center justify-center text-xs border-2 ${i === 0 ? 'bg-cyan-500/20 border-cyan-500' : 'bg-[#111111] border-[#2a2a2a]'}`}>
            {statusIcons[item.status] || '•'}
          </div>
          <div className="ml-4">
            <p className={`text-sm font-medium capitalize ${i === 0 ? 'text-cyan-400' : 'text-white'}`}>
              {item.status?.replace(/_/g, ' ')}
            </p>
            {item.location && <p className="text-xs text-gray-500 mt-0.5">📍 {item.location}</p>}
            {item.note && <p className="text-xs text-gray-600 mt-0.5">{item.note}</p>}
            <p className="text-xs text-gray-700 mt-1">
              {new Date(item.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShipmentTimeline;
