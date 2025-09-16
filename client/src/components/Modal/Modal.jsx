import React from "react";
import { X } from "lucide-react";

const Modal = ({ children, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="relative bg-white p-6 rounded-lg shadow-2xl w-full md:w-auto max-h-[90vh] overflow-y-auto transition-transform duration-300 transform scale-95"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
