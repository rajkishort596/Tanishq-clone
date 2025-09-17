import React, { useState } from "react";
import Modal from "../../components/Modal/Modal";
import EditDetailsForm from "../../components/Form/EditDetailsForm";
import { formatDate } from "../../utils/formatters";
import Spinner from "../../components/Spinner";
import { useProfile } from "../../hooks/useProfile";

const PersonalInfo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { user, isLoading, error, isFetching } = useProfile();

  const handleOnEditDetails = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  if (isLoading || isFetching) {
    return (
      <div className="flex justify-center items-center fixed inset-0 bg-white/80 z-50">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded">
        Error loading User Details. Please try again later.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg font-nunito mb-6 text-gray-800">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
          Personal Information
        </h2>
        <button
          onClick={handleOnEditDetails}
          className="px-3 py-2 flex items-center text-sm sm:text-base font-medium border border-primary text-primary rounded-sm bg-white cursor-pointer"
        >
          Edit Details
        </button>
      </div>

      {/* Personal Info Section */}
      <div className="border border-primary rounded-sm">
        <div className="flex justify-between items-center bg-red-50 rounded-sm text-primary p-3 sm:p-4">
          <h3 className="text-base sm:text-lg font-semibold">
            Personal Information
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 border-t border-primary">
          <div className="flex flex-col sm:items-center sm:flex-row sm:gap-4">
            <span className="text-xs sm:text-sm text-gray-500">Name:</span>
            <span className="text-sm sm:text-base font-bold">
              {user?.firstName + " " + user?.lastName}
            </span>
          </div>
          <div className="flex flex-col sm:items-center sm:flex-row sm:gap-4">
            <span className="text-xs sm:text-sm text-gray-500">
              Date of Birth:
            </span>
            <span className="text-sm sm:text-base font-bold">
              {formatDate(user?.dob) || ""}
            </span>
          </div>
          <div className="flex flex-col sm:items-center sm:flex-row sm:gap-4">
            <span className="text-xs sm:text-sm text-gray-500">Gender:</span>
            <span className="text-sm sm:text-base font-bold">
              {user?.gender || ""}
            </span>
          </div>
          <div className="flex flex-col sm:items-center sm:flex-row sm:gap-4">
            <span className="text-xs sm:text-sm text-gray-500">
              Anniversary Date:
            </span>
            <span className="text-sm sm:text-base font-bold">
              {user?.anniversary || ""}
            </span>
          </div>
        </div>
      </div>

      {/* Contact Details Section */}
      <div className="border border-primary rounded-sm mt-5">
        <div className="flex justify-between items-center bg-red-50 rounded-sm text-primary p-3 sm:p-4">
          <h3 className="text-base sm:text-lg font-semibold">
            Contact Details
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 border-t border-primary">
          <div className="flex flex-col sm:items-center sm:flex-row sm:gap-4">
            <span className="text-xs sm:text-sm text-gray-500">Phone No:</span>
            <span className="text-sm sm:text-base font-bold">
              {user?.phone || ""}
            </span>
          </div>
          <div className="flex flex-col sm:items-center sm:flex-row sm:gap-4">
            <span className="text-xs sm:text-sm text-gray-500">Email:</span>
            <span className="text-sm sm:text-base font-bold">
              {user?.email || ""}
            </span>
          </div>
          <div className="flex flex-col sm:items-center sm:flex-row sm:gap-4">
            <span className="text-xs sm:text-sm text-gray-500">Address:</span>
            <span className="text-sm sm:text-base font-bold">
              {user?.addresses?.[0].addressLine || ""}
            </span>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <EditDetailsForm onClose={handleCloseModal} user={user} />
        </Modal>
      )}
    </div>
  );
};

export default PersonalInfo;
