import mongoose, { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";

// "links" es la coleccion donde se guardan todas las URLs a videos,
// para evitar repetir links a mismos videos

export const LinkSchema = new Schema(
  {
    // uri de la web donde se muestra el video
    uri: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      required: true
    },
    // acá se van a guardar los links a videos .mp4, etc.
    videoResources: [String]
  },
  {
    collection: "links"
  }
);

LinkSchema.plugin(timestamps);

LinkSchema.index({ createdAt: true, updatedAt: true });

export const Link = mongoose.model("Link", LinkSchema);
