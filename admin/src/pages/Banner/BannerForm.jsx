import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useBannersForm } from "../../hooks/useBannersForm";
import Spinner from "../../components/Spinner";
import Input from "../../components/Form/Input/Input";

const BannerForm = () => {
  const navigate = useNavigate();
  const { bannerId } = useParams();
  const isEditMode = !!bannerId;

  const {
    banner,
    createBanner,
    updateBanner,
    isCreating,
    isUpdating,
    isLoadingForm,
    formError,
  } = useBannersForm(bannerId);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      image: null,
      altText: "",
      linkUrl: "",
      title: "",
      isActive: true,
    },
  });

  const watchBanner = watch("image");
  const [previewBannerUrl, setpreviewBannerUrl] = useState(null);

  // Set default values for the form when in edit mode
  useEffect(() => {
    if (isEditMode && banner) {
      setValue("title", banner?.title);
      setValue("linkUrl", banner?.link);
      setValue("isActive", banner?.active);
    }
  }, [isEditMode, banner, setValue, reset]);

  useEffect(() => {
    if (watchBanner && watchBanner[0] instanceof File) {
      const url = URL.createObjectURL(watchBanner[0]);
      setpreviewBannerUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (isEditMode && banner?.image) {
      setpreviewBannerUrl(banner.image.url);
    } else {
      setpreviewBannerUrl(null);
    }
  }, [watchBanner, isEditMode, banner]);

  useEffect(() => {
    if (formError) {
      toast.error(formError?.message || "An error occured.");
    }
  }, [formError]);

  // Form submission handler
  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("linkUrl", data.linkUrl);
    formData.append("isActive", data.isActive);

    if (data.image && data.image[0] instanceof File) {
      formData.append("image", data.image?.[0]);
    }

    if (isEditMode) {
      await updateBanner({ bannerId, formData });
    } else {
      await createBanner(formData);
    }
    navigate("/banners");
  };

  if (isLoadingForm || isCreating || isUpdating) {
    return (
      <div className="flex justify-center items-center absolute inset-0 bg-white/80 z-50">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="banner-form-content">
      <h2 className="text-2xl text-primary font-semibold font-fraunces mb-6">
        {isEditMode ? "Edit Banner" : "Add New Banner"}
      </h2>
      <div className="bg-white/60 backdrop-blur-lg p-6 rounded-xl font-IBM-Plex shadow-lg mb-8 border border-gray-200">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex gap-6 items-start">
            <div className="w-full">
              <Input
                label="Title"
                type="text"
                id="title"
                error={errors.title?.message}
                {...register("title", { required: "Title is required" })}
              />
            </div>
            <div className="w-full">
              <Input
                label="Link URL (Optional)"
                type="text"
                id="linkUrl"
                error={errors.linkUrl?.message}
                {...register("linkUrl")}
              />
            </div>
          </div>
          {/*Banner Image Uploadation and preview */}
          <div>
            <label
              htmlFor="image"
              className="block font-IBM-Plex text-black text-sm mb-2"
            >
              Banner Image
            </label>
            <input
              type="file"
              id="image"
              {...register("image", {
                validate: (value) => {
                  if (isEditMode && previewBannerUrl) return true;
                  if (value && value.length > 0 && value[0] instanceof File)
                    return true;
                  return "Banner Image is required.";
                },
              })}
              accept="image/*"
              className="hidden"
            />
            <div className="flex items-start gap-4">
              <label
                htmlFor="image"
                className="cursor-pointer flex flex-col items-center justify-center aspect-auto w-2/3 h-80 border-2 border-dashed border-gray-300 rounded hover:border-primary transition"
              >
                {previewBannerUrl ? (
                  <img
                    src={previewBannerUrl}
                    alt="Preview"
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <span className="text-gray-400">Click to upload</span>
                )}
              </label>
            </div>
            {errors.image && (
              <p className="mt-1 text-sm text-red-600">
                {errors.image?.message}
              </p>
            )}
          </div>

          {/* Is Active Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              {...register("isActive")}
              className="mr-2 h-4 w-4 text-primary focus:ring-primary border-black rounded cursor-pointer"
            />
            <label
              htmlFor="isActive"
              className="text-sm font-medium text-primary cursor-pointer"
            >
              Is Active
            </label>
          </div>
          <div className="flex justify-end col-span-2 space-x-4">
            <button
              type="button"
              className="px-4 py-2 border rounded cursor-pointer hover:bg-gray-100"
              onClick={() => navigate("/banners")}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="btn-primary px-6 py-2 text-lg"
            >
              {isLoadingForm
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                ? "Update banner"
                : "Create banner"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BannerForm;
