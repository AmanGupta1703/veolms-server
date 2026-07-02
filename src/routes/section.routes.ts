import { Router } from "express";
import {
  createSection,
  updateSection,
  deleteSection,
} from "../controllers/section.controller";
import { protect } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

router.post("/", protect, authorize("admin"), createSection);
router.put("/:id", protect, authorize("admin"), updateSection);
router.delete("/:id", protect, authorize("admin"), deleteSection);

export default router;
