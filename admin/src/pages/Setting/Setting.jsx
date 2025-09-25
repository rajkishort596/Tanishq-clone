import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Input from "../../components/Form/Input/Input";
import Textarea from "../../components/Form/Textarea/Textarea";
import {
  Store,
  Phone,
  MessageCircle,
  CreditCard,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Image as ImageIcon,
} from "lucide-react";
import { useSettings } from "../../hooks/useSettings.js";
import Spinner from "../../components/Spinner";
import Select from "../../components/Form/Select/Select.jsx";
import { toast } from "react-toastify";

const Setting = () => {
  const [activeTab, setActiveTab] = useState("store");

  const { settingsData, isLoading, isUpdating, error, updateSettings } =
    useSettings();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: settingsData || {
      storeInfo: { name: "", logo: null, description: "" },
      contactInfo: { emails: [""], phones: [""], whatsapp: "", address: "" },
      socialLinks: { facebook: "", instagram: "", twitter: "", youtube: "" },
      paymentSettings: { methods: [], currency: "INR", codEnabled: true },
    },
  });

  const logoImage = watch("storeInfo.logo");
  const [logoPreview, setLogoPreview] = useState(null);

  useEffect(() => {
    if (logoImage && logoImage[0] instanceof File) {
      const url = URL.createObjectURL(logoImage[0]);
      setLogoPreview(url);
      return () => URL.revokeObjectURL(url);
    } else if (settingsData?.storeInfo?.logo) {
      setLogoPreview(settingsData.storeInfo.logo.url);
    } else {
      setLogoPreview(null);
    }
  }, [logoImage, settingsData]);

  // Effect to reset the form with new data when it's loaded
  useEffect(() => {
    if (settingsData) {
      reset(settingsData);
      setLogoPreview(settingsData.storeInfo.logo?.url || null);
    }
  }, [settingsData, reset]);

  const onSubmit = async (data) => {
    const formData = new FormData();

    // Append the logo file if it exists.
    if (data.storeInfo.logo && data.storeInfo.logo[0]) {
      formData.append("logo", data.storeInfo.logo[0]);
    }
    formData.append(
      "storeInfo",
      JSON.stringify({
        name: data.storeInfo.name,
        description: data.storeInfo.description,
      })
    );
    formData.append("contactInfo", JSON.stringify(data.contactInfo));
    formData.append("socialLinks", JSON.stringify(data.socialLinks));
    formData.append("paymentSettings", JSON.stringify(data.paymentSettings));

    try {
      await updateSettings(formData);
    } catch (error) {
      console.error("Failed to submit form:", error);
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error?.message || "Failed to load dashboard data.");
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center absolute inset-0 bg-white/80 z-50">
        <Spinner />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex justify-center items-center h-full min-h-[calc(100vh-120px)] text-red-600">
        <p>Error: {error.message || "Could not load settings data."}</p>
      </div>
    );
  }

  return (
    <div className="settings-content">
      <h2 className="text-2xl font-fraunces font-semibold text-primary mb-6">
        Settings
      </h2>
      <div className="settings-container gap-6 flex flex-col md:flex-row font-IBM-Plex">
        {/* Left Sidebar for Submenu */}
        <div className="md:w-64 w-full">
          <div className="glass-card">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveTab("store")}
                  className={`w-full flex items-center gap-3 p-3 text-left rounded-lg transition-all duration-200 cursor-pointer ${
                    activeTab === "store"
                      ? "bg-primary text-white shadow-md"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  <Store size={18} /> Store Info
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("contact")}
                  className={`w-full flex items-center gap-3 p-3 text-left rounded-lg transition-all duration-200 cursor-pointer ${
                    activeTab === "contact"
                      ? "bg-primary text-white shadow-md"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  <Phone size={18} /> Contact Info
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("social")}
                  className={`w-full flex items-center gap-3 p-3 text-left rounded-lg transition-all duration-200 cursor-pointer ${
                    activeTab === "social"
                      ? "bg-primary text-white shadow-md"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  <MessageCircle size={18} /> Social Links
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("payment")}
                  className={`w-full flex items-center gap-3 p-3 text-left rounded-lg transition-all duration-200 cursor-pointer ${
                    activeTab === "payment"
                      ? "bg-primary text-white shadow-md"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  <CreditCard size={18} /> Payment
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Content Panel with Form */}
        <div className="flex-1">
          <div className="bg-white p-6 shadow-xl rounded-lg">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Store Info Form */}
              {activeTab === "store" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-fraunces font-semibold text-secondary">
                    Store Information
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="relative w-24 h-24 rounded-full  flex items-center justify-center overflow-hidden">
                      {logoPreview ? (
                        <img
                          src={logoPreview}
                          alt="Store Logo Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon size={32} className="text-gray-400" />
                      )}
                      <label
                        htmlFor="storeInfo.logo"
                        className="absolute inset-0 cursor-pointer flex flex-col items-center justify-center rounded-full border-2 border-dashed border-gray-300 hover:border-primary transition"
                      ></label>
                    </div>
                    <input
                      id="storeInfo.logo"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      {...register("storeInfo.logo")}
                    />
                    <div className="flex-1">
                      <Input
                        label="Store Name"
                        id="store-name"
                        placeholder="Enter your store name"
                        type="text"
                        {...register("storeInfo.name", {
                          required: "Store name is required.",
                        })}
                        error={errors.storeInfo?.name.message}
                      />
                    </div>
                  </div>
                  <div>
                    <Textarea
                      label="Store Description"
                      id="store-description"
                      {...register("storeInfo.description")}
                      rows="3"
                      placeholder="Enter a brief description of your store"
                      error={errors.storeInfo?.description?.message}
                    />
                  </div>
                </div>
              )}

              {/* Contact Info Form */}
              {activeTab === "contact" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-fraunces font-semibold text-secondary">
                    Contact Information
                  </h3>
                  <div>
                    <Input
                      label="Email"
                      type="email"
                      id="contact-email-0"
                      placeholder="Enter your contact email"
                      {...register("contactInfo.emails.0", {
                        required: "Email is required.",
                      })}
                      error={errors.contactInfo?.emails?.[0]?.message}
                    />
                  </div>
                  <div>
                    <Input
                      label="Phone"
                      type="tel"
                      id="contact-phone-0"
                      placeholder="Enter phone number"
                      {...register("contactInfo.phones.0", {
                        required: "Phone number is required.",
                      })}
                      error={errors.contactInfo?.phones?.[0]?.message}
                    />
                  </div>
                  <div>
                    <Input
                      label="WhatsApp Number"
                      type="tel"
                      id="contact-whatsapp"
                      placeholder="Enter WhatsApp number"
                      {...register("contactInfo.whatsapp")}
                      error={errors.contactInfo?.whatsapp?.message}
                    />
                  </div>
                  <div>
                    <Textarea
                      label="Address"
                      id="contact-address"
                      {...register("contactInfo.address")}
                      rows="3"
                      placeholder="Enter store address"
                      error={errors.contactInfo?.address?.message}
                    />
                  </div>
                </div>
              )}

              {/* Social Links Form */}
              {activeTab === "social" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-fraunces font-semibold text-secondary">
                    Social Media Links
                  </h3>
                  <Input
                    label="Facebook URL"
                    type="url"
                    id="social-facebook"
                    icon={<Facebook size={16} />}
                    placeholder="https://facebook.com/yourpage"
                    {...register("socialLinks.facebook")}
                    error={errors.socialLinks?.facebook?.message}
                  />
                  <Input
                    label="Instagram URL"
                    type="url"
                    id="social-instagram"
                    icon={<Instagram size={16} />}
                    placeholder="https://instagram.com/yourpage"
                    {...register("socialLinks.instagram")}
                    error={errors.socialLinks?.instagram?.message}
                  />
                  <Input
                    label="Twitter URL"
                    type="url"
                    id="social-twitter"
                    icon={<Twitter size={16} />}
                    placeholder="https://twitter.com/yourpage"
                    {...register("socialLinks.twitter")}
                    error={errors.socialLinks?.twitter?.message}
                  />
                  <Input
                    label="YouTube URL"
                    type="url"
                    id="social-youtube"
                    icon={<Youtube size={16} />}
                    placeholder="https://youtube.com/yourchannel"
                    {...register("socialLinks.youtube")}
                    error={errors.socialLinks?.youtube?.message}
                  />
                </div>
              )}

              {/* Payment Settings Form */}
              {activeTab === "payment" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-fraunces font-semibold text-secondary">
                    Payment Settings
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Enable Cash on Delivery (COD)
                    </span>
                    <label
                      htmlFor="cod-enabled"
                      className="relative inline-flex items-center cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        id="cod-enabled"
                        className="sr-only peer"
                        {...register("paymentSettings.codEnabled")}
                      />
                      <div className="w-11 h-6 bg-gray-400 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div>
                    <Select
                      label="Select Currency"
                      id="currency-select"
                      {...register("paymentSettings.currency")}
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                    </Select>
                  </div>
                  {/* Additional payment methods */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">
                      Payment Gateways
                    </h4>
                    {settingsData.paymentSettings.methods.map(
                      (method, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-100 rounded-md"
                        >
                          <span className="text-sm">{method.name}</span>
                          <div className="flex items-center gap-2">
                            <label
                              htmlFor={`method-${index}`}
                              className="relative inline-flex items-center cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                id={`method-${index}`}
                                className="sr-only peer"
                                {...register(
                                  `paymentSettings.methods.${index}.enabled`
                                )}
                              />
                              <div className="w-11 h-6 bg-gray-400 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="btn-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
