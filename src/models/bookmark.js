import mongoose, { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";

export const BookmarkSchema = new Schema(
  {
    link: {
      type: Schema.Types.ObjectId,
      ref: "Link",
      required: true
    },
    title: {
      type: String,
      trim: true,
      required: true
    },
    description: {
      type: String,
      trim: true
    },
    tags: {
      type: [String]
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    collection: "bookmarks"
  }
);

BookmarkSchema.plugin(timestamps);

BookmarkSchema.index({ createdAt: true, updatedAt: true });

export const Bookmark = mongoose.model("Bookmark", BookmarkSchema);
