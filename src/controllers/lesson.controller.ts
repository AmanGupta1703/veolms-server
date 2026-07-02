import { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler";
import { sendError, sendSuccess } from "../utils/apiResponse";
import Section from "../models/Section";
import Lesson from "../models/Lesson";

const createLesson = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, youtubeVideoId, order, section } = req.body;

    if (!title || !youtubeVideoId || !order || !section) {
      return sendError(res, 400, "All fields are required");
    }

    const existingSection = await Section.findById(section);

    if (!existingSection) {
      return sendError(res, 404, "No section found.");
    }

    const lesson = await Lesson.create({
      title,
      youtubeVideoId,
      order,
      section,
    });

    return sendSuccess(res, 201, "New lesson created successfully", { lesson });
  },
);

const updateLesson = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const updatedLesson = await Lesson.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedLesson) {
      return sendError(res, 404, "No lesson found");
    }

    return sendSuccess(res, 200, "Lesson updated successfully", {
      lesson: updatedLesson,
    });
  },
);

const deleteLesson = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const existingLesson = await Lesson.findByIdAndDelete(id);

    if (!existingLesson) {
      return sendError(res, 404, "No lesson found");
    }

    return sendSuccess(res, 200, "Lesson deleted successfully");
  },
);

const getLessonForStudent = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {},
);

export { createLesson, updateLesson, deleteLesson, getLessonForStudent };
