import axios from "axios";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

const GOLD_API_URL = process.env.GOLD_API_URL;
const GOLD_API_KEY = process.env.GOLD_API_KEY;

let goldRateCache = {
  pricePerGram: null,
  timestamp: null,
};

const CACHE_LIFETIME_SECONDS = 600; // Cache for 10 minutes

/**
 * @desc Internal helper function to fetch gold rate from API and cache it.
 * @returns {number} The price of gold per gram.
 */
const fetchAndCacheGoldRate = async () => {
  // Check cache validity first
  const currentTime = Date.now();
  if (
    goldRateCache.pricePerGram &&
    currentTime - goldRateCache.timestamp < CACHE_LIFETIME_SECONDS * 1000
  ) {
    return goldRateCache.pricePerGram;
  }

  if (!GOLD_API_URL || !GOLD_API_KEY) {
    throw new ApiError(500, "Gold rate API URL or API key is not configured.");
  }

  try {
    const response = await axios.get(GOLD_API_URL, {
      params: {
        api_key: GOLD_API_KEY,
        base: "INR",
        currencies: "XAU",
      },
    });

    const { success, rates } = response.data;
    if (!success || !rates || !rates.INRXAU) {
      throw new Error(
        "Failed to retrieve gold rate. Response format was invalid."
      );
    }

    const pricePerOunce = rates.INRXAU;
    const pricePerGram = pricePerOunce / 31.1035;

    // Update the cache
    goldRateCache.pricePerGram = pricePerGram;
    goldRateCache.timestamp = currentTime;

    return pricePerGram;
  } catch (error) {
    console.error("Error fetching gold rate:", error.message);
    throw new ApiError(500, "Could not fetch live gold rate.");
  }
};

/**
 * @desc Fetch and return the latest Indian gold rate for a public API endpoint.
 * @route GET /api/v1/public/gold-rate
 * @access Public
 */
const getLatestIndianGoldRate = asyncHandler(async (req, res) => {
  // This function can now simply call the internal helper
  const pricePerGram = await fetchAndCacheGoldRate();

  const pricePer10Grams = (pricePerGram * 10).toFixed(2);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        ratePerGram: pricePerGram.toFixed(2),
        ratePer10Grams: pricePer10Grams,
      },
      "Live gold rate fetched successfully."
    )
  );
});

export { getLatestIndianGoldRate, fetchAndCacheGoldRate as getGoldRateInGrams };
