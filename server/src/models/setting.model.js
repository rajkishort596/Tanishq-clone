import mongoose from "mongoose";

const SettingSchema = new mongoose.Schema(
  {
    storeInfo: {
      name: {
        type: String,
        required: true,
      },
      logo: {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          required: true,
        },
      },
      description: {
        type: String,
        trim: true,
      },
    },
    contactInfo: {
      emails: [
        {
          type: String,
          required: true,
          trim: true,
        },
      ],
      phones: [
        {
          type: String,
          required: true,
          trim: true,
        },
      ],
      whatsapp: {
        type: String,
        trim: true,
      },
      address: {
        type: String,
        trim: true,
      },
    },
    socialLinks: {
      facebook: {
        type: String,
        trim: true,
      },
      instagram: {
        type: String,
        trim: true,
      },
      twitter: {
        type: String,
        trim: true,
      },
      youtube: {
        type: String,
        trim: true,
      },
    },
    paymentSettings: {
      methods: [
        {
          name: String,
          enabled: Boolean,
        },
      ],
      currency: {
        type: String,
        default: "INR",
        required: true,
      },
      codEnabled: {
        type: Boolean,
        default: true,
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Setting", SettingSchema);
