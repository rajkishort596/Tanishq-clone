import React from "react";

const StatCard = ({
  title,
  value,
  icon: Icon,
  iconBgColor = "bg-gray-100",
  iconTextColor = "text-gray-600",
  glowClass = "",
}) => {
  return (
    <div className="glass-card inset-glow-border flex items-center justify-between transition-transform transform hover:scale-105">
      <div>
        <p className="text-sm text-[var(--color-grey3)]">{title}</p>
        <h3 className="text-2xl font-bold text-[var(--color-gold)]">{value}</h3>
      </div>
      {Icon && (
        <div
          className={`flex-shrink-0 p-3 rounded-full ${iconBgColor} ${glowClass}`}
        >
          <Icon className={`h-6 w-6 ${iconTextColor}`} />
        </div>
      )}
    </div>
  );
};

export default StatCard;
