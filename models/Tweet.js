const mongoose = require("mongoose");
const { Schema } = mongoose;

const tweetSchema = new Schema({
  author: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
  },
  likes: {
    type: [String],
  },
  retweet: {
    type: String,
  },
});

const Tweet = mongoose.model("Tweet", tweetSchema);

module.exports = Tweet;
