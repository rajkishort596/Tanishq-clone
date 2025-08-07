import { getMetalRateInGrams } from "../controllers/public/metalRate.public.controller.js";
import { ApiError } from "./ApiError.js";

const calculateFinalPrice = async (productData) => {
  const {
    weight,
    purity,
    metal = "gold", // default to gold
    price: { makingCharges, gst },
  } = productData;

  const ratePerGram = await getMetalRateInGrams(metal);

  let purityFactor = 1;
  if (metal === "Gold") {
    const purityInKarat = parseFloat(purity?.replace("K", ""));
    if (isNaN(purityInKarat) || purityInKarat === 0) {
      throw new ApiError(400, "Invalid gold purity value.");
    }
    purityFactor = purityInKarat / 24;
  }

  const basePrice = ratePerGram * weight * purityFactor;
  const taxableValue = basePrice + (makingCharges || 0);
  const gstAmount = taxableValue * (gst / 100 || 0.03);
  const finalPrice = basePrice + (makingCharges || 0) + gstAmount;

  return {
    base: parseFloat(basePrice.toFixed(2)),
    makingCharges: parseFloat((makingCharges || 0).toFixed(2)),
    gstAmount: parseFloat(gstAmount).toFixed(2),
    final: parseFloat(finalPrice).toFixed(2),
  };
};

export { calculateFinalPrice };
