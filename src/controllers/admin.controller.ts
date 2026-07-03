import { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler";
import User from "../models/User";
import Course from "../models/Course";
import Enrollment from "../models/Enrollment";
import Payment from "../models/Payment";
import { sendSuccess } from "../utils/apiResponse";

const getStats = asyncHandler(async (req: Request, res: Response) => {
  const [students, courses, enrollments, revenueResult] = await Promise.all([
    User.countDocuments({ role: "student" }),
    Course.countDocuments(),
    Enrollment.countDocuments(),
    Payment.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
  ]);

  const totalRevenue = revenueResult[0]?.total ?? 0;

  return sendSuccess(res, 200, "All stats fetched successfully.", {
    students,
    courses,
    enrollments,
    totalRevenue,
  });
});

const getAllStudents = asyncHandler(async (req: Request, res: Response) => {
  const students = await User.find({ role: "student" }).select("-password");

  return sendSuccess(res, 200, "All students fetched successfully", {
    students,
  });
});

const getAllEnrollments = asyncHandler(async (req: Request, res: Response) => {
  const enrollments = await Enrollment.find()
    .populate("student", "name email")
    .populate("course", "title");

  return sendSuccess(res, 200, "All enrollments fetched successfully.", {
    enrollments,
  });
});

const deleteStudent = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  await User.findByIdAndDelete(id);

  return sendSuccess(res, 200, "User deleted successfully");
});

export { getStats, getAllStudents, getAllEnrollments, deleteStudent };
