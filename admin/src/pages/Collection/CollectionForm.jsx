import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import Input from "../../components/Form/Input/Input";
import { useCollectionForm } from "../../hooks/useCollectionForm";
const CollectionForm = () => {
  const { collectionId } = useParams();
  const isEditMode = !!collectionId;
  const navigate = useNavigate();

  const {
    collectionData,
    allCollections,
    isLoadingForm,
    formError,
    createCollection,
    updateCollection,
    isCreating,
    isUpdating,
  } = useCollectionForm(collectionId);

  const {
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      image: null,
      isActive: true,
      bannerImage: null,
      endDate: "",
    },
  });

  const watchIcon = watch("image");
  const watchBanner = watch("bannerImage");
  const [previewIconUrl, setpreviewIconUrl] = useState(null);
  const [previewBannerUrl, setpreviewBannerUrl] = useState(null);

  useEffect(() => {
    if (isEditMode && collectionData) {
      setValue("name", collectionData.name);
      setValue("description", collectionData.description);
      setValue("endData", collectionData.endDate || "");
      setValue("isActive", collectionData.isActive);
    }
  }, [isEditMode, collectionData, setValue]);

  useEffect(() => {
    if (watchIcon && watchIcon[0] instanceof File) {
      const url = URL.createObjectURL(watchIcon[0]);
      setpreviewIconUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (isEditMode && collectionData?.image) {
      setpreviewIconUrl(collectionData.image.url);
    } else {
      setpreviewIconUrl(null);
    }
  }, [watchIcon, isEditMode, collectionData]);
  useEffect(() => {
    if (watchBanner && watchBanner[0] instanceof File) {
      const url = URL.createObjectURL(watchBanner[0]);
      setpreviewBannerUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (isEditMode && collectionData?.bannerImage) {
      setpreviewBannerUrl(collectionData.bannerImage.url);
    } else {
      setpreviewBannerUrl(null);
    }
  }, [watchBanner, isEditMode, collectionData]);

  useEffect(() => {
    if (formError) {
      toast.error(formError?.message || "An error occured.");
    }
  }, [formError]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("endDate", data.endDate);
    formData.append(
      "isActive",
      data.isActive === true || data.isActive === "true"
    );

    if (data.image && data.image[0] instanceof File) {
      formData.append("image", data.image?.[0]);
    }
    if (data.bannerImage && data.bannerImage[0] instanceof File) {
      formData.append("bannerImage", data.bannerImage?.[0]);
    }
    if (isEditMode) {
      await updateCollection({ collectionId, formData });
      toast.success("Collection updated successfully!");
    } else {
      await createCollection(formData);
      toast.success("Collection created successfully!");
    }
    navigate("/collections");
  };
  console.log("isCreatin:", isCreating, "isUpdating:", isUpdating);

  if (isLoadingForm || isCreating || isUpdating) {
    return (
      <div className="flex justify-center items-center absolute inset-0 bg-white/80 z-50">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="collection-form-content">
      <h2 className="text-2xl text-primary font-semibold font-fraunces mb-6">
        {isEditMode ? "Edit Collection" : "Create New Collection"}
      </h2>
      <div className="inset-glow-border flex flex-col p-6 bg-white/80 shadow-lg rounded-lg">
        <form
          className="grid grid-cols-2 gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <Input
              label="Collection Name"
              placeholder="Collection Name"
              type="text"
              id="name"
              error={errors.name?.message}
              {...register("name", {
                required: "Collection name is required",
              })}
            />
          </div>
          <div className="flex justify-between gap-4">
            <div className="w-full">
              <Input
                label="Ending Date (Optional)"
                placeholder="Ending Date"
                type="date"
                id="endDate"
                error={errors.endDate?.message}
                {...register("endDate")}
              />
            </div>
            {/* Status Toggle */}
            <div className="w-full flex flex-col justify-start">
              <label className="block font-IBM-Plex text-black text-sm mb-2">
                Status
              </label>
              <div className="flex gap-2">
                {[
                  { label: "Active", value: true },
                  { label: "Inactive", value: false },
                ].map((s) => {
                  const isSelected = watch("isActive") === s.value;
                  return (
                    <button
                      type="button"
                      key={s.label}
                      onClick={() =>
                        setValue("isActive", s.value, {
                          shouldValidate: true,
                          shouldDirty: true,
                        })
                      }
                      className={`px-4 py-2 rounded-md border font-medium flex items-center gap-2 transition cursor-pointer ${
                        isSelected
                          ? "bg-primary text-white border-primary shadow"
                          : "bg-white text-gray-700 border-gray-300"
                      }`}
                    >
                      {s.label}
                    </button>
                  );
                })}
                {/* hidden input to register the field */}
                <input
                  type="hidden"
                  {...register("isActive", {
                    validate: (v) =>
                      v === true || v === false || "Status is required.",
                  })}
                />
              </div>
              {errors.isActive && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.isActive?.message}
                </p>
              )}
            </div>
          </div>
          <div className="col-span-2">
            <label
              htmlFor="description"
              className="block font-IBM-Plex text-black text-sm mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              {...register("description", {
                required: "Description is required.",
              })}
              rows="4"
              className={`w-full px-4 py-2 rounded-md border bg-white text-gray-800 transition-all duration-300 outline-none ${
                errors.description
                  ? "border-red-500 focus:ring-red-300 text-red-600"
                  : "border-grey-300 focus:ring-primary"
              } focus-ring-2 focus:border-transparent shadow-sm hover:shadow-md`}
            ></textarea>
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">
                {errors.description?.message}
              </p>
            )}
          </div>

          {/* Image Uploadation and preview */}
          <div>
            <label
              htmlFor="image"
              className="block font-IBM-Plex text-black text-sm mb-2"
            >
              Collection Icon
            </label>
            <input
              type="file"
              id="image"
              {...register("image", {
                validate: (value) => {
                  if (isEditMode && previewIconUrl) return true;
                  if (value && value.length > 0 && value[0] instanceof File)
                    return true;
                  return "Collection image is required.";
                },
              })}
              accept="image/*"
              className="hidden"
            />
            <div className="flex items-start gap-4">
              <label
                htmlFor="image"
                className="cursor-pointer flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded hover:border-primary transition"
              >
                {previewIconUrl ? (
                  <img
                    src={previewIconUrl}
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
          {/*Banner Image Uploadation and preview */}
          <div>
            <label
              htmlFor="bannerImage"
              className="block font-IBM-Plex text-black text-sm mb-2"
            >
              Collection Banner
            </label>
            <input
              type="file"
              id="bannerImage"
              {...register("bannerImage", {
                validate: (value) => {
                  if (isEditMode && previewBannerUrl) return true;
                  if (value && value.length > 0 && value[0] instanceof File)
                    return true;
                  return "Collection Banner Image is required.";
                },
              })}
              accept="image/*"
              className="hidden"
            />
            <div className="flex items-start gap-4">
              <label
                htmlFor="bannerImage"
                className="cursor-pointer flex flex-col items-center justify-center aspect-video h-32 border-2 border-dashed border-gray-300 rounded hover:border-primary transition"
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
            {errors.bannerImage && (
              <p className="mt-1 text-sm text-red-600">
                {errors.bannerImage?.message}
              </p>
            )}
          </div>
          <div className="flex justify-end col-span-2 space-x-4">
            <button
              type="button"
              className="px-4 py-2 border rounded cursor-pointer hover:bg-gray-100"
              onClick={() => navigate("/collections")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary px-6 py-2 text-lg"
              // disabled{isCreating ||isUpdating}
            >
              {isLoadingForm
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                ? "Update collection"
                : "Create collection"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CollectionForm;
