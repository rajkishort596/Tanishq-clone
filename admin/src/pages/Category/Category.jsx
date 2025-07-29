import React, { useState, useEffect } from "react";
import { PlusCircle, Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import Spinner from "../../components/Spinner";
import { toast } from "react-toastify";
import { useCategories } from "../../hooks/useCategories";
import { useNavigate } from "react-router-dom";
import CategoriesTable from "../../components/Table/CategoriesTable";

const Category = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(1);

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
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = (categoryId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this category? This action cannot be undone."
      )
    ) {
      deleteCategory(categoryId, {
        onSuccess: () => {
          toast.success("Category deleted successfully!");
        },
        onError: (err) => {
          toast.error(err?.message || "Failed to delete category.");
        },
      });
    }
  };

  const handleEdit = (categoryId) => {
    navigate(`/categories/edit/${categoryId}`);
  };

  const handleCreateNew = () => {
    navigate("/categories/new");
  };
  if (isLoading) {
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

      {/* Search and Filter Section */}
      <div className=" mb-6 flex items-center space-x-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" />
          <input
            type="text"
            placeholder="Search categories by name or slug..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 rounded-md bg-white text-gray-800 transition-all duration-300 outline-none"
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 text-grey5 hover:text-black2 focus:ring-2 focus:border-transparent shadow-sm hover:shadow-md border-gray-300 focus:ring-primary"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Category List Table */}
      <div className="h-auto max-h-[400px] overflow-auto">
        <CategoriesTable
          categories={categories}
          showActions={true}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isDeleting={isDeleting}
        />
      </div>

      {/* Pagination Controls */}
      {totalCategories > itemsPerPage && (
        <div className="flex justify-center absolute bottom-4 left-1/2 -translate-x-1/2 items-center mt-6 flex-wrap gap-2">
          {/* Previous Button */}
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
    </div>
  );
};

export default Category;
