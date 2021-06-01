const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

// configure mongoose
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const app = express();

app.listen(process.env.PORT, () => {
  console.log(`Server live on PORT ${process.env.PORT}`);
});
