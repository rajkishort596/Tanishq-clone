import React, { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, PlusCircle, Search, X } from "lucide-react";
import debounce from "lodash.debounce";
import Spinner from "../../components/Spinner";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../components/Card/ProductCard";
import ConfirmModal from "../../components/ConfirmModal";
import { useProducts } from "../../hooks/useProducts";
const Product = () => {
  const navigate = useNavigate();
  const [rawSearch, setRawSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
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
    products,
    totalProducts,
    isLoading,
    error,
    isFetching,
    deleteProduct,
    isDeleting,
  } = useProducts({
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
    const maxPage = Math.ceil(totalProducts / itemsPerPage);
    if (page > maxPage) return;
    setCurrentPage(page);
  };

  const triggerDelete = (productId) => {
    console.log(productId);
    setToDeleteId(productId);
    console.log(toDeleteId);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!toDeleteId) return;
    try {
      await deleteProduct(toDeleteId);
    } finally {
      setShowConfirm(false);
      setToDeleteId(null);
    }
  };

  const handleEdit = (productId) => {
    navigate(`/products/edit/${productId}`);
  };
  const handleDetails = (productId) => {
    navigate(`/products/${productId}`);
  };

  const handleCreateNew = () => {
    navigate("/products/new");
  };
  if (isLoading || isDeleting || isFetching) {
    return (
      <div className="flex justify-center items-center absolute inset-0 bg-white/80 z-50">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full min-h-[calc(100vh-120px)] text-red-600">
        <p>Error: {error.message || "Could not load products."}</p>
      </div>
    );
  }

  return (
    <div className="product-management-content">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl text-primary font-semibold font-fraunces">
          Product Management
        </h2>
        <button
          onClick={handleCreateNew}
          className="btn-primary flex items-center px-4 py-2 text-lg"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Create New Product
        </button>
      </div>

      {/* Search Section */}
      <div className="mb-6 flex items-center space-x-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" />
          <input
            type="text"
            placeholder="Search product by name, metal or purity"
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
      </div>

      {products.length === 0 ? (
        <div className="text-center text-[var(--color-grey4)] py-12">
          <p>No products found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onEdit={handleEdit}
              onDelete={triggerDelete}
              isDeleting={isDeleting}
              onClick={handleDetails}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalProducts > itemsPerPage && (
        <div className="flex justify-center items-center mt-6 flex-wrap gap-2">
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
            { length: Math.ceil(totalProducts / itemsPerPage) },
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
            disabled={currentPage >= Math.ceil(totalProducts / itemsPerPage)}
            className="p-2 rounded-lg cursor-pointer border border-white/20 text-primary hover:bg-white/60 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        open={showConfirm}
        title="Delete Product"
        description="Are you sure you want to delete this Product? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => {
          console.log("cancel invoked");
          setShowConfirm(false);
          setToDeleteId(null);
          console.log(showConfirm);
        }}
        // loading={isDeleting}
      />
    </div>
  );
};

export default Product;
