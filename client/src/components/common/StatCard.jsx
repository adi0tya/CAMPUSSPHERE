const StatCard = ({ title, value, icon: Icon, color = 'primary', trend, trendValue }) => {
  const colors = {
    primary: 'from-cyan-500 to-cyan-600 shadow-cyan-500/20',
    success: 'from-emerald-500 to-emerald-600 shadow-emerald-500/20',
    warning: 'from-amber-500 to-amber-600 shadow-amber-500/20',
    danger: 'from-red-500 to-red-600 shadow-red-500/20',
    info: 'from-blue-500 to-blue-600 shadow-blue-500/20',
    purple: 'from-purple-500 to-purple-600 shadow-purple-500/20'
  };

  return (
    <div className="glass p-5 card-hover">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-500 text-xs font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {trend && <p className={`text-xs mt-2 font-medium ${trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>{trend === 'up' ? '↑' : '↓'} {trendValue}</p>}
        </div>
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center shadow-lg`}>
          {Icon && <Icon className="w-5 h-5 text-white" />}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
