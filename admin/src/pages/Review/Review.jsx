import React, { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import Spinner from "../../components/Spinner";
import ReviewTable from "../../components/Table/ReviewTable";
import { useReviews } from "../../hooks/useReviews";
import debounce from "lodash.debounce";
import ConfirmModal from "../../components/ConfirmModal";

const Review = () => {
  const [rawSearch, setRawSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [reviewStatus, setReviewStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(1);
  const [toDeleteId, setToDeleteId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // Debounced setter for searchQuery using lodash.debounce
  const debouncedSetSearch = useMemo(
    () =>
      debounce((val) => {
        setSearchQuery(val);
        setCurrentPage(1);
      }, 500),
    []
  );

  useEffect(() => {
    debouncedSetSearch(rawSearch);
    return () => {
      debouncedSetSearch.cancel();
    };
  }, [rawSearch, debouncedSetSearch]);

  const {
    reviews,
    totalReviews,
    isLoading,
    updateReviewStatus,
    deleteReview,
    isDeleting,
    isUpdating,
    error,
  } = useReviews({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery,
    isApproved: reviewStatus,
  });

  useEffect(() => {
    if (error) {
      toast.error(error?.message || "Failed to load categories.");
    }
  }, [error]);

  const handleSearchChange = (e) => {
    setRawSearch(e.target.value);
  };

  const handleClearSearch = () => {
    setRawSearch("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page < 1) return;
    const maxPage = Math.ceil(totalReviews / itemsPerPage);
    if (page > maxPage) return;
    setCurrentPage(page);
  };

  // Handlers for the table actions
  const handleUpdateStatus = async (reviewId, isApproved) => {
    await updateReviewStatus({ reviewId, isApproved });
  };

  const triggerDelete = (reviewId) => {
    setToDeleteId(reviewId);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!toDeleteId) return;
    try {
      await deleteReview(toDeleteId);
    } finally {
      setShowConfirm(false);
      setToDeleteId(null);
    }
  };

  if (isLoading || isDeleting || isUpdating) {
    return (
      <div className="flex justify-center items-center absolute inset-0 bg-white/80 z-50">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full min-h-[calc(100vh-120px)] text-red-600">
        <p>Error: {error.message || "Could not load reviews."}</p>
      </div>
    );
  }

  return (
    <div className="reviews-content">
      <h1 className="text-2xl font-fraunces font-semibold text-primary mb-6">
        Product Reviews
      </h1>

      {/* Search Section */}
      <div className="mb-6 flex items-center space-x-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" />
          <input
            type="text"
            placeholder="Search reviews by Customer or Product Name..."
            value={rawSearch}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-10 py-2 rounded-md bg-white text-gray-800 transition-all duration-300 outline-none"
          />
          {rawSearch && (
            <button
              onClick={handleClearSearch}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-800"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        <select
          className="px-4 py-2 rounded-md border bg-white text-gray-800 transition-all duration-300 outline-none
        border-gray-300 shadow-sm hover:shadow-md w-full md:w-1/3"
          value={reviewStatus}
          onChange={(e) => {
            setReviewStatus(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">All Statuses</option>
          <option value="true">Approved</option>
          <option value="false">Pending</option>
        </select>
      </div>
      {/* Review Table */}
      <div className="h-auto max-h-[400px] overflow-auto">
        <ReviewTable
          reviews={reviews || []}
          onUpdateStatus={handleUpdateStatus}
          onDelete={triggerDelete}
          isDeleting={isDeleting}
        />
      </div>

      {/* Pagination */}
      {totalReviews > itemsPerPage && (
        <div className="flex justify-center absolute bottom-4 left-1/2 -translate-x-1/2 items-center mt-6 flex-wrap gap-2">
          {/* Previous Button*/}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border cursor-pointer border-white/20 backdrop-blur-md text-primary hover:bg-white/60 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={18} />
          </button>
          {/* Page Numbers */}
          {Array.from(
            { length: Math.ceil(totalReviews / itemsPerPage) },
            (_, i) => i + 1
          ).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-8 h-8 flex items-center justify-center cursor-pointer rounded-md font-medium text-sm transition-all duration-200 border backdrop-blur-md ${
                currentPage === page
                  ? "bg-primary text-white border-white"
                  : "bg-primary/20 text-white border-white hover:bg-primary"
              }`}
            >
              {page}
            </button>
          ))}
          {/* Next Button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= Math.ceil(totalReviews / itemsPerPage)}
            className="p-2 rounded-lg cursor-pointer border border-white/20 text-primary hover:bg-white/60 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        open={showConfirm}
        title="Delete Review"
        description="Are you sure you want to delete this review? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowConfirm(false);
          setToDeleteId(null);
        }}
        loading={isDeleting}
      />
    </div>
  );
};

export default Review;
