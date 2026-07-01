import { Document, Schema, Types, model } from "mongoose";

export interface ISection extends Document {
  title: string;
  order: number;
  course: Types.ObjectId;
}

const sectionSchema = new Schema<ISection>(
  {
    title: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
    course: {
      type: Types.ObjectId,
      ref: "Course",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Section = model<ISection>("Section", sectionSchema);

export default Section;
