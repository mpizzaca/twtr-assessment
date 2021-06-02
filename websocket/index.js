const jwt = require("jsonwebtoken");
const { User } = require("../models");

// This code is messy but works given time constraints.
// Would implement a more robust solution for anything production-facing.
module.exports = function (wss) {
  let connectionID = 0;
  const messageTypes = {
    AUTHENTICATE: "authenticate",
    CHAT_MESSAGE: "chat_message",
  };

  // listen for websocket connections to facilitate chat messages
  wss.on("connection", (ws) => {
    // assign new clients with a 'twtr' object containing a unique connectionID
    ws.twtr = {
      connectionID: connectionID++,
    };
    console.log(
      `WebSocket: connection initiated, connection #${ws.twtr.connectionID}`
    );

    // listen for two message types:
    // 1) authenticate: user is providing a JWT to authenticate their websocket session
    // 2) chat_message: user is sending a chat message to another user
    ws.on("message", (data) => {
      console.log(
        `WebSocket: message received from connection #${ws.twtr.connectionID}:`,
        data
      );
      try {
        const msg = JSON.parse(data);
        if (msg.type === messageTypes.AUTHENTICATE) {
          // authenticate the client via the JWT
          const decodedToken = jwt.verify(msg.token, process.env.JWT_SECRET);
          ws.twtr.userID = decodedToken.userID;
          // get the username to identify future messages
          User.findOne({ _id: ws.twtr.userID }).then((user) => {
            if (!user) {
              return Promise.reject();
            }
            // save the username on the connection object
            ws.twtr.username = user.username;
            console.log(
              `WebSocket: connection #${ws.twtr.connectionID} authenticated, user: ${ws.twtr.username}`
            );
          });
        } else if (msg.type === messageTypes.CHAT_MESSAGE) {
          // message requires the sender be authenticated, and must contain recipient and content
          if (!ws.twtr.userID || !msg.recipient || !msg.message) {
            throw Error(
              "must authenticate websocket session, and provide recipient and message"
            );
          }
          // get recipients userID
          User.findOne({ username: msg.recipient }).then((user) => {
            if (!user) {
              throw Error();
            }
            // look for the recipient in our websocket connections
            wss.clients.forEach((client) => {
              if (client.twtr.userID == user._id) {
                // send them the message
                client.send(
                  JSON.stringify({
                    sender: ws.twtr.username,
                    message: msg.message,
                  })
                );
              }
            });
          });
        }
      } catch (err) {
        console.log(`WebSocket: error processing message: ${err.message}`);
        ws.send(JSON.stringify({ message: "Error processing last message" }));
      }
    });

    ws.on("close", (ws) => {
      console.log(`WebSocket: closing connection with ${ws.twtrID}`);
    });
  });
};
