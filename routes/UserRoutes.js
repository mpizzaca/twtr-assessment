const router = require("express").Router();
const bcrypt = require("bcrypt");
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
    .then(() => res.status(201).send())
    .catch((err) => {
      // duplicate key - ie. user already exists
      if (err.code === 11000) {
        next({ status: 400, message: "user already exists" });
      }
    });
});

router.post("/login", (req, res, next) => {
  // TODO
});

module.exports = router;
