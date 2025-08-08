import { CheckCircle, Star, Trash2, XCircle } from "lucide-react";
import React, { useState } from "react";

const ReviewTable = ({
  reviews,
  onUpdateStatus,
  onDelete,
  isDeleting = false,
}) => {
  const [expandedComments, setExpandedComments] = useState({});

  const toggleComment = (reviewId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  return (
    <div className="bg-white/60 backdrop-blur-lg relative z-5 p-6 rounded-xl font-sans shadow-lg border border-gray-200 overflow-x-auto">
      <table className="w-full table-auto text-sm text-left text-gray-800">
        <thead className="text-primary font-semibold border-b border-gray-300 uppercase text-[13px] tracking-wide">
          <tr>
            <th className="py-3 px-4">Product</th>
            <th className="py-3 px-4">Customer</th>
            <th className="py-3 px-4">Rating</th>
            <th className="py-3 px-4">Comment</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-6 text-center text-gray-500">
                No reviews found.
              </td>
            </tr>
          ) : (
            reviews.map((review) => {
              const isExpanded = expandedComments[review._id];
              const comment = review?.comment || "";
              const shouldTruncate = comment.length > 100 && !isExpanded;

              return (
                <tr
                  key={review._id}
                  className="border-b last:border-b-0  border-gray-200 hover:bg-white/70 transition"
                >
                  <td className="py-3 px-4 font-medium text-primary">
                    {review?.product.name}
                  </td>
                  <td className="py-3 px-4">
                    {review?.user.firstName + " " + review?.user.lastName}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center text-yellow-500">
                      {Array(5)
                        .fill()
                        .map((_, i) => (
                          <Star
                            key={i}
                            size={15}
                            fill={i < review?.rating ? "currentColor" : "none"}
                            stroke="currentColor"
                          />
                        ))}
                      {/* <span className="ml-1 text-gray-700">{review?.rating}</span> */}
                    </div>
                  </td>
                  <td className="py-3 px-4 max-w-xs md:max-w-sm">
                    <p className="text-sm text-gray-800">
                      {shouldTruncate ? comment.slice(0, 100) + "..." : comment}
                    </p>
                    {comment.length > 100 && (
                      <button
                        className="cursor-pointer text-blue-600 hover:underline text-xs mt-1"
                        onClick={() => toggleComment(review._id)}
                      >
                        {isExpanded ? "See less" : "See more"}
                      </button>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {review?.isApproved ? (
                      <span className="text-green-600">Approved</span>
                    ) : (
                      <span className="text-orange-500">Pending</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {review?.isApproved ? (
                        <button
                          onClick={() =>
                            onUpdateStatus(review?._id, Boolean(false))
                          }
                          className="text-red-600 hover:text-red-800 transition-colors cursor-pointer"
                          title="Reject"
                        >
                          <XCircle size={20} />
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            onUpdateStatus(review?._id, Boolean(true))
                          }
                          className="text-green-600 hover:text-green-800 transition-colors cursor-pointer"
                          title="Approve"
                        >
                          <CheckCircle size={20} />
                        </button>
                      )}
                      <button
                        onClick={() => onDelete(review?._id)}
                        className="text-gray-500 hover:text-gray-700 transition-colors ml-2 cursor-pointer"
                        title="Delete"
                        disabled={isDeleting}
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewTable;
