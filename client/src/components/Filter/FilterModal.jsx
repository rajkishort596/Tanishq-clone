import { X } from "lucide-react";
import React from "react";

const FilterModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-md flex items-center justify-start z-50">
      <div className="bg-white rounded-lg h-full w-full lg:w-1/2 xl:w-1/3 relative shadow-2xl">
        <div className="modal-header flex justify-center w-full py-4 px-6 relative">
          <h5 className="font-fraunces text-xl text-[#300708]">Filter by</h5>
          <button
            onClick={onClose}
            className="absolute top-1/2 transform -translate-y-1/2 right-6 p-1 rounded-full hover:bg-gray-200"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default FilterModal;
