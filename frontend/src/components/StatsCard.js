export default function StatsCard({ icon, title, value, subtitle, color = 'indigo' }) {
  const colorClasses = {
    indigo: 'from-indigo-600 to-indigo-700',
    purple: 'from-purple-600 to-purple-700',
    green: 'from-green-600 to-green-700',
    blue: 'from-blue-600 to-blue-700',
    orange: 'from-orange-600 to-orange-700',
  };

  return (
    <div className={`card bg-gradient-to-br ${colorClasses[color]} border-0`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-white/80 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-white mb-1">{value}</p>
          {subtitle && (
            <p className="text-white/60 text-xs">{subtitle}</p>
          )}
        </div>
        <div className="text-4xl opacity-80">{icon}</div>
      </div>
    </div>
  );
}
