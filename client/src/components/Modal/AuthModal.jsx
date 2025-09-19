import React, { useState } from "react";
import { X } from "lucide-react";
import OfferBanner from "./OfferBanner";
import Form from "./Form";

const AuthModal = ({ isOpen, onClose, isLogin = false, setIsLogin }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="flex relative gap-8 lg:bg-[#fff2e0] rounded-xl shadow-xl w-full xl:w-[80%] min-h-auto lg:h-[70vh] overflow-hidden md:px-17 md:py-7">
        {/* Left Section (Offer Banner) */}
        <OfferBanner />

        {/* Right Section (Form) */}
        <Form isLogin={isLogin} setIsLogin={setIsLogin} onClose={onClose} />

        {/* Close button */}
        <button
          onClick={onClose}
          className="cursor-pointer hidden lg:block absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default AuthModal;
