// ProductSpecifications.jsx
import React, { useId } from "react";
import { ImagePlus } from "lucide-react";
import Select from "./Select/Select";
import Input from "./Input/Input";

const ProductSpecifications = ({
  register,
  errors,
  previewImageUrls = [],
  isEditMode = false,
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Metal"
          id="metal"
          {...register("metal", { required: "Metal is required." })}
          error={errors.metal?.message}
        >
          <option value="">-- Select Metal --</option>
          <option key={useId()} value="Gold">
            Gold
          </option>
          <option key={useId()} value="Diamond">
            Diamond
          </option>
          <option key={useId()} value="Platinum">
            Platinum
          </option>
        </Select>
        <Select
          label="Purity"
          id="purity"
          {...register("purity", { required: "Purity is required." })}
          error={errors.purity?.message}
        >
          <option value="">-- Select Purity --</option>
          <option key={useId()} value="18K">
            18K
          </option>
          <option key={useId()} value="22K">
            22K
          </option>
        </Select>
      </div>
      <Select
        label="Gender"
        id="gender"
        {...register("gender", { required: "Gender is required." })}
        error={errors.gender?.message}
      >
        <option value="">-- Select Gender --</option>
        <option key={useId()} value="women">
          Women
        </option>
        <option key={useId()} value="men">
          Men
        </option>
        <option key={useId()} value="kids">
          Kids
        </option>
        <option key={useId()} value="unisex">
          Unisex
        </option>
      </Select>

      {/* Image Uploadation and preview for up to 4 images */}
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
              if (isEditMode && previewImageUrls && previewImageUrls.length > 0)
                return true;
              if (value && value.length > 0 && value[0] instanceof File)
                return true;
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
          <p className="mt-1 text-sm text-red-600">{errors.images?.message}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          You can select multiple images at once; they will populate the slots
          in order. To replace, re-upload.
        </p>
      </div>

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
