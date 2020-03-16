import mongoose, { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";

export const UserSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    bookmarks: {
      type: [{ type: Schema.Types.ObjectId, ref: "Bookmark" }]
    }
  },
  {
    collection: "users"
  }
);

UserSchema.plugin(timestamps);

UserSchema.index({ createdAt: true, updatedAt: true });

export const User = mongoose.model("User", UserSchema);
