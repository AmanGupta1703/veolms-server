import { Request, Response, NextFunction } from "express";

import Course from "../models/Course";
import Section from "../models/Section";
import Lesson from "../models/Lesson";
import asyncHandler from "../utils/asyncHandler";
import { sendError, sendSuccess } from "../utils/apiResponse";

const getAllCourses = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { category, level, search } = req.query;

    const query: Record<string, unknown> = { isPublished: true };

    if (category) query.category = category;
    if (level) query.level = level;
    if (search) query.title = { $text: { $search: search } };

    const courses = await Course.find(query).populate(
      "instructor",
      "name avatar",
    );

    return sendSuccess(
      res,
      200,
      courses.length === 0
        ? "No courses found"
        : `${courses.length} course${courses.length === 1 ? "" : "s"} fetched successfully`,
      {
        courses,
      },
    );
  },
);

const getCourseBySlug = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { slug } = req.params;

    const course = await Course.findOne({ isPublished: true, slug }).populate(
      "instructor",
      "name avatar",
    );

    if (!course) {
      return sendError(res, 404, "Course not found");
    }

    return sendSuccess(res, 200, "Course fetched successfully", { course });
  },
);

const getCourseCurriculum = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // id : courseId
    const { id } = req.params;

    const sections = await Section.find({ course: id }).sort({ order: 1 });
    const lessons = await Lesson.find({
      section: { $in: sections.map((s) => s._id) },
    }).select("-youtubeVideoId");

    const curriculum = sections.map((section) => ({
      ...section.toObject(),
      lessons: lessons.filter(
        (lesson) => lesson.section.toString() === section._id.toString(),
      ),
    }));

    return sendSuccess(res, 200, "Curriculum fetched successfully", {
      curriculum,
    });
  },
);

// --- Admin Only Controllers ---
const createCourse = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      title,
      slug,
      description,
      thumbnail,
      price,
      level,
      category,
      language,
    } = req.body;

    if (!title || !description || !price || !level || !category) {
      return sendError(res, 400, "Required details are missing.");
    }

    const newCourse: Record<string, unknown> = {
      title,
      description,
      price,
      level,
      category,
      instructor: req?.user?._id,
    };

    if (slug) newCourse.slug = slug;
    if (thumbnail) newCourse.thumbnail = thumbnail;
    if (language) newCourse.language = language;

    const course = await Course.create(newCourse);

    return sendSuccess(res, 201, "New course created successfully", {
      course,
    });
  },
);

const updateCourse = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const updatedCourse = await Course.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedCourse) {
      return sendError(res, 404, "Course not found");
    }

    return sendSuccess(res, 200, "Course updated successfully", {
      course: updatedCourse,
    });
  },
);

const deleteCourse = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
      return sendError(res, 404, "Course not found");
    }

    const sections = await Section.find({ course: id });
    await Lesson.deleteMany({
      section: { $in: sections.map((section) => section._id) },
    });
    await Section.deleteMany({ course: id });
    await Course.findByIdAndDelete(id);

    return sendSuccess(res, 200, "Course deleted successfully");
  },
);

export {
  getAllCourses,
  getCourseBySlug,
  getCourseCurriculum,
  createCourse,
  updateCourse,
  deleteCourse,
};
