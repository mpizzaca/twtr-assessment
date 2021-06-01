`npm run dev`

Start server in development mode (using nodemon)

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
  token: string, // jwt
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
  token: string, // jwt
}
```

Error response body:

```js
{
  message: string,
}
```
