import mongoose, { Schema } from "mongoose";

const addressSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  fullName: String,
  phone: String,
  pincode: String,
  state: String,
  city: String,
  addressLine: String,
  landmark: String,
  type: {
    type: String,
    enum: ["home", "work", "other"],
  },
});

export const Address = mongoose.model("Address", addressSchema);
