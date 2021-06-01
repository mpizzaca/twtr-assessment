const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

// create app
const app = express();

// middleware imports
const { UserRoutes } = require("./routes");

// middleware setup
app.use(UserRoutes);

// configure mongoose
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

app.listen(process.env.PORT, () => {
  console.log(`Server live on PORT ${process.env.PORT}`);
});
