import React, { useState } from "react";
import Modal from "../../components/Modal/Modal";
import EditDetailsForm from "../../components/Form/EditDetailsForm";
import { formatDate } from "../../utils/formatters";
import Spinner from "../../components/Spinner";
import { useProfile } from "../../hooks/useProfile";

const Overview = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { user, isLoading, error, isFetching } = useProfile();

  const handleOnEditDetails = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

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
      <h2 className="text-lg sm:text-xl font-bold pb-4">Account Overview</h2>

      <div className="border border-primary rounded-sm">
        {/* Personal Information Section */}
        <div className="flex justify-between items-center bg-red-50 rounded-sm text-primary p-3 sm:p-4 gap-2">
          <h3 className="text-base sm:text-lg font-semibold">
            Personal Information
          </h3>
          <button
            onClick={handleOnEditDetails}
            className="px-3 py-2 text-xs sm:text-sm font-medium border border-primary text-primary rounded-sm bg-white cursor-pointer"
          >
            Edit Details
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 border-t border-primary">
          {/* Name */}
          <div className="flex flex-col sm:flex-row sm:gap-2 text-sm">
            <span className="text-gray-500">Name:</span>
            <span className="font-bold">
              {user?.firstName + " " + user?.lastName}
            </span>
          </div>
          {/* Date of Birth */}
          <div className="flex flex-col sm:flex-row sm:gap-2 text-sm">
            <span className="text-gray-500">Date of Birth:</span>
            <span className="font-bold">{formatDate(user?.dob) || ""}</span>
          </div>
          {/* Phone No */}
          <div className="flex flex-col sm:flex-row sm:gap-2 text-sm">
            <span className="text-gray-500">Phone No:</span>
            <span className="font-bold">{user?.phone || ""}</span>
          </div>
          {/* Email */}
          <div className="flex flex-col sm:flex-row sm:gap-2 text-sm">
            <span className="text-gray-500">Email:</span>
            <span className="font-bold">{user?.email || ""}</span>
          </div>
          {/* Address */}
          <div className="flex flex-col sm:flex-row sm:gap-2 text-sm">
            <span className="text-gray-500">Address:</span>
            <span className="font-bold">
              {user?.addresses?.[0]?.addressLine || ""}
            </span>
          </div>
          {/* Gender */}
          <div className="flex flex-col sm:flex-row sm:gap-2 text-sm">
            <span className="text-gray-500">Gender:</span>
            <span className="font-bold">{user?.gender || ""}</span>
          </div>
          {/* Anniversary Date */}
          <div className="flex flex-col sm:flex-row sm:gap-2 text-sm">
            <span className="text-gray-500">Anniversary Date:</span>
            <span className="font-bold">
              {formatDate(user?.anniversary) || ""}
            </span>
          </div>
        </div>
      </div>

      {/* Conditionally render the modal */}
      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <EditDetailsForm onClose={handleCloseModal} user={user} />
        </Modal>
      )}
    </div>
  );
};

export default Overview;
