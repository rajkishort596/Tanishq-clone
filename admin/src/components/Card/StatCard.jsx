import React from "react";

const StatCard = ({
  title,
  value,
  icon: Icon,
  iconBgColor = "bg-grey1",
  iconTextColor = "text-grey6",
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-5 relative z-10 flex items-center justify-between transition-transform transform hover:scale-105">
      <div>
        <p className="text-sm text-grey5">{title}</p>
        <h3 className="text-2xl font-bold text-grey8">{value}</h3>
      </div>
      {Icon && (
        <div className={`flex-shrink-0 p-3 rounded-full ${iconBgColor}`}>
          <Icon className={`h-6 w-6 ${iconTextColor}`} />
        </div>
      )}
    </div>
  );
};

export default StatCard;
