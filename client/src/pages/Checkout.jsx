import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { useCart } from "../hooks/useCart";
import { useAddresses } from "../hooks/useAddresses";
import Modal from "../components/Modal/Modal";
import AddressForm from "../components/Form/AddressForm";
import { toast } from "react-toastify";
import { useOrders } from "../hooks/useOrders";
import { useSelector } from "react-redux";
import { usePayment } from "../hooks/usePayment";

const Checkout = () => {
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  /** ------------------ State ------------------ */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState("COD");

  /** ------------------ Queries ------------------ */
  const { cart, isLoading: cartLoading, error: cartError } = useCart();
  const { createOrder, isCreating: isCreatingOrder } = useOrders();
  const { initiatePayment, isInitiating, isCreatingOrderAfterPayment } =
    usePayment();
  const {
    addresses,
    addAddress,
    isAdding: isAddingAddress,
    isLoading: addressLoading,
    error: addressError,
  } = useAddresses();

  /** ------------------ Effects ------------------ */
  useEffect(() => {
    if (addresses?.length > 0) {
      const homeAddress =
        addresses.find((addr) => addr.type?.toLowerCase() === "home") ||
        addresses[0];
      setSelectedAddress(homeAddress);
    }
  }, [addresses]);

  /** ------------------ Handlers ------------------ */
  const handleSubmitAddress = async (data) => {
    await addAddress(data);
  };

  const handleAddNewAddress = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select an address to proceed.");
      return;
    }

    if (selectedPayment === "COD") {
      await createOrder({
        addressId: selectedAddress._id,
        paymentMethod: "COD",
      });
      navigate("/myaccount/order-history");
    } else {
      await initiatePayment({
        selectedAddress,
        selectedPayment,
        user,
        cartTotal: cart?.totalPrice || 0,
      });
    }
  };

  if (
    cartLoading ||
    addressLoading ||
    isAddingAddress ||
    isCreatingOrder ||
    isCreatingOrderAfterPayment
  ) {
    return (
      <div className="flex justify-center items-center fixed inset-0 bg-white/80 z-50">
        <Spinner />
      </div>
    );
  }

  if (cartError || addressError) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded">
        Error loading checkout. Please try again later.
      </div>
    );
  }

  if (!cart || cart.items?.length === 0) {
    return (
      <div className="flex flex-col items-center pt-20 min-h-screen bg-white">
        <h2 className="text-2xl md:text-3xl font-bold text-primary font-nunito">
          Your cart is empty
        </h2>
        <button
          onClick={() => navigate("/shop/all-jewellery")}
          className="mt-6 px-8 py-3 btn-primary rounded-md"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen font-nunito p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-6">Checkout</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ------------------ Address Selection ------------------ */}
        <div className="lg:col-span-2 bg-white shadow-md rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-bold mb-4">Select Delivery Address</h3>
          {addresses?.length > 0 ? (
            <div className="space-y-3">
              {addresses.map((addr) => (
                <label
                  key={addr._id}
                  className={`flex items-start gap-3 p-4 border rounded-md cursor-pointer transition ${
                    selectedAddress?._id === addr._id
                      ? "border-primary bg-primary/5"
                      : "border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="address"
                    checked={selectedAddress?._id === addr._id}
                    onChange={() => setSelectedAddress(addr)}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-semibold capitalize">{addr?.type}</p>
                    <p className="text-sm text-gray-600">
                      {addr?.user?.firstName}
                    </p>
                    <p className="text-sm text-gray-600">{addr?.user?.phone}</p>
                    <p className="text-sm text-gray-600">
                      {addr?.addressLine} - {addr?.pincode}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          ) : (
            <div className="flex justify-between items-center mb-4 gap-2">
              <h2 className="text-lg sm:text-xl font-bold">No Address Found</h2>
              <button
                onClick={handleAddNewAddress}
                className="py-2 px-4 text-xs sm:text-sm font-medium border border-primary text-primary rounded-sm bg-white cursor-pointer"
              >
                Add New Address
              </button>
            </div>
          )}
        </div>

        {/* ------------------ Order Summary ------------------ */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">Order Summary</h3>

          <div className="space-y-3 max-h-56 overflow-y-auto pr-2">
            {cart.items.map((item) => (
              <div
                key={item._id}
                className="flex justify-between text-sm border-b pb-2"
              >
                <span>
                  {item.product?.name} × {item.quantity}
                </span>
                <span className="min-w-[100px] text-right font-semibold">
                  ₹ {(item.product?.price?.final * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-4 font-semibold">
            <span>Total</span>
            <span>₹ {cart.totalPrice?.toFixed(2)}</span>
          </div>

          {/* ------------------ Payment Options ------------------ */}
          <div className="mt-6">
            <h3 className="text-lg font-bold mb-2">Payment Options</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={selectedPayment === "COD"}
                  onChange={(e) => setSelectedPayment(e.target.value)}
                />
                <span>Cash on Delivery</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="Online"
                  checked={selectedPayment === "Online"}
                  onChange={(e) => setSelectedPayment(e.target.value)}
                />
                <span>Razorpay</span>
              </label>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="mt-6 w-full py-3 btn-primary rounded-md"
            disabled={isInitiating || cartLoading}
          >
            {isInitiating ? "Processing..." : "Place Order"}
          </button>
        </div>
      </div>
      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <AddressForm
            onClose={handleCloseModal}
            isAdding={isAddingAddress}
            onSubmitAddress={handleSubmitAddress}
          />
        </Modal>
      )}
    </div>
  );
};

export default Checkout;
