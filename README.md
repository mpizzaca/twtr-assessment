Simple twitter API clone with websocket-enabled user chat. Utilizes JSON Web Tokens (JWT) for user authentication and session management.

Server: Node/Express

Database: MongoDB

---

## Setup

1. `npm i`: Install depenencies

2. Copy `.env.developement` and `.env.test` to project root (provided separately).

---

## Commands

`npm run dev`: start server in development mode using nodemon

`npm test`: run mocha/chai test suite

---

## User Chat

User's can chat by connecting to the websocket server and authenticating their session via JWT.

1. Authenticate websocket connection

- get JWT from `POST /login` response
- send JWT in websocket authentication message:

```js
{
  "type": "authenticate",
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

## Try It

Initiate two separate websocket connections. URL: `ws://localhost:3000`

Note: [WebSocket King Client](https://chrome.google.com/webstore/detail/websocket-king-client/cbcbkhdmedgianpaifchdaddpnmgnknn?hl=en) is a conveient chrome extension to connect to and test the websocket chat.

Authenticate 'tom' in websocket connection 1 by sending:

```js
{
  "type": "authenticate",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2MGI3OTdiMDZlZTA1MDE1YWRjMDNiY2QiLCJpYXQiOjE2MjI2NDQ2NTd9.Y6z6sPtTh7ML7QymSxc2vqW0if5JjtJjA4cr8LHouBI"
}
```

Authenticate 'mary' in websocket connection 2 by sending:

```js
{
  "type": "authenticate",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2MGI3OTg0NDZlZTA1MDE1YWRjMDNiY2UiLCJpYXQiOjE2MjI2NDQ4MDR9.vfw5TzowH_Tg0SYr-Mi5MLFWAIOG7Pa2lXQSRIKc058"
}
```

Have 'tom' send 'mary' a message from websocket connection 1 by sending:

```js
{
  "type": "chat_message",
  "recipient": "mary",
  "message": "Hey Mary!"
}
```

'mary' will receive the message in websocket connection 2.

![websocket test](./docs/websocket_test.png)

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

## `GET /tweets`

### Get all tweets.

Requires valid JWT to be set as `Authorization` header.

Success response body:

```js
[
  {
    _id: string,
    body: string,
    author: string,
    createdAt: date,
    updatedAt: date, // nullable
    likes: [string],
    retweet: string, // points to original tweet ID if this is a retweet. nullable.
  },
];
```

## `GET /tweets/:id`

### Get a single tweet.

Requires valid JWT to be set as `Authorization` header.

Success response body:

```js
{
  _id: string,
  body: string,
  author: string,
  createdAt: date,
  updatedAt: date, // nullable
  likes: [string],
  retweet: string, // points to original tweet ID if this is a retweet. nullable.
}
```

## `POST /tweets`

### Post a tweet.

Requires valid JWT to be set as `Authorization` header.

Request body:

```js
{
  body: string,
}
```

Success response body:

```js
{
  _id: string,
  body: string,
  author: string,
  createdAt: date,
  updatedAt: date, // nullable
  likes: [string],
  retweet: string, // points to original tweet ID if this is a retweet. nullable.
}
```

## `PATCH /tweets/:id`

### Update a single tweet.

Requires valid JWT to be set as `Authorization` header.

Requires the user to be the tweet author.

Request body:

```js
{
  body: string,
}
```

Success response body:

```js
{
  _id: string,
  body: string,
  author: string,
  createdAt: date,
  updatedAt: date, // nullable
  likes: [string],
  retweet: string, // points to original tweet ID if this is a retweet. nullable.
}
```

## `DELETE /tweets/:id`

### Deletes a single tweet.

Requires valid JWT to be set as `Authorization` header.

Requires the user to be the tweet author.

Request body:

```js
{
  body: string,
}
```

Success response status: 204

## `POST /tweets/:id/like`

### Like a tweet.

Requires valid JWT to be set as `Authorization` header.

Success response body:

```js
{
  _id: string,
  body: string,
  author: string,
  createdAt: date,
  updatedAt: date, // nullable
  likes: [string],
  retweet: string, // points to original tweet ID if this is a retweet. nullable.
}
```

## `POST /tweets/:id/retweet`

### Retweets a tweet.

Requires valid JWT to be set as `Authorization` header.

Success response body:

```js
{
  _id: string,
  body: string,
  author: string,
  createdAt: date,
  updatedAt: date, // nullable
  likes: [string],
  retweet: string, // points to original tweet ID if this is a retweet. nullable.
}
```
