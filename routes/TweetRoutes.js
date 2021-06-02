const router = require("express").Router();

// Post a new tweet
router.post("/", (req, res, next) => {});

// Get all tweets
router.get("/", (req, res, next) => {});

// Get a specific tweet
router.get("/:id", (req, res, next) => {});

// Update a tweet
router.patch("/:id", (req, res, next) => {});

// Delete a tweet
router.delete("/:id", (req, res, next) => {});

module.exports = router;
