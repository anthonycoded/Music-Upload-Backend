const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let trackSchema = new Schema(
  {
    id: {
      type: Number,
    },
    title: {
      type: String,
    },
    image: {
      type: String,
    },
    price: {
      type: Number,
    },
    url: {
      type: String,
    },
    plays: {
      type: Number,
    },
    likes: {
      type: Number,
    },
    created: {
      type: Number,
    },
    downloads: {
      type: Number,
    },
    tags: {
      type: String,
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    collection: "tracks",
  }
);
module.exports = mongoose.model("Track", trackSchema);
