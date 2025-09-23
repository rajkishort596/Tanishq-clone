import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MultiStepProgress from "../../components/Form/MultiStepProgress";
import ProductDetails from "../../components/Form/ProductDetails";
import ProductPricing from "../../components/Form/ProductPricing";
import ProductSpecifications from "../../components/Form/ProductSpecifications";
import { useProductForm } from "../../hooks/useProductForm.js";
import Spinner from "../../components/Spinner";

const steps = [
  { id: 1, name: "Product Details" },
  { id: 2, name: "Pricing & Inventory" },
  { id: 3, name: "Specifications" },
];

const ProductForm = () => {
  const { productId } = useParams();
  const isEditMode = !!productId;
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [hasAttemptedFinalSubmit, setHasAttemptedFinalSubmit] = useState(false);

  const {
    productData,
    isLoadingForm,
    formError,
    createProduct,
    updateProduct,
    isCreating,
    isUpdating,
  } = useProductForm(productId);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    trigger,
    formState,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      category: "",
      subCategory: "",
      collections: [],
      occasion: [],
      price: { base: "", makingCharges: "", gst: 3 },
      stock: "",
      weight: "",
      variants: [],
      metal: "",
      purity: "",
      gender: "",
      productType: "",
      metalColor: "",
      images: null,
      isActive: true,
    },
    mode: "onTouched",
  });

  const [previewImageUrls, setPreviewImageUrls] = useState([]);
  const watchImages = watch("images");
  useEffect(() => {
    if (isEditMode && productData) {
      setValue("name", productData.name);
      setValue("description", productData.description);
      setValue("category", productData.category?._id || "");
      setValue("subCategory", productData.subCategory?._id || "");
      setValue("collections", productData.collections?.map((c) => c._id) || []);
      setValue("occasion", productData.occasion || []);
      setValue("price.base", productData.price?.base || "");
      setValue("price.makingCharges", productData.price?.makingCharges || "");
      setValue("price.gst", productData.price?.gst || 3);
      setValue("stock", productData.stock);
      setValue("weight", productData.weight || "");
      setValue("variants", productData.variants || []);
      setValue("metal", productData.metal || "");
      setValue("purity", productData.purity || "");
      setValue("productType", productData.productType || "");
      setValue("gender", productData.gender || "");
      setValue("metalColor", productData.metalColor || "");
      setValue("isActive", productData.isActive);
    }
  }, [isEditMode, productData, setValue]);

  useEffect(() => {
    let urls = [];
    const revokeList = [];

    if (
      watchImages &&
      watchImages.length > 0 &&
      watchImages[0] instanceof File
    ) {
      for (let i = 0; i < Math.min(4, watchImages.length); i++) {
        const file = watchImages[i];
        const url = URL.createObjectURL(file);
        urls.push(url);
        revokeList.push(url);
      }
    } else if (isEditMode && productData?.images) {
      urls = (productData.images || []).slice(0, 4).map((img) => img.url);
    }

    setPreviewImageUrls(urls);

    return () => {
      revokeList.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [watchImages, isEditMode, productData]);

  useEffect(() => {
    if (formError) {
      toast.error(formError?.message || "An error occurred.");
    }
  }, [formError]);

  const handleNext = async () => {
    let isValid = false;
    if (currentStep === 1) {
      isValid = await trigger([
        "name",
        "description",
        "category",
        "subCategory",
        "collections",
        "occasion",
      ]);
    } else if (currentStep === 2) {
      isValid = await trigger([
        "price.base",
        "price.makingCharges",
        "price.gst",
        "stock",
        "weight",
        "variants",
      ]);
    }

    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    } else {
      toast.error(`Please complete Step ${currentStep}`);
    }
  };
  console.log("Current Step: " + currentStep);

  const onSubmit = async (data) => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (key === "images") {
        if (data[key] && data[key].length > 0) {
          Array.from(data[key]).forEach((file) => formData.append(key, file));
        }
      } else if (key === "collections" || key === "occasion") {
        // Append each value individually
        data[key].forEach((item) => formData.append(`${key}[]`, item));
      } else if (key === "variants" || key === "price") {
        // If these are complex objects or arrays
        formData.append(key, JSON.stringify(data[key]));
      } else {
        formData.append(key, data[key]);
      }
    });

    if (isEditMode) {
      await updateProduct({ productId, formData });
    } else {
      await createProduct(formData);
    }
    navigate("/products");
  };

  if (isLoadingForm || isCreating || isUpdating) {
    return (
      <div className="flex justify-center items-center absolute inset-0 bg-white/80 z-50">
        <Spinner />
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ProductDetails
            register={register}
            errors={errors}
            control={control}
            setValue={setValue}
            getValues={getValues}
          />
        );
      case 2:
        return (
          <ProductPricing
            register={register}
            errors={errors}
            control={control}
          />
        );
      case 3:
        return (
          <ProductSpecifications
            register={register}
            errors={formState.errors}
            control={control}
            previewImageUrls={previewImageUrls}
            isEditMode={isEditMode}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="product-form-content">
      <h2 className="text-2xl text-[var(--color-primary)] font-semibold font-fraunces mb-6">
        {isEditMode ? "Edit Product" : "Create New Product"}
      </h2>
      <div className="inset-glow-border flex flex-col p-6 bg-white/80 shadow-lg rounded-lg">
        <MultiStepProgress currentStep={currentStep} steps={steps} />
        <form className="space-y-6">
          {renderStep()}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => prev - 1)}
              disabled={currentStep === 1}
              className="btn-primary px-6 py-2 text-lg gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft /> Back
            </button>
            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={handleNext}
                className="btn-primary px-6 py-2 text-lg gap-2"
              >
                Next <ChevronRight />
              </button>
            ) : (
              <button
                type="button"
                className="btn-primary px-6 py-2 text-lg"
                onClick={handleSubmit(onSubmit)}
                disabled={isCreating || isUpdating}
              >
                {isCreating || isUpdating
                  ? isEditMode
                    ? "Updating..."
                    : "Creating..."
                  : isEditMode
                  ? "Update Product"
                  : "Create Product"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
