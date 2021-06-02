Simple twitter API clone with websocket-enabled user chat. Utilizes JSON Web Tokens (JWT) for user authentication and session management.

---

## Commands

`npm run dev`: start server in development mode using nodemon

`npm test`: run mocha/chai test suite

---

## User Chat

User's can chat by connecting to the websocket server and authenticating their session via JWT.

Note: [WebSocket King Client](https://chrome.google.com/webstore/detail/websocket-king-client/cbcbkhdmedgianpaifchdaddpnmgnknn?hl=en) is a conveient chrome extension to connect to and test the websocket chat.

URL: `ws://localhost:3000`

1. Authenticate websocket connection

- get JWT from `POST /login` response
- send JWT in websocket authentication message:

```js
{
  "type": "authentication",
  "token": "..."
}
```

2. Send messages to other authenticated users

```js
{
  "type": "chat_message",
  "recipient": "tom_smith", // recipients username
  "message": "Hey tom!",
}
```

---

## API Documentation

## `POST /login`

### Logs a user in.

Request body:

```js
{
  username: string,
  password: string,
}
```

Success response body:

```js
{
  token: string, // JWT
}
```

Error response body:

```js
{
  message: string,
}
```

## `POST /register`

### Registers a new user.

Request body:

```js
{
  username: string,
  password: string,
}
```

Success response body:

```js
{
  token: string, // JWT
}
```

Error response body:

```js
{
  message: string,
}
```
