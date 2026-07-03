import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import Enrollment from "../models/Enrollment";
import asyncHandler from "../utils/asyncHandler";
import { sendSuccess } from "../utils/apiResponse";

const router = Router();

router.get(
  "/my-courses",
  protect,
  asyncHandler(async (req, res) => {
    const enrollments = await Enrollment.find({
      student: req.user!._id,
    }).populate(
      "course",
      "title thumbnail price level category instructor totalDuration slug",
    );

    return sendSuccess(res, 200, "Enrollments fetched successfully", {
      enrollments,
    });
  }),
);

router.get(
  "/:courseId/check",
  protect,
  asyncHandler(async (req, res) => {
    const enrollment = await Enrollment.findOne({
      student: req.user!._id,
      course: req.params.courseId,
    });

    return sendSuccess(res, 200, "Enrollment status fetched", {
      isEnrolled: !!enrollment,
    });
  }),
);

export default router;
