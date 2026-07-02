import { Document, Schema, model, Types } from "mongoose";

export interface IPayment extends Document {
  student: Types.ObjectId;
  course: Types.ObjectId;
  enrollment: Types.ObjectId;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed";
  paidAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    student: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: Types.ObjectId,
      ref: "Course",
      required: true,
    },
    enrollment: {
      type: Types.ObjectId,
      ref: "Enrollment",
    },
    razorpayOrderId: {
      type: String,
      required: true,
    },
    razorpayPaymentId: {
      type: String,
    },
    razorpaySignature: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    paidAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

const Payment = model<IPayment>("Payment", paymentSchema);

export default Payment;
