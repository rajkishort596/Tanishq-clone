import React from "react";
import { useNavigate } from "react-router-dom";
import images from "../utils/images";

const Cart = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center pt-20 min-h-screen bg-white px-4">
      {/* Shopping Bag Icon */}
      <div className="mb-6">
        <div className="w-auto h-40 flex items-center justify-center">
          <img
            src={images.emptyCartIcon}
            alt="Cart"
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Title */}
      <h2 className="text-2xl md:text-3xl font-bold text-primary font-nunito mt-12 mb-6">
        YOUR CART IS EMPTY
      </h2>

      {/* Buttons */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-8">
        <button
          onClick={() => navigate("/shop/all-jewellery")}
          className="px-8 py-3 border cursor-pointer border-[#832729] text-primary rounded-md transition hover:shadow-[0.313rem_0.313rem_1.875rem_0.019rem_rgba(99,22,23,0.6)]"
        >
          Continue Shopping
        </button>
        <button
          onClick={() => navigate("/login")}
          className="px-8 py-3 btn-primary rounded-md hover:shadow-[0.313rem_0.313rem_1.875rem_0.019rem_rgba(99,22,23,0.6)]"
        >
          Login To View Your Cart
        </button>
      </div>
    </div>
  );
};

export default Cart;
