module.exports = (err, req, res, next) => {
  if (err.status && err.message) {
    // if we have a error message & status, send both
    return res.status(err.status).send({ message: err.message });
  } else if (err.status) {
    // just send status if no message
    return res.status(err.status).send();
  } else {
    // default to HTTP 500 response
    return res.status(500).send();
  }
};
