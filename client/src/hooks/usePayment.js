import { loadRazorpayScript, openRazorpayCheckout } from "../utils/razorpay";
import { createRazorpayOrder } from "../api/payment.Api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useOrders } from "./useOrders";

export const usePayment = () => {
  const navigate = useNavigate();
  const { createOrder, isCreating } = useOrders();

  // Mutation to create a Razorpay order on the backend
  const createRazorpayOrderMutation = useMutation({
    mutationFn: (payload) => createRazorpayOrder(payload),
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message || "Failed to create Razorpay order.";
      toast.error(errorMessage);
    },
  });

  const initiatePayment = async ({
    selectedAddress,
    selectedPayment,
    user,
    cartTotal,
  }) => {
    // 1) Load Razorpay SDK
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      toast.error("Failed to load Razorpay SDK");
      return;
    }

    try {
      // 2️) Create order on backend via mutation
      const orderData = await createRazorpayOrderMutation.mutateAsync({
        amount: cartTotal,
        addressId: selectedAddress._id,
        paymentMethod: selectedPayment,
      });

      // 3️) Open Razorpay checkout
      openRazorpayCheckout({
        orderData,
        user,
        onSuccess: async ({ verifyRes, razorpayResponse }) => {
          try {
            if (verifyRes.data.verified) {
              await createOrder({
                addressId: selectedAddress._id,
                paymentMethod: selectedPayment,
                transactionId: razorpayResponse.razorpay_payment_id,
              });
              navigate("/myaccount/order-history");
            }
          } catch {
            toast.error("Payment was successful but order creation failed!");
          }
        },
        onFailure: (err) => {
          toast.error(`Payment failed: ${err}`);
        },
      });
    } catch (err) {
      // If the mutation failed
      console.error("Payment initiation error:", err);
    }
  };

  return {
    initiatePayment,
    isInitiating: createRazorpayOrderMutation.isPending,
    isCreatingOrderAfterPayment: isCreating,
  };
};
