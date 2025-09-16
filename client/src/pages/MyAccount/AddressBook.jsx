import React, { useState } from "react";
import { useProfile } from "../../hooks/useProfile";
import Spinner from "../../components/Spinner";
import AddressForm from "../../components/Form/AddressForm";
import Modal from "../../components/Modal/Modal";
import ConfirmModal from "../../components/Modal/ConfirmModal";

const AddressBook = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({
    open: false,
    addressId: null,
  });

  const handleOnAddAddress = () => {
    setSelectedAddress(null);
    setIsModalOpen(true);
  };

  const handleOnEditAddress = (address) => {
    setSelectedAddress(address);
    setIsModalOpen(true);
  };

  const handleOnDeleteAddress = (addressId) => {
    setConfirmDelete({ open: true, addressId });
  };

  const handleConfirmDelete = async () => {
    if (confirmDelete.addressId) {
      console.log(confirmDelete.addressId);
      await deleteAddress(confirmDelete.addressId);
    }
    setConfirmDelete({ open: false, addressId: null });
  };

  const handleCancelDelete = () => {
    setConfirmDelete({ open: false, addressId: null });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAddress(null);
  };

  const {
    addresses,
    addAddress,
    isAdding,
    updateAddress,
    isUpdating,
    deleteAddress,
    isDeleting,
    isLoading,
    error,
    isFetching,
  } = useProfile();

  const handleSubmitAddress = async (data) => {
    if (selectedAddress) {
      await updateAddress({
        addressId: selectedAddress._id,
        addressData: data,
      });
    } else {
      await addAddress(data);
    }
  };

  if (isLoading || isFetching || isAdding || isUpdating || isDeleting) {
    return (
      <div className="flex justify-center items-center fixed inset-0 bg-white/80 z-50">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded">
        Error loading addresses. Please try again later.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg font-nunito mb-6 text-gray-800">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 gap-2">
        <h2 className="text-lg sm:text-xl font-bold">Address Book</h2>
        <button
          onClick={handleOnAddAddress}
          className="py-2 px-4 text-xs sm:text-sm font-medium border border-primary text-primary rounded-sm bg-white cursor-pointer"
        >
          Add New Address
        </button>
      </div>

      {/* Address Cards */}
      {addresses.map((address, idx) => (
        <div className="border border-primary rounded-sm mt-4" key={idx}>
          {/* Card Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-red-50 rounded-sm text-primary p-3 sm:p-4 gap-2 sm:gap-0">
            <h3 className="text-base sm:text-lg font-semibold">
              Address ({address.type})
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => handleOnEditAddress(address)}
                className="px-3 py-2 text-xs sm:text-sm font-medium border border-primary text-primary rounded-sm bg-white cursor-pointer"
              >
                Edit Address
              </button>
              <button
                onClick={() => handleOnDeleteAddress(address._id)}
                className="px-3 py-2 text-xs sm:text-sm font-medium border border-primary text-primary rounded-sm bg-white cursor-pointer"
              >
                Delete Address
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 border-t border-primary">
            {/* Address Line */}
            <div className="flex flex-col lg:flex-row lg:gap-2 text-sm">
              <span className="text-gray-500">Address Line:</span>
              <span className="font-bold">{address.addressLine || ""}</span>
            </div>
            {/* Landmark */}
            <div className="flex flex-col lg:flex-row lg:gap-2 text-sm">
              <span className="text-gray-500">Landmark:</span>
              <span className="font-bold">{address.landmark || ""}</span>
            </div>
            {/* City */}
            <div className="flex flex-col lg:flex-row lg:gap-2 text-sm">
              <span className="text-gray-500">City:</span>
              <span className="font-bold">{address.city || ""}</span>
            </div>
            {/* State */}
            <div className="flex flex-col lg:flex-row lg:gap-2 text-sm">
              <span className="text-gray-500">State:</span>
              <span className="font-bold">{address.state || ""}</span>
            </div>
            {/* Pincode */}
            <div className="flex flex-col lg:flex-row lg:gap-2 text-sm">
              <span className="text-gray-500">Pincode:</span>
              <span className="font-bold">{address.pincode || ""}</span>
            </div>
            {/* Address Type */}
            <div className="flex flex-col lg:flex-row lg:gap-2 text-sm">
              <span className="text-gray-500">Address Type:</span>
              <span className="font-bold">{address.type || ""}</span>
            </div>
          </div>
        </div>
      ))}

      {/* Conditionally render the modal for add/edit */}
      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <AddressForm
            onClose={handleCloseModal}
            address={selectedAddress}
            onSubmitAddress={handleSubmitAddress}
          />
        </Modal>
      )}

      {/* ConfirmModal for delete */}
      <ConfirmModal
        open={confirmDelete.open}
        title="Delete Address"
        message="Are you sure you want to delete this address? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default AddressBook;
