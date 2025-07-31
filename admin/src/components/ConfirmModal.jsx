import React from "react";
import { X, AlertTriangle, Trash2 } from "lucide-react";
import Spinner from "./Spinner";

const ConfirmModal = ({
  open,
  title,
  description,
  onConfirm,
  onCancel,
  loading = "false",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-yellow-100 rounded-full">
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-1">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
          <button
            onClick={onCancel}
            aria-label="Close"
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border hover:bg-gray-100 transition cursor-pointer"
            disabled={loading}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-lg bg-red-600 text-white flex items-center gap-2 hover:bg-red-700 transition cursor-pointer"
            disabled={loading}
          >
            <Trash2 className="w-4 h-4" />
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
