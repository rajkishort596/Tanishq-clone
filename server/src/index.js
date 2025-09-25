import "dotenv/config";
import { app } from "./app.js";
import connectDB from "./db/index.js";
import { startPriceUpdater } from "./services/priceUpdate.service.js";
import { startUserCleanup } from "./services/cleanup.service.js";

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️ Server is running on port : ${process.env.PORT}`);
      // Start the scheduled price updater worker
      startPriceUpdater();
      startUserCleanup();
    });
  })
  .catch((err) => {
    console.log("MONGO DB connection failed !!! ", err);
  });
