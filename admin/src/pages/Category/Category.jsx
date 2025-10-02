import React, { useState, useEffect, useMemo, useCallback } from "react";
import { PlusCircle, Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import debounce from "lodash.debounce";
import Spinner from "../../components/Spinner";
import { toast } from "react-toastify";
import { useCategories } from "../../hooks/useCategories";
import { useNavigate } from "react-router-dom";
import CategoriesTable from "../../components/Table/CategoriesTable";
import ConfirmModal from "../../components/ConfirmModal";

const Category = () => {
  const navigate = useNavigate();
  const [rawSearch, setRawSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
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
    categories,
    totalCategories,
    isLoading,
    error,
    deleteCategory,
    isDeleting,
  } = useCategories({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery,
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
    const maxPage = Math.ceil(totalCategories / itemsPerPage);
    if (page > maxPage) return;
    setCurrentPage(page);
  };

  const triggerDelete = (categoryId) => {
    setToDeleteId(categoryId);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!toDeleteId) return;
    try {
      const totalBeforeDelete = totalCategories;
      await deleteCategory(toDeleteId);

      // Check if the deleted category was the last on the page
      const newTotal = totalBeforeDelete - 1;
      const maxPageAfterDelete = Math.ceil(newTotal / itemsPerPage);

      // If the current page is now empty and not the first page,
      // decrement the page number.
      if (
        categories.length === 1 &&
        currentPage > 1 &&
        currentPage > maxPageAfterDelete
      ) {
        setCurrentPage(currentPage - 1);
      }
    } finally {
      setShowConfirm(false);
      setToDeleteId(null);
    }
  };

  const handleEdit = (categoryId) => {
    navigate(`/categories/edit/${categoryId}`);
  };

  const handleCreateNew = () => {
    navigate("/categories/new");
  };

  if (isLoading || isDeleting) {
    return (
      <div className="flex justify-center items-center absolute inset-0 bg-white/80 z-50">
        <Spinner />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex justify-center items-center h-full min-h-[calc(100vh-120px)] text-red-600">
        <p>Error: {error.message || "Could not load categories."}</p>
      </div>
    );
  }

  return (
    <div className="category-management-content">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl text-primary font-semibold font-fraunces">
          Category Management
        </h2>
        <button
          onClick={handleCreateNew}
          className="btn-primary flex items-center px-4 py-2 text-lg"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Create New Category
        </button>
      </div>

      {/* Search Section */}
      <div className="mb-6 flex items-center space-x-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" />
          <input
            type="text"
            placeholder="Search categories by name or slug..."
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
        {/* {searchQuery && (
          <div className="text-sm text-gray-500">
            Searching for "{searchQuery}"
          </div>
        )} */}
      </div>

      {/* Category List Table */}
      <div className="h-auto overflow-auto">
        <CategoriesTable
          categories={categories}
          showActions={true}
          onEdit={handleEdit}
          onDelete={triggerDelete}
          isDeleting={isDeleting}
        />
      </div>

      {/* Pagination */}
      {totalCategories > itemsPerPage && (
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
            { length: Math.ceil(totalCategories / itemsPerPage) },
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
            disabled={currentPage >= Math.ceil(totalCategories / itemsPerPage)}
            className="p-2 rounded-lg cursor-pointer border border-white/20 text-primary hover:bg-white/60 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        open={showConfirm}
        title="Delete Category"
        description="Are you sure you want to delete this category? This action cannot be undone."
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

export default Category;
