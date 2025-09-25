import React from "react";
import { useNavigate } from "react-router-dom";
import { useOrders } from "../../hooks/useOrders";
import images from "../../utils/images";
import Spinner from "../../components/Spinner";
import { formatDate } from "../../utils/formatters";

const OrderHistory = () => {
  const navigate = useNavigate();
  const { orders, totalOrders, isLoading, error, isFetching } = useOrders();

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
        Error loading orders. Please try again later.
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white rounded-lg font-nunito text-center">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-left">Orders</h2>
        <div className="flex flex-col sm:flex-row items-center max-w-3xl mx-auto justify-between gap-6">
          <img
            src={images.emptyOrdersIcon}
            alt="Empty Orders"
            className="w-40 sm:w-72"
          />
          <div>
            <p className="text-lg font-bold text-primary mb-2">
              No Orders Found !
            </p>
            <p className="text-sm font-semibold mb-4">
              Add items to your jewellery wardrobe
            </p>
            <button
              onClick={() => navigate("/shop/all-jewellery")}
              className="mt-8 px-6 py-2 bg-primary text-white rounded-sm cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg font-nunito py-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-6">
        Orders ({totalOrders})
      </h2>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
          >
            {/* Header */}
            <div className="flex justify-between items-start bg-red-50 px-4 py-3 border-b border-gray-200">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-primary">
                  {order.orderNumber}
                </h3>
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
                    : order.status === "shipped"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {order.status}
              </span>
            </div>

            {/* Items */}
            <div className="divide-y divide-gray-200">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center p-4 gap-4"
                >
                  <img
                    onClick={() =>
                      navigate(`/shop/all-jewellery/product/${item.product}`)
                    }
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-contain border rounded cursor-pointer"
                  />
                  <div className="flex-1">
                    <h4 className="text-sm sm:text-base font-semibold text-gray-800">
                      {item.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Qty: {item.quantity} | Size: {item.size || "NA"} |{" "}
                      {item.metalColor}
                    </p>
                  </div>
                  <p className="text-sm sm:text-base font-bold text-primary">
                    ₹ {item.totalItemPrice.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-gray-50 px-4 py-3 border-t border-gray-200">
              <div className="text-sm text-gray-700">
                <p>
                  Ship to:{" "}
                  <span className="font-medium">
                    {order.shippingAddress.addressLine},{" "}
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    - {order.shippingAddress.pincode}
                  </span>
                </p>
                <p>
                  Payment:{" "}
                  <span className="font-medium">
                    {order.paymentDetails.method} ({order.paymentDetails.status}
                    )
                  </span>
                </p>
              </div>
              <div className="mt-2 sm:mt-0 flex flex-col sm:items-end min-w-[150px]">
                <p className="text-sm sm:text-base text-gray-700">
                  Total:{" "}
                  <span className="font-bold text-primary">
                    ₹ {order.totalAmount.toLocaleString()}
                  </span>
                </p>
                <button
                  onClick={() => navigate(`/myaccount/orders/${order._id}`)}
                  className="mt-2 px-4 py-2 text-sm font-medium bg-primary text-white rounded-sm cursor-pointer hover:bg-red-700"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
