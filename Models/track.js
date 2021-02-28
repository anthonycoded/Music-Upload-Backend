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
    genre: {
      type: String,
    },
    image: {
      type: String,
    },
    price: {
      type: Number,
    },
    url: {
      type: Array,
    },
    plays: {
      type: Number,
    },
    likes: {
      type: Number,
    },
    downloads: {
      type: Number,
    },
    tags: {
        type: String
    }
  },
  {
    collection: "tracks",
  }
);
module.exports = mongoose.model("Track", trackSchema);
