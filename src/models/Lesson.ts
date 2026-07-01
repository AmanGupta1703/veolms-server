import { Document, Schema, Types, model } from "mongoose";

export interface ILesson extends Document {
  title: string;
  youtubeVideoId: string;
  duration: number;
  isPreview: boolean;
  order: number;
  section: Types.ObjectId;
}

const lessonSchema = new Schema<ILesson>(
  {
    title: {
      type: String,
      required: true,
    },
    youtubeVideoId: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      default: 0,
    },
    isPreview: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      required: true,
    },
    section: {
      type: Types.ObjectId,
      ref: "Section",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Lesson = model<ILesson>("Lesson", lessonSchema);

export default Lesson;
