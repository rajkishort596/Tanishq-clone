import React from "react";
import { formatDate } from "../../utils/formatters";

const OrdersTable = ({
  orders,
  showActions = false,
  onStatusChange,
  onDelete,
}) => (
  <div className="bg-white/60 backdrop-blur-lg relative z-5 p-6 rounded-xl font-IBM-Plex shadow-lg border border-gray-200 overflow-x-auto">
    <table className="w-full table-auto text-sm text-left text-gray-800">
      <thead className="text-primary font-semibold border-b border-gray-300">
        <tr>
          <th className="py-2 px-4">Customer Name</th>
          <th className="py-2 px-4">Placed On</th>
          <th className="py-2 px-4">Payment Mode</th>
          <th className="py-2 px-4">Product Name</th>
          <th className="py-2 px-4">Order Number</th>
          <th className="py-2 px-4">Payment Status</th>
          {showActions && <th className="py-2 px-4">Status</th>}
          {showActions && <th className="py-2 px-4">Actions</th>}
        </tr>
      </thead>
      <tbody>
        {orders.length === 0 ? (
          <tr>
            <td
              colSpan={showActions ? 8 : 6}
              className="py-4 text-center text-gray-500"
            >
              No Orders found.
            </td>
          </tr>
        ) : (
          orders.map((ord) => (
            <tr
              key={ord._id}
              className="border-b border-gray-200 hover:bg-white/70 transition"
            >
              <td className="py-2 px-4">
                {ord.user?.firstName + " " + ord.user?.lastName || "-"}
              </td>
              <td className="py-2 px-4">{formatDate(ord.placedAt)}</td>
              <td className="py-2 px-4">{ord.paymentDetails?.method}</td>
              <td className="py-2 px-4">{ord.items[0]?.name}</td>
              <td className="py-2 px-4">{ord.orderNumber}</td>
              <td className="py-2 px-4">{ord.paymentDetails.status}</td>

              {showActions && (
                <>
                  <td className="py-2 px-4">
                    <select
                      className={`px-3 py-2 rounded-md border transition-all duration-300 outline-none shadow-sm hover:shadow-md cursor-pointer
                        focus:ring-2 focus:border-transparent focus:ring-primary font-semibold
                        ${
                          ord.status === "delivered"
                            ? "text-green-600"
                            : appt.status === "cancelled"
                            ? "text-red-600"
                            : appt.status === "shipped"
                            ? "text-blue-600"
                            : "text-yellow-600"
                        }`}
                      value={ord.status}
                      onChange={(e) => onStatusChange(ord._id, e.target.value)}
                    >
                      <option value="pending">processing</option>
                      <option value="confirmed">Shippped</option>
                      <option value="completed">delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-2 px-4">
                    <button
                      className="text-red-600 hover:underline cursor-pointer"
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
