import cron from "node-cron";
import { Product } from "../models/product.model.js";
import { calculateFinalPrice } from "../utils/priceCalculator.js";
import { sendEmail } from "../utils/sendEmail.js";

const updateAllProductPrices = async () => {
  console.log("Starting a scheduled job to update product prices...");

  try {
    const products = await Product.find({ isActive: true });

    if (!products || products.length === 0) {
      console.log("No active products to update.");
      return;
    }

    const bulkOperations = [];
    for (const product of products) {
      const { weight, purity, price } = product;

      // Recalculate price only if necessary fields are present
      if (weight && purity && price?.makingCharges) {
        try {
          const calculatedPrice = await calculateFinalPrice({
            weight,
            purity,
            price: { makingCharges: price.makingCharges, gst: price.gst },
          });

          // Add an updateOne operation to the bulkOperations array
          bulkOperations.push({
            updateOne: {
              filter: { _id: product._id },
              update: {
                $set: {
                  "price.base": calculatedPrice.base,
                  "price.gstAmount": calculatedPrice.gstAmount,
                  "price.final": calculatedPrice.final,
                },
              },
            },
          });
        } catch (error) {
          console.error(
            `Error calculating price for product ${product.name} (${product._id}):`,
            error.message
          );
        }
      }
    }

    if (bulkOperations.length > 0) {
      // Execute all collected update operations in a single bulk write
      const result = await Product.bulkWrite(bulkOperations);
      console.log(`Successfully completed bulk price update.`);
      console.log(
        `Matched ${result.matchedCount} documents, modified ${result.modifiedCount} documents.`
      );
    } else {
      console.log("No product prices required updates in this run.");
    }
  } catch (error) {
    console.error("Failed to run product price update job:", error.message);
    // In a production app, you might use a dedicated logging service or alert system here.
    await sendEmail(
      "codewithraj596@gmail.com",
      "Product Price Update Job Failed",
      `<h2>Failed to run product price update job</h2>
            <p><strong>Error:</strong> ${error.message}</p>
            <pre><strong>Stack Trace:</strong>\n${error.stack}</pre>`
    );
  }
};

const startPriceUpdater = () => {
  // Current setting: "0 * * * *" means "at minute 0 past every hour."
  cron.schedule("0 * * * *", () => {
    updateAllProductPrices();
  });

  // Run once immediately on startup
  updateAllProductPrices();
};

export { startPriceUpdater };
