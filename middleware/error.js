module.exports = (err, req, res, next) => {
  // TODO
  // console.log("Error:", err);
  if (err.status && err.message) {
    return res.status(err.status).send({ message: err.message });
  }
  res.send();
};
