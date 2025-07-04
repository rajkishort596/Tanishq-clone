import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  completeUserRegistration,
  registerUser,
  verifyUserOTP,
} from "../controllers/user.controller.js";
const router = Router();

router.route("/register").post(registerUser);

router.route("/register/verify-otp").post(verifyUserOTP);
router
  .route("/register/complete")
  .post(upload.single("avatar"), completeUserRegistration);

export default router;
