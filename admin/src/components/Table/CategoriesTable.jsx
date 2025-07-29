import React from "react";
import { Edit, Trash2 } from "lucide-react";

const CategoriesTable = ({
  categories,
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
            <th className="py-3 px-4">Name</th>
            <th className="py-3 px-4">Icon</th>
            <th className="py-3 px-4">Slug</th>
            <th className="py-3 px-4">Parent Category</th>
            {showActions && <th className="py-3 px-4">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {categories.length === 0 ? (
            <tr>
              <td
                colSpan={showActions ? 5 : 4}
                className="py-6 text-center text-[var(--color-grey4)]"
              >
                No categories found.
              </td>
            </tr>
          ) : (
            categories.map((category) => (
              <tr
                key={category._id}
                className="border-b border-gray-200 hover:bg-white/70 transition"
              >
                <td className="py-3 px-4">{category.name}</td>
                <td className="py-3 px-4">
                  <img src={category.icon.url} alt="icon" className="w-5 h-5" />
                </td>
                <td className="py-3 px-4">{category.slug}</td>
                <td className="py-3 px-4">{category.parent?.name || "N/A"}</td>
                {showActions && (
                  <td className="py-3 px-4 flex space-x-2 gap-4">
                    <button
                      onClick={() => onEdit(category._id)}
                      className="text-yellow-600 font-bold font-nunito hover:underline text-sm flex items-center cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(category._id)}
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

export default CategoriesTable;
