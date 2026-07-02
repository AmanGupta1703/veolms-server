import { Document, Schema, Types, model } from "mongoose";

export interface ICourse extends Document {
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  price: number;
  level: "beginner" | "intermediate" | "advanced";
  category: string;
  language: string;
  isPublished: boolean;
  instructor: Types.ObjectId;
  totalDuration: number;
}

const courseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
    },
    category: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      default: "English",
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    instructor: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalDuration: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

courseSchema.index({ title: "text", description: "text" });

courseSchema.pre("save", function () {
  if (!this.isModified("title")) return;
  const base = this.title.toLowerCase().replace(/\s+/g, "-");
  this.slug = `${base}-${Date.now()}`;
});

const Course = model<ICourse>("Course", courseSchema);

export default Course;
