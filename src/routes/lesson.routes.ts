import { Router } from "express";
import {
  createLesson,
  updateLesson,
  deleteLesson,
  getLessonForStudent,
} from "../controllers/lesson.controller";
import { protect } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

router.get("/:id/watch", protect, getLessonForStudent);
router.post("/", protect, authorize("admin"), createLesson);
router.put("/:id", protect, authorize("admin"), updateLesson);
router.delete("/:id", protect, authorize("admin"), deleteLesson);

export default router;
