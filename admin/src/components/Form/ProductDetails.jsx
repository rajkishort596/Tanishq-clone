import React, { useEffect } from "react";
import Input from "./Input/Input";
import Textarea from "./Textarea/Textarea";
import { useCategories } from "../../hooks/useCategories";
import { useCollections } from "../../hooks/useCollections";
import { useWatch } from "react-hook-form";

import CategorySelect from "./Select/CategorySelect";
import SubCategorySelect from "./Select/SubCategorySelect";
import CollectionsPills from "./CollectionsPills";
import OccasionInputSimple from "./Input/OccasionInput";

const ProductDetails = ({ register, errors, setValue, control }) => {
  const {
    categories = [],
    isLoading: isCategoryLoading,
    error: isCategoryError,
  } = useCategories({ limit: 100 });

  const {
    collections = [],
    isLoading: isCollectionLoading,
    error: isCollectionError,
  } = useCollections({ limit: Infinity });

  const selectedCategory = useWatch({ control, name: "category" });
  const occasions = useWatch({ control, name: "occasion" }) || [];
  const collectionsValue = useWatch({ control, name: "collections" }) || [];

  // Ensure occasion is array
  useEffect(() => {
    if (!Array.isArray(occasions)) setValue("occasion", []);
  }, [occasions, setValue]);

  return (
    <>
      <Input
        label="Product Name"
        id="name"
        type="text"
        placeholder="Enter product name"
        error={errors.name?.message}
        {...register("name", { required: "Product name is required." })}
      />

      <Textarea
        label="Description"
        id="description"
        placeholder="Enter product description"
        error={errors.description?.message}
        {...register("description", {
          required: "Description is required.",
        })}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
        <CategorySelect
          categories={categories}
          value={useWatch({ control, name: "category" })}
          onChange={(v) => {
            setValue("category", v, {
              shouldValidate: true,
              shouldDirty: true,
            });
            setValue("subCategory", "", {
              shouldValidate: true,
              shouldDirty: true,
            });
          }}
          error={errors.category?.message}
          {...register("category", { required: "Category name is required." })}
        />

        <SubCategorySelect
          categories={categories}
          selectedCategory={selectedCategory}
          value={useWatch({ control, name: "subCategory" })}
          onChange={(v) => setValue("subCategory", v)}
          error={errors.subCategory?.message}
          {...register("subCategory")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <CollectionsPills
          label="Collections"
          options={collections.map((c) => ({ label: c.name, value: c._id }))}
          value={collectionsValue}
          onChange={(v) =>
            setValue("collections", v, {
              shouldValidate: true,
              shouldDirty: true,
            })
          }
          error={errors.collections?.message}
        />

        <OccasionInputSimple
          value={occasions}
          onChange={(v) =>
            setValue("occasion", v, { shouldValidate: true, shouldDirty: true })
          }
          error={errors.occasion?.message}
        />
      </div>
    </>
  );
};

export default ProductDetails;
