import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      lowercase: true,
      trim: true,
    },
    lastName: {
      type: String,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    avatar: {
      url: {
        type: String,
      },
      publicId: {
        type: String,
      },
    },
    password: {
      type: String,
    },
    phone: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    resetPasswordTokenHash: {
      type: String,
    },
    addresses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
      },
    ],
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    cart: {
      items: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          variantId: { type: String },
          quantity: { type: Number, required: true, min: 1 },
          addedAt: { type: Date, default: Date.now },
        },
      ],
      totalQuantity: { type: Number, default: 0 },
      totalPrice: { type: Number, default: 0 },
      lastUpdated: { type: Date, default: Date.now },
    },
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    otp: {
      type: String,
    },
    otpExpiry: {
      type: Date,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generatePasswordResetToken = async function () {
  const payload = {
    _id: this._id,
    email: this.email,
  };
  // Expires in 1 hour
  const token = jwt.sign(payload, process.env.RESET_PASSWORD_SECRET, {
    expiresIn: "1h",
  });

  // Hash the token for storage
  this.resetPasswordTokenHash = bcrypt.hashSync(token, 10);
  await this.save({ validateBeforeSave: false });
  return token;
};

export const User = mongoose.model("User", userSchema);
