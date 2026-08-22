import React from 'react';

const DashboardCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'amber',
  trend = null,
}) => {
  const colorSchemes = {
    amber: {
      border: 'hover:border-amber-300',
      iconBg: 'bg-amber-100 text-amber-800 border-amber-200',
      valueColor: 'text-amber-600',
    },
    blue: {
      border: 'hover:border-blue-300',
      iconBg: 'bg-blue-100 text-blue-800 border-blue-200',
      valueColor: 'text-blue-600',
    },
    purple: {
      border: 'hover:border-purple-300',
      iconBg: 'bg-purple-100 text-purple-800 border-purple-200',
      valueColor: 'text-purple-600',
    },
    emerald: {
      border: 'hover:border-emerald-300',
      iconBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      valueColor: 'text-emerald-600',
    },
    cyan: {
      border: 'hover:border-teal-300',
      iconBg: 'bg-teal-100 text-teal-800 border-teal-200',
      valueColor: 'text-teal-600',
    },
    rose: {
      border: 'hover:border-rose-300',
      iconBg: 'bg-rose-100 text-rose-800 border-rose-200',
      valueColor: 'text-rose-600',
    },
  };

  const scheme = colorSchemes[color] || colorSchemes.amber;

  return (
    <div
      className={`group relative warm-card p-6 border border-slate-200/80 transition-all duration-300 ${scheme.border} hover:shadow-warm overflow-hidden bg-white`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className={`text-3xl font-extrabold tracking-tight ${scheme.valueColor}`}>
              {value}
            </h3>
            {trend && (
              <span className="text-xs font-bold text-emerald-600">
                {trend}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 font-medium">
              {subtitle}
            </p>
          )}
        </div>

        {Icon && (
          <div className={`p-3 rounded-2xl border ${scheme.iconBg} shadow-sm group-hover:scale-105 transition-transform duration-200`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardCard;
