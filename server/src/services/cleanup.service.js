import cron from "node-cron";
import { User } from "../models/user.model.js";
import { sendEmail } from "../utils/sendEmail.js";

const removeUnverifiedUsers = async () => {
  console.log("Starting scheduled job to remove unverified users...");

  try {
    // Delete only users whose accounts are unverified and created more than 24 hours ago
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const result = await User.deleteMany({
      verified: false,
      createdAt: { $lt: cutoff },
    });

    if (result.deletedCount > 0) {
      console.log(`[CLEANUP] Removed ${result.deletedCount} unverified users.`);
    } else {
      console.log("[CLEANUP] No unverified users found for deletion.");
    }
  } catch (error) {
    console.error(
      "[CLEANUP] Failed to run unverified user cleanup job:",
      error.message
    );

    // Notify admin in case of error
    await sendEmail(
      "codewithraj596@gmail.com",
      "Unverified User Cleanup Job Failed",
      `<h2>Unverified User Cleanup Job Failed</h2>
       <p><strong>Error:</strong> ${error.message}</p>
       <pre><strong>Stack Trace:</strong>\n${error.stack}</pre>`
    );
  }
};

const startUserCleanup = () => {
  // Runs daily at 2 AM (server time)
  cron.schedule("0 2 * * *", () => {
    removeUnverifiedUsers();
  });

  // Run once immediately on startup
  removeUnverifiedUsers();
};

export { startUserCleanup };
