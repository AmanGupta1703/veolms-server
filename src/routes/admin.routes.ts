import { Router } from "express";
import {
  getStats,
  getAllStudents,
  getAllEnrollments,
  deleteStudent,
} from "../controllers/admin.controller";
import { protect } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

router.use(protect, authorize("admin"));

router.get("/stats", getStats);
router.get("/students", getAllStudents);
router.get("/enrollments", getAllEnrollments);
router.delete("/students/:id", deleteStudent);

export default router;
