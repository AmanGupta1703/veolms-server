import { Router } from "express";

import {
  register,
  login,
  logout,
  refreshAccessToken,
} from "../controllers/auth.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", protect, logout);
router.post("/refresh-token", refreshAccessToken);

export default router;
