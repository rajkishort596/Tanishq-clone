import React from "react";
import { useFieldArray } from "react-hook-form";
import { PlusCircle, MinusCircle } from "lucide-react";
import Input from "./Input/Input";

const ProductPricing = ({ register, errors, control }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input
          label="Base Price (Rs)"
          id="price.base"
          type="number"
          step="0.01"
          placeholder="e.g. 1500.00"
          required
          error={errors.price?.base?.message}
          {...register("price.base", {
            required: "Base price is required.",
            valueAsNumber: true,
            min: { value: 0, message: "Price cannot be negative." },
          })}
        />
        <Input
          label="Making Charges (Rs)"
          id="price.makingCharges"
          type="number"
          step="0.01"
          placeholder="e.g. 200.00"
          error={errors.price?.makingCharges?.message}
          {...register("price.makingCharges", {
            valueAsNumber: true,
            min: { value: 0, message: "Making charges cannot be negative." },
          })}
        />
        <Input
          label="GST/Tax Rate (%)"
          id="price.gst"
          type="number"
          step="0.01"
          placeholder="e.g. 3"
          error={errors.price?.gst?.message}
          {...register("price.gst", {
            valueAsNumber: true,
            min: { value: 0, message: "GST rate cannot be negative." },
          })}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Stock Quantity"
          id="stock"
          type="number"
          placeholder="e.g. 100"
          error={errors.stock?.message}
          required
          {...register("stock", {
            required: "Stock quantity is required.",
            valueAsNumber: true,
            min: { value: 0, message: "Stock cannot be negative." },
          })}
        />
        <Input
          label="Weight (g)"
          id="weight"
          type="number"
          step="0.01"
          placeholder="e.g. 5.25"
          required
          error={errors.weight?.message}
          {...register("weight", {
            required: "Weight is required.",
            valueAsNumber: true,
            min: { value: 0.01, message: "Weight cannot be zero or negative." },
          })}
        />
      </div>
      <div className="border-t border-b border-gray-300 py-6 my-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-IBM-Plex text-black font-semibold">
            Product Variants
          </h4>
          <button
            type="button"
            onClick={() =>
              append({ size: "", metalColor: "", priceAdjustment: 0, stock: 0 })
            }
            className="flex items-center text-[var(--color-primary)] hover:underline text-sm"
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            Add Variant
          </button>
        </div>
        {fields.length > 0 && (
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2">
                <Input
                  label={`Size`}
                  id={`variants.${index}.size`}
                  type="text"
                  placeholder="e.g. Small"
                  error={errors.variants?.[index]?.size?.message}
                  {...register(`variants.${index}.size`, {
                    required: "Size is required.",
                  })}
                />
                <Input
                  label={`Metal Color`}
                  id={`variants.${index}.metalColor`}
                  type="text"
                  placeholder="e.g. White Gold"
                  error={errors.variants?.[index]?.metalColor?.message}
                  {...register(`variants.${index}.metalColor`, {
                    required: "Metal color is required.",
                  })}
                />
                <Input
                  label={`Price Adj. ($)`}
                  id={`variants.${index}.priceAdjustment`}
                  type="number"
                  step="0.01"
                  placeholder="e.g. 1200.00"
                  error={errors.variants?.[index]?.priceAdjustment?.message}
                  {...register(`variants.${index}.priceAdjustment`, {
                    required: "Price adjustment is required.",
                    valueAsNumber: true,
                    min: { value: 0, message: "Price cannot be negative." },
                  })}
                />
                <Input
                  label={`Stock`}
                  id={`variants.${index}.stock`}
                  type="number"
                  placeholder="e.g. 50"
                  error={errors.variants?.[index]?.stock?.message}
                  {...register(`variants.${index}.stock`, {
                    required: "Stock is required.",
                    valueAsNumber: true,
                    min: { value: 0, message: "Stock cannot be negative." },
                  })}
                />
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="mt-6 text-red-600 hover:text-red-800 transition"
                >
                  <MinusCircle className="h-6 w-6" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ProductPricing;
