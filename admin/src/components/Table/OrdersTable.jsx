import React from "react";
import { formatDate } from "../../utils/formatters";

const OrdersTable = ({
  orders,
  showActions = false,
  onStatusChange,
  onDelete,
}) => (
  <table className="w-full table-auto text-sm text-left text-[var(--color-grey1)]">
    {/* Light text for table content */}
    <thead className="text-gold-accent font-semibold border-b border-[var(--color-grey6)] uppercase text-[13px] tracking-wide">
      {/* Gold header text, darker border */}
      <tr>
        <th className="py-3 px-4">Customer</th>
        <th className="py-3 px-4">Placed On</th>
        <th className="py-3 px-4">Payment Mode</th>
        <th className="py-3 px-4">Product</th>
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
            className="border-b border-grey7 hover:bg-grey8 transition"
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
                    className={`px-3 py-2 rounded-md border bg-[var(--color-grey8)] text-[var(--color-grey1)] transition-all duration-200 outline-none shadow-sm hover:shadow-md cursor-pointer font-semibold
                      ${
                        ord.status === "completed"
                          ? "text-green-400"
                          : ord.status === "cancelled"
                          ? "text-red-400"
                          : ord.status === "confirmed"
                          ? "text-blue-400"
                          : "text-yellow-400"
                      }`}
                    value={ord.status}
                    onChange={(e) => onStatusChange(ord._id, e.target.value)}
                  >
                    <option value="pending">Processing</option>
                    <option value="confirmed">Shipped</option>
                    <option value="completed">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="py-3 px-4">
                  <button
                    className="text-red-400 hover:underline text-sm"
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
);

export default OrdersTable;
