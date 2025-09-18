import React from "react";
import { useNavigate } from "react-router-dom";
import images from "../utils/images";
import { useCart } from "../hooks/useCart.js";
import Spinner from "../components/Spinner";
import { SquareMinus, SquarePlus, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { openAuthModal } from "../features/authModalSlice.js";

const Cart = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    cart,
    isLoading,
    error,
    isFetching,
    updateQuantity,
    isUpdating,
    removeFromCart,
    isRemoving,
  } = useCart();

  if (isLoading || isFetching || isUpdating || isRemoving) {
    return (
      <div className="flex justify-center items-center fixed inset-0 bg-white/80 z-50">
        <Spinner />
      </div>
    );
  }

  if (isAuthenticated && error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg shadow-md max-w-lg mx-auto mt-20">
        <h3 className="font-bold text-lg mb-2">Error Loading Cart</h3>
        <p className="text-sm">
          Something went wrong while fetching your cart details. Please try
          again later.
        </p>
      </div>
    );
  }

  const handleLoginClick = () => {
    dispatch(openAuthModal(true));
  };

  const IncrementItemQuantity = async (itemId, currentQuantity) => {
    await updateQuantity({ itemId, quantity: currentQuantity + 1 });
  };

  const DecrementItemQuantity = async (itemId, currentQuantity) => {
    await updateQuantity({
      itemId,
      quantity: Math.max(1, currentQuantity - 1),
    });
  };

  if (!cart || cart.items?.length === 0 || !isAuthenticated) {
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
          {!isAuthenticated && (
            <button
              onClick={handleLoginClick}
              className="px-8 py-3 btn-primary rounded-md hover:shadow-[0.313rem_0.313rem_1.875rem_0.019rem_rgba(99,22,23,0.6)]"
            >
              Login To View Your Cart
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg font-nunito min-h-screen p-4 sm:p-6 pb-24">
      <h2 className="text-xl sm:text-2xl font-bold mb-6">My Shopping Cart</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-5">
          {cart.items.map((item) => (
            <div
              key={item._id}
              className="relative flex flex-col sm:flex-row items-center gap-6 p-4 sm:p-6 rounded-xl shadow-md border border-gray-100 bg-white hover:shadow-xl transition-all duration-300"
            >
              {/* Product Image */}
              <img
                onClick={() =>
                  navigate(`/shop/all-jewellery/product/${item.product?._id}`)
                }
                src={
                  item.product?.images?.[0]?.url ||
                  "/images/default-product.png"
                }
                alt={item.product?.name}
                className="w-28 h-28 object-contain rounded-lg border border-gray-200 bg-gray-50 cursor-pointer"
              />

              {/* Product Info */}
              <div className="flex-1 w-full text-center sm:text-left">
                <h3 className="font-semibold text-base sm:text-lg mb-2 text-gray-800 line-clamp-1">
                  {item.product?.name}
                </h3>
                <p className="text-primary font-bold text-lg">
                  ₹ {item.product?.price?.final?.toFixed(2)}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-3 px-2 py-1 rounded-md font-IBM-Plex">
                <button
                  onClick={() =>
                    DecrementItemQuantity(item?.product?._id, item.quantity)
                  }
                  className="cursor-pointer p-1"
                >
                  <SquareMinus
                    strokeWidth={1.5}
                    size={20}
                    className="text-primary"
                  />
                </button>
                <span className="text-lg font-medium">{item.quantity}</span>
                <button
                  onClick={() =>
                    IncrementItemQuantity(item?.product?._id, item.quantity)
                  }
                  className="cursor-pointer p-1"
                >
                  <SquarePlus
                    strokeWidth={1.5}
                    size={20}
                    className="text-primary"
                  />
                </button>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeFromCart(item?.product?._id)}
                className="absolute top-3 right-3 text-gray-500 hover:text-red-500 bg-gray-100 p-1.5 rounded-full shadow-sm hover:shadow transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="p-4 rounded-md shadow-md h-fit">
          <h3 className="text-lg font-bold mb-4">Order Summary</h3>
          <div className="flex justify-between mb-2">
            <span>Total Items</span>
            <span>{cart.totalQuantity}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>₹ {cart.totalPrice?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>₹ {cart.totalPrice?.toFixed(2)}</span>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="mt-6 w-full py-3 btn-primary rounded-md"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_10px_-2px_rgba(0,0,0,0.1)] p-4 md:p-6 z-50 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto">
          <div className="flex flex-col items-start mb-4 sm:mb-0">
            <span className="text-sm text-gray-600 font-fraunces">
              Total Amount ( {cart.totalQuantity} items )
            </span>
            <span className="text-2xl font-bold text-primary">
              ₹ {cart.totalPrice?.toFixed(2)}
            </span>
          </div>
          <button
            onClick={() => navigate("/checkout")}
            className="w-full sm:w-auto px-8 py-3 btn-primary rounded-md text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            disabled={isUpdating || isRemoving}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
