import React from "react";
import { formatDate } from "../../utils/formatters";
import { Check, X } from "lucide-react";
const CollectionsTable = ({
  collections,
  showActions = false,
  onEdit,
  onDelete,
  isDeleting = false,
}) => {
  return (
    <div className="bg-white/60 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-gray-200">
      {/* Ensure responsiveness for table */}
      <table className="w-full table-auto text-sm text-left text-gray-800">
        <thead className="text-primary font-semibold border-b border-gray-300">
          <tr>
            <th className="py-3 px-4">Collection Name</th>
            <th className="py-3 px-4">Image Icon</th>
            <th className="py-3 px-4">Start Date</th>
            <th className="py-3 px-4">Active Status</th>
            {showActions && <th className="py-3 px-4">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {collections.length === 0 ? (
            <tr>
              <td
                colSpan={showActions ? 5 : 4}
                className="py-6 text-center text-[var(--color-grey4)]"
              >
                No collections found.
              </td>
            </tr>
          ) : (
            collections.map((collection) => (
              <tr
                key={collection._id}
                className="border-b border-gray-200 hover:bg-white/70 transition"
              >
                <td className="py-3 px-4">{collection.name}</td>
                <td className="py-3 px-4">
                  <img
                    src={collection.image.url}
                    alt="icon"
                    className="w-5 h-5"
                  />
                </td>
                <td className="py-3 px-4">
                  {formatDate(collection.startDate)}
                </td>
                <td className="py-3 px-4">
                  {collection.isActive ? (
                    <Check color="#09860b" strokeWidth={3} />
                  ) : (
                    <X color="#ff0000" strokeWidth={3} />
                  )}
                </td>
                {showActions && (
                  <td className="py-3 px-4 flex space-x-2 gap-4">
                    <button
                      onClick={() => onEdit(collection._id)}
                      className="text-yellow-600 font-bold font-nunito hover:underline text-sm flex items-center cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(collection._id)}
                      className="text-red-600 font-bold font-nunito hover:underline text-sm flex items-center cursor-pointer"
                      disabled={isDeleting}
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CollectionsTable;
