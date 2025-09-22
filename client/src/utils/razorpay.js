// utils/razorpay.js
import { verifyRazorpayPayment } from "../api/payment.Api";

/**
 * Dynamically loads the Razorpay SDK script
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (document.querySelector("#razorpay-script")) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/**
 * Opens the Razorpay checkout modal
 */
export const openRazorpayCheckout = async ({
  orderData,
  user,
  onSuccess,
  onFailure,
}) => {
  if (!window.Razorpay) {
    onFailure("Razorpay SDK not loaded");
    return;
  }

  const options = {
    key: orderData.key,
    amount: orderData.amount,
    currency: orderData.currency,
    order_id: orderData.orderId,
    name: "Tanishq Jewellery Store",
    description: "Jewellery Order Payment",
    handler: async function (response) {
      try {
        // Verifying payment
        const verifyRes = await verifyRazorpayPayment(response);

        if (verifyRes?.statusCode === 200) {
          onSuccess({ verifyRes, razorpayResponse: response });
        } else {
          onFailure(verifyRes?.message || "Payment verification failed");
        }
      } catch (error) {
        onFailure(error?.response?.data?.message || error.message);
      }
    },
    modal: {
      onclose: function () {
        console.log("Razorpay modal closed without payment.");
      },
    },
    theme: {
      color: "#8e2c2f",
    },
  };

  const rzp1 = new window.Razorpay(options);
  rzp1.on("payment.failed", function (response) {
    console.error("Razorpay payment failed:", response.error);
    onFailure(response.error.description);
  });
  rzp1.open();
};
