import { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler";
import { sendError, sendSuccess } from "../utils/apiResponse";
import Course from "../models/Course";
import Section from "../models/Section";
import Lesson from "../models/Lesson";

const createSection = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, order, course } = req.body;

    if (!title || !order || !course) {
      return sendError(res, 400, "All fields are required");
    }

    const existingCourse = await Course.findById(course);

    if (!existingCourse) {
      return sendError(res, 404, "No course found.");
    }

    const section = await Section.create({ title, order, course });

    return sendSuccess(res, 201, "New section created successfully", {
      section,
    });
  },
);

const updateSection = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const updatedSection = await Section.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedSection) {
      return sendError(res, 404, "Section not found");
    }

    return sendSuccess(res, 200, "Section updated successfully", {
      section: updatedSection,
    });
  },
);

const deleteSection = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const section = await Section.findById(id);

    if (!section) {
      return sendError(res, 404, "Section not found");
    }

    await Lesson.deleteMany({ section: section._id });
    await section.deleteOne();

    return sendSuccess(res, 200, "Section deleted successfully");
  },
);

export { createSection, updateSection, deleteSection };
