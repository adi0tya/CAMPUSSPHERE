const statusConfig = {
  pending: { label: 'Pending', bg: 'bg-amber-500/10', text: 'text-amber-400', dot: 'bg-amber-400' },
  picked_up: { label: 'Picked Up', bg: 'bg-blue-500/10', text: 'text-blue-400', dot: 'bg-blue-400' },
  received_at_warehouse: { label: 'At Warehouse', bg: 'bg-purple-500/10', text: 'text-purple-400', dot: 'bg-purple-400' },
  in_transit: { label: 'In Transit', bg: 'bg-cyan-500/10', text: 'text-cyan-400', dot: 'bg-cyan-400' },
  out_for_delivery: { label: 'Out for Delivery', bg: 'bg-orange-500/10', text: 'text-orange-400', dot: 'bg-orange-400' },
  delivered: { label: 'Delivered', bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  failed: { label: 'Failed', bg: 'bg-red-500/10', text: 'text-red-400', dot: 'bg-red-400' },
  returned: { label: 'Returned', bg: 'bg-gray-500/10', text: 'text-gray-400', dot: 'bg-gray-400' }
};

const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || { label: status, bg: 'bg-gray-500/10', text: 'text-gray-400', dot: 'bg-gray-400' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};

export default StatusBadge;
