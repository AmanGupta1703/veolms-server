import { Router } from "express";
import {
  getAllCourses,
  getCourseBySlug,
  getCourseCurriculum,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/course.controller";
import { protect } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

router.get("/", getAllCourses);
router.get("/:slug", getCourseBySlug);
router.get("/:id/curriculum", getCourseCurriculum);
router.post("/", protect, authorize("admin"), createCourse);
router.put("/:id", protect, authorize("admin"), updateCourse);
router.delete("/:id", protect, authorize("admin"), deleteCourse);

export default router;
