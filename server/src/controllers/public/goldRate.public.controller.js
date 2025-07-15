import axios from "axios";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

const GOLD_API_URL = process.env.GOLD_API_URL;
const GOLD_API_KEY = process.env.GOLD_API_KEY;

let goldRateCache = {
  price: null,
  timestamp: null,
};

const CACHE_LIFETIME_SECONDS = 600; // Cache for 10 minutes

/**
 * @desc Fetch and return the latest Indian gold rate
 * @route GET /api/v1/public/gold-rate
 * @access Public
 */
const getLatestIndianGoldRate = asyncHandler(async (req, res) => {
  const currentTime = Date.now();
  if (
    goldRateCache.price &&
    currentTime - goldRateCache.timestamp < CACHE_LIFETIME_SECONDS * 1000
  ) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          goldRateCache.price,
          "Gold rate fetched from cache successfully."
        )
      );
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
      throw new ApiError(
        500,
        "Failed to retrieve gold rate. Response format was invalid."
      );
    }

    // The API returns the price per Troy ounce (31.1035 grams)
    const pricePerOunce = rates.INRXAU;

    // Convert the price to a more standard per-gram rate for Indian markets
    const pricePerGram = (pricePerOunce / 31.1035).toFixed(2);

    // Update the cache with the fetched rate
    goldRateCache.price = pricePerGram;
    goldRateCache.timestamp = currentTime;

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          ratePerOunce: pricePerOunce,
          ratePer10Grams: pricePerGram,
        },
        "Live gold rate fetched successfully."
      )
    );
  } catch (error) {
    console.error("Error fetching gold rate:", error.message);
    throw new ApiError(
      500,
      "Could not fetch live gold rate. Please ensure your API key and URL are correct."
    );
  }
});

export { getLatestIndianGoldRate };
