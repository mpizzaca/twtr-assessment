const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

router.post("/register", (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return next({ status: 400, message: "username and password required" });
  }

  // generate hash
  bcrypt
    .hash(password, 10)
    .then((hashedPassword) =>
      // save the user
      User.create({ username, password: hashedPassword })
    )
    .then((user) => {
      // generate and send back jwt with the user's ID
      const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET);
      res.status(201).send({ token });
    })
    .catch((err) => {
      // duplicate key - ie. user already exists
      if (err.code === 11000) {
        next({ status: 400, message: "user already exists" });
      } else {
        next(err);
      }
    });
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return next({ status: 400, message: "username and password required" });
  }

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        return Promise.reject({ status: 400, message: "user doesn't exist" });
      }
      return Promise.all([
        Promise.resolve(user),
        bcrypt.compare(password, user.password),
      ]);
    })
    .then(([user, match]) => {
      if (!match) {
        return Promise.reject({ status: 401, message: "invalid password" });
      }
      // generate and send back jwt with the user's ID
      const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET);
      res.status(200).send({ token });
    })
    .catch(next);
});

module.exports = router;
