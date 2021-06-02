const express = require("express");
const mongoose = require("mongoose");
const WebSocket = require("ws");

require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

// create app
const app = express();

// middleware imports
const handleErrors = require("./middleware/error");
const isAuthenticated = require("./middleware/isAuthenticated");

// configure middleware
app.use(express.json());

// route imports
const { UserRoutes, TweetRoutes } = require("./routes");

// routes setup
app.use(UserRoutes);
app.use("/tweet", isAuthenticated, TweetRoutes);

// custom error middleware
app.use(handleErrors);

// configure mongoose
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

// configure websockets
// use http server for webhook support
const server = require("http").Server(app);
const wss = new WebSocket.Server({ server });
require("./websocket")(wss);

server.listen(process.env.PORT, () => {
  console.log(
    `Server live on PORT ${process.env.PORT} in ${process.env.NODE_ENV} mode`
  );
});

module.exports = server;
