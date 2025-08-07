import axios from "axios";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

const METAL_API_URL = process.env.METAL_API_URL;
const METAL_API_KEY = process.env.METAL_API_KEY;

let rateCache = {
  Gold: { pricePerGram: null, timestamp: null },
  Platinum: { pricePerGram: null, timestamp: null },
};

const CACHE_LIFETIME_SECONDS = 600;

const fetchAndCacheRate = async (metal) => {
  const currentTime = Date.now();
  const cache = rateCache[metal];

  if (
    cache.pricePerGram &&
    currentTime - cache.timestamp < CACHE_LIFETIME_SECONDS * 1000
  ) {
    return cache.pricePerGram;
  }

  if (!METAL_API_URL || !METAL_API_KEY) {
    throw new ApiError(500, "Metal rate API URL or key not configured.");
  }

  const currencyCode = metal === "Gold" ? "XAU" : "XPT"; // XAU = gold, XPT = platinum

  try {
    const response = await axios.get(METAL_API_URL, {
      params: {
        api_key: METAL_API_KEY,
        base: "INR",
        currencies: currencyCode,
      },
    });

    const { success, rates } = response.data;
    const rate = rates[`INR${currencyCode}`];
    if (!success || !rate) {
      throw new Error("Invalid rate data from API.");
    }

    const pricePerGram = rate / 31.1035;
    rateCache[metal] = { pricePerGram, timestamp: currentTime };

    return pricePerGram;
  } catch (err) {
    console.error(`Error fetching ${metal} rate:`, err.message);
    throw new ApiError(500, `Could not fetch live ${metal} rate.`);
  }
};

const getMetalRateInGrams = async (metal) => {
  if (!["Gold", "Platinum"].includes(metal)) {
    throw new ApiError(400, "Invalid metal type.");
  }
  return await fetchAndCacheRate(metal);
};

const getLatestMetalRate = asyncHandler(async (req, res) => {
  const { metal } = req.query; // ?metal=Gold or ?metal=Platinum
  const rate = await getMetalRateInGrams(metal);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        ratePerGram: rate.toFixed(2),
        ratePer10Grams: (rate * 10).toFixed(2),
      },
      `Live ${metal} rate fetched successfully.`
    )
  );
});

export { getMetalRateInGrams, getLatestMetalRate };
