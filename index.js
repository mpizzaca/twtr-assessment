const express = require("express");
const mongoose = require("mongoose");
const WebSocket = require("ws");

// configure environment variables
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
app.use("/tweets", isAuthenticated, TweetRoutes);

// custom error middleware
app.use(handleErrors);

// configure mongoose
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

// configure websockets for chat - use http server for websocket support
const server = require("http").Server(app);
const wss = new WebSocket.Server({ server });
require("./websocket")(wss);

// run the server
server.listen(process.env.PORT, () => {
  console.log(
    `Server live on PORT ${process.env.PORT} in ${process.env.NODE_ENV} mode`
  );
});

// export server for chai tests
module.exports = server;
