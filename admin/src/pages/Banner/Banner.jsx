import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { PlusCircle } from "lucide-react";
import Spinner from "../../components/Spinner";
import ConfirmModal from "../../components/ConfirmModal";
import { useBanners } from "../../hooks/useBanners.js";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const navigate = useNavigate();
  const { banners, isLoading, error, deleteBanner, isDeleting } = useBanners();
  const [toDeleteId, setToDeleteId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (error) {
      toast.error(error?.message || "Failed to load banners.");
    }
  }, [error]);

  const handleAddBanner = () => {
    navigate(`/banners/new`);
  };

  const handleEditBanner = (bannerId) => {
    navigate(`/banners/edit/${bannerId}`);
  };

  const triggerDelete = (bannerId) => {
    setToDeleteId(bannerId);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!toDeleteId) return;
    try {
      await deleteBanner(toDeleteId);
    } finally {
      setShowConfirm(false);
      setToDeleteId(null);
    }
  };

  if (isLoading || isDeleting) {
    return (
      <div className="flex justify-center items-center absolute inset-0 bg-white/80 z-50">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="banner-management-content">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl text-primary font-semibold font-fraunces">
          Banner Management
        </h2>
        <button
          onClick={handleAddBanner}
          className="btn-primary flex items-center px-4 py-2 text-lg"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Add New Banner
        </button>
      </div>

      {/* Existing Banners Section */}
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.length === 0 ? (
            <p className="text-center col-span-full text-gray-500 italic">
              No banners found. Please add one above.
            </p>
          ) : (
            banners.map((banner) => (
              <div
                key={banner._id}
                className="bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
              >
                {/* Banner Image */}
                <a
                  href={banner?.image.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={banner.image?.url}
                    alt={banner.title}
                    className="w-full h-44 object-cover border-b border-gray-200 transition-transform duration-300 group hover:scale-105"
                  />
                </a>

                {/* Title & Link on one line */}
                <div className="flex items-center justify-between p-4">
                  <h3 className="font-semibold text-primary font-IBM-Plex text-xl">
                    {banner.title}
                  </h3>
                  {/* Edit & Delete buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEditBanner(banner._id)}
                      className="flex-1 border text-xs rounded-sm bg-gradient-to-r from-amber-600 to-yellow-600 text-white flex items-center justify-center font-medium py-2 px-4 cursor-pointer shadow-md hover:from-yellow-600 hover:to-amber-600 transition duration-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => triggerDelete(banner._id)}
                      disabled={isDeleting}
                      className="flex-1 border text-xs rounded-sm bg-gradient-to-r from-red-600 to-primary text-white flex items-center justify-center font-medium py-2 px-4 cursor-pointer shadow-md hover:from-primary hover:to-red-600 transition duration-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        open={showConfirm}
        title="Delete Banner"
        description="Are you sure you want to delete this banner? This action cannot be undone."
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

export default Banner;
