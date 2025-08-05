import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../../components/Spinner";
import { XCircle } from "lucide-react";
import { useCategoryForm } from "../../hooks/useCategoryForm.js";
import Input from "../../components/Form/Input/Input.jsx";

const CategoryForm = () => {
  const { categoryId } = useParams();
  const isEditMode = !!categoryId;
  const navigate = useNavigate();
  const {
    categoryData,
    allCategories,
    isLoadingForm,
    formError,
    createCategory,
    updateCategory,
    isCreating,
    isUpdating,
  } = useCategoryForm(categoryId);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      parent: "",
      icon: null,
      clearIcon: false,
    },
  });

  const watchIcon = watch("icon");
  const [previewIconUrl, setpreviewIconUrl] = useState(null);

  useEffect(() => {
    if (isEditMode && categoryData) {
      setValue("name", categoryData.name);
      setValue("description", categoryData.description);
      setValue("parent", categoryData.parent?._id || "");
      setpreviewIconUrl(categoryData.icon?.url || null);
    }
  }, [isEditMode, categoryData, setValue]);

  useEffect(() => {
    if (watchIcon && watchIcon[0]) {
      const file = watchIcon[0];
      if (file instanceof File) {
        const url = URL.createObjectURL(file);
        setpreviewIconUrl(url);
        return () => URL.revokeObjectURL(url);
      }
    }
  }, [watchIcon]);

  useEffect(() => {
    if (formError) {
      toast.error(formError?.message || "An error occurred.");
    }
  }, [formError]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("parent", data.parent || "");

    if (data.icon && data.icon[0] instanceof File) {
      formData.append("icon", data.icon?.[0]);
    }

    if (isEditMode) {
      await updateCategory({ categoryId, formData });
      toast.success("Category updated successfully!");
    } else {
      await createCategory(formData);
      toast.success("Category created successfully!");
    }
    navigate("/categories");
  };

  console.log("isCreatin:", isCreating, "isUpdating:", isUpdating);

  if (isLoadingForm || isCreating || isUpdating) {
    return (
      <div className="flex justify-center items-center absolute inset-0 bg-white/80 z-50">
        <Spinner />
      </div>
    );
  }

  // Exclude current category and its descendants from parent options
  const getDescendantIds = (categories, parentId) => {
    const descendants = [];
    const findDescendants = (id) => {
      categories.forEach((cat) => {
        if (cat.parent?._id === id) {
          descendants.push(cat._id);
          findDescendants(cat._id);
        }
      });
    };
    findDescendants(parentId);
    return descendants;
  };

  const descendantIds = categoryId
    ? getDescendantIds(allCategories || [], categoryId)
    : [];

  const parentCategoriesOptions =
    allCategories?.filter(
      (cat) => cat._id !== categoryId && !descendantIds.includes(cat._id)
    ) || [];

  return (
    <div className="category-form-content">
      <h2 className="text-2xl text-primary font-semibold font-fraunces mb-6">
        {isEditMode ? "Edit Category" : "Create New Category"}
      </h2>

      <div className="inset-glow-border flex flex-col p-6 bg-white/80 shadow-lg rounded-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <Input
              label="Name"
              placeholder="Category Name"
              type="text"
              id="name"
              error={errors.name?.message}
              {...register("name", {
                required: "Category name is required.",
              })}
            />
          </div>

          <div className="col-span-2">
            <label className="block font-IBM-Plex text-black text-sm mb-2">
              Parent Category (Optional)
            </label>

            <div className="flex flex-wrap gap-4 w-full">
              {parentCategoriesOptions.length === 0 && (
                <span className="text-gray-500 px-2 py-1 bg-gray-100 rounded-md">
                  No parent categories available.
                </span>
              )}
              {parentCategoriesOptions.map((cat) => {
                const isSelected = watch("parent") === cat._id;
                return (
                  <button
                    key={cat._id}
                    type="button"
                    onClick={() =>
                      setValue("parent", isSelected ? "" : cat._id)
                    }
                    className={`group items-center px-2 py-1 border text-xs cursor-pointer rounded-md shadow-sm transition-all duration-200 ${
                      isSelected
                        ? "bg-primary border-none text-white hover:bg-primary/90"
                        : "border-gray-300 hover:border-primary"
                    }`}
                  >
                    {/* <div className="w-4 h-4 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                      {cat.icon?.url ? (
                        <img
                          src={cat.icon.url}
                          alt={cat.name}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <span className="text-gray-400 text-xs">No Icon</span>
                      )}
                    </div> */}

                    {cat.name}
                  </button>
                );
              })}
              <input type="hidden" {...register("parent")} />
            </div>

            {errors.parent && (
              <p className="mt-1 text-sm text-red-500">
                {errors.parent.message}
              </p>
            )}
          </div>

          <div>
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
                  : "border-gray-300 focus:ring-primary"
              } focus:ring-2 focus:border-transparent shadow-sm hover:shadow-md`}
            ></textarea>
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Image Uplodation and preview */}
          <div className="col-span-2">
            <label
              htmlFor="icon"
              className="block font-IBM-Plex text-black text-sm mb-2"
            >
              Category Icon
            </label>
            <input
              type="file"
              id="icon"
              {...register("icon", {
                validate: (value) => {
                  if (isEditMode && previewIconUrl) return true;
                  if (value && value.length > 0 && value[0] instanceof File)
                    return true;
                  return "Category icon is required.";
                },
              })}
              accept="image/*"
              className="hidden"
            />
            <div className="flex items-start gap-4">
              <label
                htmlFor="icon"
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
            {errors.icon && (
              <p className="text-red-600 text-sm mt-1">{errors.icon.message}</p>
            )}
          </div>

          <div className="flex justify-end col-span-2 space-x-4">
            <button
              type="button"
              onClick={() => navigate("/categories")}
              className="px-4 py-2 border rounded cursor-pointer hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary px-6 py-2 text-lg"
              disabled={isCreating || isUpdating}
            >
              {isLoadingForm
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                ? "Update Category"
                : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;
