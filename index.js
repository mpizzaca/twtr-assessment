const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

// create app
const app = express();

// middleware imports
const handleErrors = require("./middleware/error");

// configure middleware
app.use(express.json());

// route imports
const { UserRoutes } = require("./routes");

// routes setup
app.use(UserRoutes);

// custom error middleware (must be last)
app.use(handleErrors);

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

module.exports = app;
