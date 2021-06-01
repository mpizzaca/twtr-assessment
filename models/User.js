const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    index: {
      unique: true,
      collation: { locale: "en", strength: 2 },
    },
  },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
