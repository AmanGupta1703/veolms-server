import { Document, Schema, model, Types } from "mongoose";

export interface IProgress extends Document {
  student: Types.ObjectId;
  course: Types.ObjectId;
  lesson: Types.ObjectId;
  isCompleted: boolean;
  watchedSeconds: number;
  lastWatchedAt: Date;
}

const progressSchema = new Schema<IProgress>(
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
    lesson: {
      type: Types.ObjectId,
      ref: "Lesson",
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    watchedSeconds: {
      type: Number,
      default: 0,
    },
    lastWatchedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

progressSchema.index({ student: 1, lesson: 1 }, { unique: true });

const Progress = model<IProgress>("Progress", progressSchema);

export default Progress;
