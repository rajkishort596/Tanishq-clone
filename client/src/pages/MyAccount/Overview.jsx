import React, { useState } from "react";
import { Edit } from "lucide-react";
import { useSelector } from "react-redux";

import Modal from "../../components/Modal/Modal";
import EditDetailsForm from "../../components/Form/EditDetailsForm";
import { formatDate } from "../../utils/formatters";

const Overview = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);

  console.log(user);

  const handleOnEditDetails = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white rounded-lg font-nunito mb-6 text-gray-800">
      <h2 className="text-xl font-bold pb-4">Account Overview</h2>

      <div className="border border-primary rounded-sm">
        {/* Personal Information Section */}
        <div className="flex justify-between items-center bg-red-50  rounded-sm text-primary p-4">
          <h3 className="text-lg font-semibold">Personal Information</h3>
          <button
            onClick={handleOnEditDetails}
            className="p-2 flex items-center text-sm font-medium border border-primary text-primary rounded-sm bg-white cursor-pointer"
          >
            Edit Details
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border-t border-primary">
          {/* Name */}
          <div className="flex gap-4 items-center">
            <span className="text-sm text-gray-500">Name:</span>
            <span className="text-sm font-bold">
              {user?.firstName + " " + user?.lastName}
            </span>
          </div>
          {/* Date of Birth */}
          <div className="flex gap-4 items-center">
            <span className="text-sm text-gray-500">Date of Birth:</span>
            <span className="text-sm font-bold">
              {formatDate(user?.dob) || ""}
            </span>
          </div>
          {/* Phone No */}
          <div className="flex gap-4 items-center">
            <span className="text-sm text-gray-500">Phone No:</span>
            <span className="text-sm font-bold">{user?.phone || ""}</span>
          </div>
          {/* Email */}
          <div className="flex gap-4 items-center">
            <span className="text-sm text-gray-500">Email:</span>
            <span className="text-sm font-bold">{user?.email || ""}</span>
          </div>
          {/* Address */}
          <div className="flex gap-4 items-center">
            <span className="text-sm text-gray-500">Address:</span>
            <span className="text-sm font-bold">
              {user?.addresses?.[0].addressLine || ""}
            </span>
          </div>
          {/* Gender */}
          <div className="flex gap-4 items-center">
            <span className="text-sm text-gray-500">Gender:</span>
            <span className="text-sm font-bold">{user?.gender || ""}</span>
          </div>
          {/* Anniversary Date */}
          <div className="flex gap-4 items-center">
            <span className="text-sm text-gray-500">Anniversary Date:</span>
            <span className="text-sm font-bold">{user?.anniversary || ""}</span>
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
