// Import the new function from the public controller
import { getGoldRateInGrams } from "../controllers/public/goldRate.public.controller.js";
import { ApiError } from "./ApiError.js";

/**
 * Calculates the final product price based on a standard jewelry pricing formula.
 * @param {object} productData - Contains product weight, making charges, and other details.
 * @param {string} productData.purity - The purity of the gold, e.g., "22K".
 * @param {number} productData.weight - The weight of the product in grams.
 * @param {object} productData.price - The price object containing making charges and GST.
 * @param {number} productData.price.makingCharges - The making charges for the product.
 * @param {number} productData.price.gst - The GST percentage for the product.
 * @returns {object} - An object containing the calculated base and final prices.
 */
const calculateFinalPrice = async (productData) => {
  const {
    weight,
    purity,
    price: { makingCharges, gst },
  } = productData;

  // 1. Get the live gold rate per gram
  const ratePerGram = await getGoldRateInGrams();

  // 2. Determine purity factor (e.g., 22K/24K)
  const purityInKarat = parseFloat(purity.replace("K", ""));
  if (isNaN(purityInKarat) || purityInKarat === 0) {
    throw new ApiError(
      400,
      "Invalid purity value. Must be a number followed by 'K'."
    );
  }
  const purityFactor = purityInKarat / 24;

  // 3. Calculate the base price of the gold in the product
  const basePrice = ratePerGram * weight * purityFactor;

  // 4. Calculate GST
  const gstRate = gst / 100 || 0.03;

  const taxableValue = basePrice + (makingCharges || 0);
  const gstAmount = taxableValue * gstRate;
  // 5. Calculate the final price
  const finalPrice = basePrice + (makingCharges || 0) + gstAmount;

  return {
    base: parseFloat(basePrice.toFixed(2)),
    makingCharges: parseFloat((makingCharges || 0).toFixed(2)),
    gstAmount: parseFloat(gstAmount).toFixed(2),
    final: parseFloat(finalPrice).toFixed(2),
  };
};

export { calculateFinalPrice };
