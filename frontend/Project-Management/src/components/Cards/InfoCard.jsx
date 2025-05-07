import React from "react";

const InfoCard = ({ icon, label, value, color }) => {
  return (
    <div className="flex items-center gap-3">
      {/* Dot Warna */}
      <div className={`w-3 h-3 rounded-full ${color}`} />

      {/* Label dan Value */}
      <div>
        <p className="text-xs md:text-sm text-gray-500">
          <span className="text-sm md:text-base font-semibold text-black">
            {value}
          </span>{" "}
          {label}
        </p>
      </div>
    </div>
  );
};

export default InfoCard;
