Simple twitter API clone. Utilizes JSON Web Tokens for user authentication and session management.

---

## Commands

`npm run dev`: start server in development mode using nodemon

`npm test`: run mocha/chai test suite

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
