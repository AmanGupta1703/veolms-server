import { Document, Schema, model, Types } from "mongoose";

export interface IEnrollment extends Document {
  student: Types.ObjectId;
  course: Types.ObjectId;
  status: "active" | "cancelled";
  enrolledAt: Date;
}

const enrollmentSchema = new Schema<IEnrollment>(
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
    status: {
      type: String,
      enum: ["active", "cancelled"],
      default: "active",
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

const Enrollment = model<IEnrollment>("Enrollment", enrollmentSchema);

export default Enrollment;
