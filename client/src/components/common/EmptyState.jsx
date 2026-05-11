const EmptyState = ({ title = 'No data found', message = '', icon: Icon }) => (
  <div className="glass p-12 text-center">
    {Icon && <div className="w-16 h-16 rounded-2xl bg-[#181818] border border-[#2a2a2a] flex items-center justify-center mx-auto mb-4"><Icon className="w-8 h-8 text-gray-600" /></div>}
    <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
    {message && <p className="text-gray-600 text-sm">{message}</p>}
  </div>
);

export default EmptyState;
