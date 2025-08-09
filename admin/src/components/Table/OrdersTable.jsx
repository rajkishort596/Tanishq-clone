import React from "react";
import { formatDate } from "../../utils/formatters";

const OrdersTable = ({
  orders,
  showActions = false,
  onStatusChange,
  onDelete,
}) => (
  <div className="bg-white/60 backdrop-blur-lg relative z-5 p-6 rounded-xl font-sans shadow-lg border border-gray-200 overflow-x-auto">
    <table className="w-full table-auto text-sm text-left text-gray-800">
      {/* Light text for table content */}
      <thead className="text-primary font-semibold border-b border-gray-300">
        <tr>
          <th className="py-3 px-4">Customer Name</th>
          <th className="py-3 px-4">Placed On</th>
          <th className="py-3 px-4">Payment Mode</th>
          <th className="py-3 px-4">Product Name</th>
          <th className="py-3 px-4">Order No.</th>
          <th className="py-3 px-4">Payment Status</th>
          {showActions && <th className="py-3 px-4">Status</th>}
          {showActions && <th className="py-3 px-4">Actions</th>}
        </tr>
      </thead>
      <tbody>
        {orders.length === 0 ? (
          <tr>
            <td
              colSpan={showActions ? 8 : 6}
              className="py-6 text-center text-grey4"
            >
              No orders found.
            </td>
          </tr>
        ) : (
          orders.map((ord) => (
            <tr
              key={ord._id}
              className="border-b border-gray-200 hover:bg-white/70 transition"
            >
              <td className="py-3 px-4 whitespace-nowrap">
                {ord.user?.firstName + " " + ord.user?.lastName || "-"}
              </td>
              <td className="py-3 px-4 whitespace-nowrap">
                {formatDate(ord.placedAt)}
              </td>
              <td className="py-3 px-4">{ord.paymentDetails?.method}</td>
              <td className="py-3 px-4">{ord.items[0]?.name}</td>
              <td className="py-3 px-4">{ord.orderNumber}</td>
              <td className="py-3 px-4 capitalize">
                <span
                  className={`px-3 py-2 rounded text-xs font-medium ${
                    ord.paymentDetails.status === "paid"
                      ? "bg-green-700 text-white"
                      : "bg-yellow-700 text-white"
                  }`}
                >
                  {ord.paymentDetails.status}
                </span>
              </td>

              {showActions && (
                <>
                  <td className="py-3 px-4">
                    <select
                      className={`px-3 py-2 rounded-md border transition-all duration-200 outline-none shadow-sm hover:shadow-md cursor-pointer font-semibold
                      ${
                        ord.status === "delivered"
                          ? "text-green-400"
                          : ord.status === "cancelled"
                          ? "text-red-400"
                          : ord.status === "shipped"
                          ? "text-blue-400"
                          : "text-yellow-400"
                      }`}
                      value={ord.status}
                      onChange={(e) =>
                        onStatusChange(
                          ord._id,
                          e.target.value,
                          ord.paymentDetails.status
                        )
                      }
                    >
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      className="text-red-400 hover:underline text-sm cursor-pointer"
                      onClick={() => onDelete(ord._id)}
                    >
                      Delete
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default OrdersTable;
