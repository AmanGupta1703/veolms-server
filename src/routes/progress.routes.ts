import { Router } from "express";
import {
  updateProgress,
  markLessonComplete,
  getCourseProgress,
  getRecentlyWatched,
} from "../controllers/progress.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.get("/recent", protect, getRecentlyWatched);
router.get("/:courseId", protect, getCourseProgress);
router.post("/update", protect, updateProgress);
router.post("/complete", protect, markLessonComplete);

export default router;
