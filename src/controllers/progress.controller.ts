import { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler";
import Progress from "../models/Progress";
import { sendSuccess } from "../utils/apiResponse";

const updateProgress = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { courseId, lessonId, watchedSeconds } = req.body;

    const progress = await Progress.findOneAndUpdate(
      {
        student: req!.user!._id,
        lesson: lessonId,
        course: courseId,
      },
      { watchedSeconds, lastWatchedAt: new Date() },
      {
        new: true,
        upsert: true,
      },
    );

    return sendSuccess(res, 200, "Lesson progress updated successfully", {
      progress,
    });
  },
);

const markLessonComplete = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { lessonId, courseId } = req.body;

    const progress = await Progress.findOneAndUpdate(
      {
        student: req!.user!._id,
        course: courseId,
        lesson: lessonId,
      },
      {
        isCompleted: true,
      },
      {
        new: true,
        upsert: true,
      },
    );

    return sendSuccess(res, 200, "Lesson marked state updated successfully", {
      isCompleted: progress.isCompleted,
    });
  },
);

const getCourseProgress = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { courseId } = req.params;

    const progress = await Progress.find({
      course: courseId,
      student: req!.user!._id,
    });

    return sendSuccess(
      res,
      200,
      "All progress documents fetched successfully",
      {
        progress,
      },
    );
  },
);

const getRecentlyWatched = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const recentlyWatchedLessons = await Progress.find({
      student: req!.user!._id,
    })
      .populate("lesson", "title duration")
      .populate("course", "title thumbnail")
      .sort({ lastWatchedAt: -1 })
      .limit(5);

    return sendSuccess(
      res,
      200,
      "Recently watched lesson fetched successfully",
      { lessons: recentlyWatchedLessons },
    );
  },
);

export {
  updateProgress,
  markLessonComplete,
  getCourseProgress,
  getRecentlyWatched,
};
