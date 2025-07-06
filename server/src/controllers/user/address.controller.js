import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { User } from "../../models/user.model.js";
import { Address } from "../../models/address.model.js";

/**
 * @desc Add a new address for the authenticated user.
 * @route POST /api/v1/users/me/addresses
 * @access Private
 */
const addAddress = asyncHandler(async (req, res) => {
  // req.user is populated by the verifyJWT middleware
  if (!req.user?._id) {
    throw new ApiError(401, "User not authenticated.");
  }

  const { fullName, phone, pincode, state, city, addressLine, landmark, type } =
    req.body;

  if (
    [fullName, phone, pincode, state, city, addressLine, type].some(
      (field) => field?.trim() === "" || field === undefined
    )
  ) {
    throw new ApiError(400, "All required address fields must be provided.");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const newAddress = await Address.create({
    user: user._id,
    fullName,
    phone,
    pincode,
    state,
    city,
    addressLine,
    landmark,
    type,
  });

  user.addresses.push(newAddress._id);
  await user.save({ validateBeforeSave: false });

  return res
    .status(201)
    .json(new ApiResponse(201, newAddress, "Address added successfully."));
});

/**
 * @desc Get all addresses for the authenticated user.
 * @route GET /api/v1/users/me/addresses
 * @access Private
 */
const getAddresses = asyncHandler(async (req, res) => {
  // req.user is populated by the verifyJWT middleware
  if (!req.user?._id) {
    throw new ApiError(401, "User not authenticated.");
  }

  const addresses = await Address.find({ user: req.user._id });

  if (!addresses || addresses.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No addresses found for this user."));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, addresses, "Addresses fetched successfully."));
});

/**
 * @desc Get a specific address by ID for the authenticated user.
 * @route GET /api/v1/users/me/addresses/:addressId
 * @access Private
 */
const getAddressById = asyncHandler(async (req, res) => {
  // req.user is populated by the verifyJWT middleware
  if (!req.user?._id) {
    throw new ApiError(401, "User not authenticated.");
  }

  const { addressId } = req.params;

  const address = await Address.findOne({ _id: addressId, user: req.user._id });

  if (!address) {
    throw new ApiError(
      404,
      "Address not found or does not belong to the user."
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, address, "Address fetched successfully."));
});

/**
 * @desc Update a specific address by ID for the authenticated user.
 * @route PUT /api/v1/users/me/addresses/:addressId
 * @access Private
 */
const updateAddress = asyncHandler(async (req, res) => {
  // req.user is populated by the verifyJWT middleware
  if (!req.user?._id) {
    throw new ApiError(401, "User not authenticated.");
  }

  const { addressId } = req.params;
  const { fullName, phone, pincode, state, city, addressLine, landmark, type } =
    req.body;

  const address = await Address.findOne({ _id: addressId, user: req.user._id });

  if (!address) {
    throw new ApiError(
      404,
      "Address not found or does not belong to the user."
    );
  }

  if (fullName !== undefined && fullName.trim() !== "")
    address.fullName = fullName.trim();
  if (phone !== undefined && phone.trim() !== "") address.phone = phone.trim();
  if (pincode !== undefined && pincode.trim() !== "")
    address.pincode = pincode.trim();
  if (state !== undefined && state.trim() !== "") address.state = state.trim();
  if (city !== undefined && city.trim() !== "") address.city = city.trim();
  if (addressLine !== undefined && addressLine.trim() !== "")
    address.addressLine = addressLine.trim();
  if (landmark !== undefined) address.landmark = landmark.trim();
  if (type !== undefined && type.trim() !== "") address.type = type.trim();

  await address.save();

  return res
    .status(200)
    .json(new ApiResponse(200, address, "Address updated successfully."));
});

/**
 * @desc Delete a specific address by ID for the authenticated user.
 * @route DELETE /api/v1/users/me/addresses/:addressId
 * @access Private
 */
const deleteAddress = asyncHandler(async (req, res) => {
  // req.user is populated by the verifyJWT middleware
  if (!req.user?._id) {
    throw new ApiError(401, "User not authenticated.");
  }

  const { addressId } = req.params;

  const address = await Address.findOneAndDelete({
    _id: addressId,
    user: req.user._id,
  });

  if (!address) {
    throw new ApiError(
      404,
      "Address not found or does not belong to the user."
    );
  }

  await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { addresses: address._id } },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Address deleted successfully."));
});

export {
  addAddress,
  getAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
};
