const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSchema = new Schema(
  {
    id: {
      type: Number,
    },
    username: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: Number,
    },
    tracks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Track",
      },
    ],
  },
  {
    collection: "users",
  }
);
module.exports = mongoose.model("User", userSchema);
