import React, { useMemo } from "react";
import { useWatch } from "react-hook-form";
import { ImagePlus } from "lucide-react";
import Select from "./Select/Select";
import Input from "./Input/Input";

const ProductSpecifications = ({
  register,
  errors,
  control,
  previewImageUrls = [],
  isEditMode = false,
}) => {
  const metal = useWatch({ control, name: "metal" });

  const purityOptions = useMemo(() => {
    switch ((metal || "").toLowerCase()) {
      case "gold":
        return ["18K", "22K"];
      case "platinum":
        return ["PT999", "PT950", "PT900", "PT850"];
      default:
        return [];
    }
  }, [metal]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Metal Select */}
        <Select
          label="Metal"
          id="metal"
          {...register("metal", { required: "Metal is required." })}
          error={errors.metal?.message}
        >
          <option value="">-- Select Metal --</option>
          <option value="Gold">Gold</option>
          <option value="Platinum">Platinum</option>
        </Select>

        {/* Purity Select */}
        <Select
          label="Purity"
          id="purity"
          {...register("purity", { required: "Purity is required." })}
          error={errors.purity?.message}
        >
          <option value="">-- Select Purity --</option>
          {purityOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gender Select */}
        <Select
          label="Gender"
          id="gender"
          {...register("gender", { required: "Gender is required." })}
          error={errors.gender?.message}
        >
          <option value="">-- Select Gender --</option>
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kids">Kids</option>
          <option value="unisex">Unisex</option>
        </Select>

        {/* MetalColor Select */}
        <Select
          label="Metal Colour"
          id="metalColor"
          {...register("metalColor", { required: "Metal Colour is required." })}
          error={errors.metalColor?.message}
        >
          <option value="">-- Select Metal Colour --</option>
          <option value="Yellow">Yellow</option>
          <option value="White">White</option>
          <option value="White Gold">White Gold</option>
          <option value="Rose Gold">Rose Gold</option>
          <option value="White and Rose">White and Rose</option>
        </Select>
      </div>
      {/* Image Upload */}
      <div>
        <label
          htmlFor="images"
          className="block font-IBM-Plex text-black text-sm mb-2"
        >
          Product Images (up to 4){" "}
          <span className="text-xs text-gray-500">(first image is main)</span>
        </label>
        <input
          type="file"
          id="images"
          {...register("images", {
            validate: (value) => {
              if (isEditMode && previewImageUrls?.length > 0) return true;
              if (value?.length > 0 && value[0] instanceof File) return true;
              return "At least one product image is required.";
            },
          })}
          accept="image/*"
          multiple
          className="hidden"
          onClick={(e) => {
            e.target.value = null;
          }}
        />

        <div className="flex gap-3">
          {[0, 1, 2, 3].map((idx) => (
            <label
              key={idx}
              htmlFor="images"
              className="cursor-pointer flex flex-col items-center justify-center w-32 aspect-square border-2 border-dashed border-gray-300 rounded hover:border-primary transition relative overflow-hidden"
            >
              {previewImageUrls[idx] ? (
                <img
                  src={previewImageUrls[idx]}
                  alt={`Preview ${idx + 1}`}
                  className="w-32 h-32 object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <ImagePlus className="h-5 w-5 mb-1" />
                  <span className="text-xs">Upload</span>
                </div>
              )}
              {idx === 0 && (
                <div className="absolute top-1 left-1 bg-[var(--color-primary)] text-white px-1 text-[10px] rounded">
                  Main
                </div>
              )}
            </label>
          ))}
        </div>

        {errors.images && (
          <p className="mt-1 text-sm text-red-600">{errors.images.message}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          You can select multiple images at once; they will populate the slots
          in order. To replace, re-upload.
        </p>
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
    </>
  );
};

export default ProductSpecifications;
