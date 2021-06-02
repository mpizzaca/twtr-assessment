const router = require("express").Router();
const { Tweet, User } = require("../models");

// Post a new tweet
router.post("/", (req, res, next) => {
  const { body } = req.body;

  if (!body) {
    return next({ status: 400, message: "body is required" });
  }

  // Get user's name
  User.findOne({ _id: res.locals.token.userID })
    .then((user) => {
      if (!user) {
        return Promise.reject({ status: 404 });
      }
      // create the tweet
      return Tweet.create({ body, author: user.username });
    })
    // send back new tweet
    .then((tweet) => res.status(201).send(tweet))
    .catch(next);
});

// Get all tweets
router.get("/", (req, res, next) => {
  Tweet.find({})
    .then((tweets) => res.send(tweets))
    .catch(next);
});

// Get a specific tweet
router.get("/:id", (req, res, next) => {
  const { id } = req.params;
  Tweet.findOne({ _id: id })
    .then((tweet) => res.send(tweet))
    .catch(next);
});

// Update a tweet
router.patch("/:id", (req, res, next) => {
  const { body } = req.body;
  const tweetID = req.params.id;

  if (!body) {
    return next({ status: 400, message: "body is required" });
  }

  // Get user, tweet to ensure it's the same author
  return Promise.all([
    User.findOne({ _id: res.locals.token.userID }),
    Tweet.findOne({ _id: tweetID }),
  ])
    .then(([user, tweet]) => {
      if (!user || !tweet) {
        return Promise.reject({ status: 404 });
      }

      // check user name matches the tweet author's name
      if (tweet.author !== user.username) {
        return Promise.reject({ status: 401, message: "not authorized" });
      }
      // Update the tweet
      return Tweet.updateOne(
        { _id: tweetID },
        { body, updatedAt: new Date() }
      ).then(() => Tweet.findOne({ _id: tweetID }));
    })
    .then((tweet) => res.send(tweet))
    .catch(next);
});

// Delete a tweet
router.delete("/:id", (req, res, next) => {
  const tweetID = req.params.id;

  // Get user, tweet to ensure it's the same author
  return Promise.all([
    User.findOne({ _id: res.locals.token.userID }),
    Tweet.findOne({ _id: tweetID }),
  ])
    .then(([user, tweet]) => {
      if (!user || !tweet) {
        return Promise.reject({ status: 404 });
      }
      // check user name matches the tweet author's name
      if (tweet.author !== user.username) {
        return Promise.reject({ status: 401, message: "not authorized" });
      }
      // Delete the tweet
      return Tweet.deleteOne({ _id: tweetID });
    })
    .then(() => res.status(204).send())
    .catch(next);
});

// Like a tweet
router.post("/:id/like", (req, res, next) => {
  const tweetID = req.params.id;

  // Get user's name to add to 'likes' array
  User.findOne({ _id: res.locals.token.userID })
    .then((user) => {
      if (!user) return Promise.reject();
      return Tweet.updateOne(
        { _id: tweetID },
        { $addToSet: { likes: user.username } }
      );
    })
    .then(() => Tweet.findOne({ _id: tweetID }))
    .then((tweet) => res.send(tweet))
    .catch(next);
});

// Retweet a tweet
router.post("/:id/retweet", (req, res, next) => {
  const tweetID = req.params.id;

  Promise.all([
    User.findOne({ _id: res.locals.token.userID }),
    Tweet.findOne({ _id: tweetID }),
  ])
    .then(([user, tweet]) =>
      Tweet.create({
        body: tweet.body,
        author: user.username,
        retweet: tweet._id,
      })
    )
    .then((tweet) => res.send(tweet))
    .catch(next);
});

module.exports = router;
