import { Schema, model, Types } from "mongoose";

const UserSearchHistorySchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "users",
      required: true
    },
    query: {
      city: { type: String, required: true },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    },
    searchedAt: {
      type: Date,
      default: Date.now,
      required: true
    }
  },
  { timestamps: false } // Usamos o searchedAt como controle
);

// TTL Index: Expira em aproximadamente 180 dias (15552000 segundos)
UserSearchHistorySchema.index({ searchedAt: 1 }, { expireAfterSeconds: 15552000 });

export default model("user_search_history", UserSearchHistorySchema);