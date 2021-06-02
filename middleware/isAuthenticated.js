const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send({ message: "Not authorized" });
  }

  try {
    // Verify the token - will throw error if invalid
    const token = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
    res.locals.token = token;
    next();
  } catch (err) {
    return res.status(400).send({ message: err.message });
  }
};
