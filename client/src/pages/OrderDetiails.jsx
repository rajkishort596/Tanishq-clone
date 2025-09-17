import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { formatDate } from "../utils/formatters";
import { useOrder } from "../hooks/useOrders";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { order, isLoading, error, isFetching } = useOrder(id);

  if (isLoading || isFetching) {
    return (
      <div className="flex justify-center items-center fixed inset-0 bg-white/80 z-50">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded">
        Error loading order. Please try again later.
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-4 bg-yellow-100 text-yellow-700 rounded">
        Order not found.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg font-nunito py-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-6">Order Details</h2>
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-sm sm:text-xl md:text-2xl font-bold text-primary">
            Order {order.orderNumber}
          </h2>
          <p className="text-sm text-gray-600">
            Placed on {formatDate(order.placedAt)}
          </p>
        </div>
        <span
          className={`flex items-center justify-center px-3 py-1 text-xs font-medium rounded-full ${
            order.status === "delivered"
              ? "bg-green-100 text-green-700"
              : order.status === "cancelled"
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {order.status}
        </span>
      </div>

      {/* Items */}
      <div className="border border-gray-200 rounded-lg mb-6">
        {order.items.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col sm:flex-row sm:items-center p-4 gap-4 border-b last:border-b-0"
          >
            <img
              onClick={() =>
                navigate(`/shop/all-jewellery/product/${item.product}`)
              }
              src={item.image}
              alt={item.name}
              className="w-24 h-24 object-contain border rounded cursor-pointer"
            />
            <div className="flex-1">
              <h4 className="text-sm sm:text-base font-semibold text-gray-800">
                {item.name}
              </h4>
              <p className="text-sm text-gray-600">
                Qty: {item.quantity} | Size: {item.size} | {item.metalColor}
              </p>
            </div>
            <p className="text-sm sm:text-base font-bold text-primary">
              ₹ {item.totalItemPrice.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Shipping Address */}
      <div className="border border-gray-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
        <p className="text-sm text-gray-700">
          {order.shippingAddress.addressLine}
        </p>
        <p className="text-sm text-gray-700">
          {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
          {order.shippingAddress.pincode}
        </p>
        {order.shippingAddress.landmark && (
          <p className="text-sm text-gray-700">
            Landmark: {order.shippingAddress.landmark}
          </p>
        )}
        <p className="text-sm text-gray-500">
          Type: {order.shippingAddress.type}
        </p>
      </div>

      {/* Payment Details */}
      <div className="border border-gray-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold mb-2">Payment Details</h3>
        <p className="text-sm text-gray-700">
          Method: {order.paymentDetails.method}
        </p>
        <p className="text-sm text-gray-700">
          Status: {order.paymentDetails.status}
        </p>
        <p className="text-sm text-gray-700">
          Amount Paid: ₹ {order.paymentDetails.amountPaid.toLocaleString()}
        </p>
        {order.paymentDetails.transactionId && (
          <p className="text-sm text-gray-700">
            Transaction ID: {order.paymentDetails.transactionId}
          </p>
        )}
        {order.paymentDetails.paymentDate && (
          <p className="text-sm text-gray-700">
            Paid on: {formatDate(order.paymentDetails.paymentDate)}
          </p>
        )}
      </div>

      {/* Total */}
      <div className="flex justify-between items-center border-t pt-4">
        <p className="text-lg font-semibold text-gray-700">Total Amount</p>
        <p className="text-xl font-bold text-primary">
          ₹ {order.totalAmount.toLocaleString()}
        </p>
      </div>

      <div className="mt-6">
        <button
          onClick={() => navigate("/myaccount/order-history")}
          className="px-6 py-2 text-sm font-medium border border-primary text-primary rounded-sm bg-white cursor-pointer hover:bg-gray-100"
        >
          Back to Orders
        </button>
      </div>
    </div>
  );
};

export default OrderDetails;
