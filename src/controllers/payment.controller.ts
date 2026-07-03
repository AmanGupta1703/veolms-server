import { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler";
import { sendError, sendSuccess } from "../utils/apiResponse";
import Course from "../models/Course";
import Enrollment from "../models/Enrollment";
import razorpay from "../config/razorpay";
import Payment from "../models/Payment";
import { verifyRazorpaySignature } from "../utils/razorpayVerify";

const createOrder = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { courseId } = req.body;

    if (!courseId) {
      return sendError(res, 400, "All fields are required.");
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return sendError(res, 404, "Course not found.");
    }

    const user = req?.user;

    const isStudentEnrolled = await Enrollment.findOne({
      student: user?._id,
      course: courseId,
    });

    if (isStudentEnrolled) {
      return sendError(res, 400, "Already enrolled.");
    }

    const {
      id: razorpayOrderId,
      amount,
      currency,
    } = await razorpay.orders.create({
      amount: course.price * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    await Payment.create({
      student: user?._id,
      course: courseId,
      amount: course.price * 100,
      currency: "INR",
      razorpayOrderId,
      status: "pending",
    });

    return sendSuccess(res, 201, "Order created successfully", {
      amount,
      orderId: razorpayOrderId,
      currency,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    });
  },
);

const verifyPayment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const isExpectedSignature = verifyRazorpaySignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    );

    if (!isExpectedSignature) {
      return sendError(res, 400, "Payment verification failed.");
    }

    const paymentRecord = await Payment.findOne({
      razorpayOrderId,
      student: req?.user?._id,
    });

    if (!paymentRecord) {
      return sendError(res, 404, "No payment record found.");
    }

    if (paymentRecord.status === "completed") {
      return sendError(res, 400, "Payment already verified.");
    }

    const createdEnrollment = await Enrollment.create({
      student: req?.user?._id,
      course: paymentRecord.course,
    });

    paymentRecord.status = "completed";
    paymentRecord.razorpayPaymentId = razorpayPaymentId;
    paymentRecord.razorpaySignature = razorpaySignature;
    paymentRecord.enrollment = createdEnrollment._id;
    paymentRecord.paidAt = new Date();
    await paymentRecord.save();

    return sendSuccess(res, 200, "New enrollment created successfully", {
      enrollment: createdEnrollment,
    });
  },
);

export { createOrder, verifyPayment };
