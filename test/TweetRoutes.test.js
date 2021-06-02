const app = require("../index.js");
const { Tweet } = require("../models");
const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = require("chai");

chai.use(chaiHttp);

describe("TweetRoutes", () => {
  let tokenA;
  let tokenB;
  let tweetA;
  let tweetB;

  before((done) => {
    // clear tweets collection before running tests
    const pTweet = Tweet.deleteMany({});

    // get valid user tokens
    const pUserA = chai
      .request(app)
      .post("/login")
      .send({ username: "testuser", password: "testpass" })
      .then((res) => (tokenA = res.body.token));

    const pUserB = chai
      .request(app)
      .post("/login")
      .send({ username: "testuser2", password: "testpass" })
      .then((res) => (tokenB = res.body.token));

    Promise.all([pTweet, pUserA, pUserB]).then(() => done());
  });

  describe("POST /tweets", () => {
    it("requires a user to be authenticated", (done) => {
      chai
        .request(app)
        .post("/tweets")
        .send({ body: "this is a test tweet" })
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });

    it("allows authenticated users to post a tweet", (done) => {
      chai
        .request(app)
        .post("/tweets")
        .set("Authorization", tokenA)
        .send({ body: "this is a test tweet" })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.haveOwnProperty("body");
          expect(res.body).to.haveOwnProperty("createdAt");
          expect(res.body).to.haveOwnProperty("author");
          // save the tweet ID for next tests
          tweetA = res.body._id;
          done();
        });
    });

    it("allows another authenticated user to post a tweet", (done) => {
      chai
        .request(app)
        .post("/tweets")
        .set("Authorization", tokenB)
        .send({ body: "this is a different test tweet" })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.haveOwnProperty("body");
          expect(res.body).to.haveOwnProperty("createdAt");
          expect(res.body).to.haveOwnProperty("author");
          // save the tweet ID for next tests
          tweetB = res.body._id;
          done();
        });
    });
  });

  describe("GET /tweets", () => {
    it("requires a user to be authenticated", (done) => {
      chai
        .request(app)
        .get("/tweets")
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });

    it("returns all tweets", (done) => {
      chai
        .request(app)
        .get("/tweets")
        .set("Authorization", tokenB)
        .end((err, res) => {
          expect(res).to.have.status(200);
          // expect two tweets we created above
          expect(res.body).to.have.length(2);
          done();
        });
    });
  });

  describe("GET /tweets/:id", () => {
    it("requires a user to be authenticated", (done) => {
      chai
        .request(app)
        .get(`/tweets/${tweetA}`)
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });

    it("returns a valid tweet", (done) => {
      chai
        .request(app)
        .get(`/tweets/${tweetA}`)
        .set("Authorization", tokenB)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.haveOwnProperty("body");
          expect(res.body).to.haveOwnProperty("createdAt");
          expect(res.body).to.haveOwnProperty("author");
          done();
        });
    });

    it("fails for invalid tweet id", (done) => {
      chai
        .request(app)
        .get(`/tweets/not_a_real_id`)
        .set("Authorization", tokenB)
        .end((err, res) => {
          expect(res).to.have.status(500);
          done();
        });
    });
  });

  describe("POST /tweets/:id/like", () => {
    it("requires a user to be authenticated", (done) => {
      chai
        .request(app)
        .post(`/tweets/${tweetA}/like`)
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });

    it("fails for invalid tweet id", (done) => {
      chai
        .request(app)
        .post(`/tweets/not_a_real_id/like`)
        .set("Authorization", tokenB)
        .end((err, res) => {
          expect(res).to.have.status(500);
          done();
        });
    });

    it("adds the user's like", (done) => {
      chai
        .request(app)
        .post(`/tweets/${tweetA}/like`)
        .set("Authorization", tokenB)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.haveOwnProperty("body");
          expect(res.body).to.haveOwnProperty("createdAt");
          expect(res.body).to.haveOwnProperty("author");
          expect(res.body).to.haveOwnProperty("likes");
          expect(res.body.likes).to.have.length(1);
          expect(res.body.likes[0]).to.equal("testuser2");
          done();
        });
    });

    it("doesn't duplicate likes", (done) => {
      chai
        .request(app)
        .post(`/tweets/${tweetA}/like`)
        .set("Authorization", tokenB)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.haveOwnProperty("body");
          expect(res.body).to.haveOwnProperty("createdAt");
          expect(res.body).to.haveOwnProperty("author");
          expect(res.body).to.haveOwnProperty("likes");
          expect(res.body.likes).to.have.length(1);
          expect(res.body.likes[0]).to.equal("testuser2");
          done();
        });
    });
  });

  describe("PATCH /tweets/:id", () => {
    it("requires the user to be authenticated", (done) => {
      chai
        .request(app)
        .patch(`/tweets/${tweetA}`)
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });

    it("requires the user to own the tweet", (done) => {
      chai
        .request(app)
        .patch(`/tweets/${tweetA}`)
        .set("Authorization", tokenB)
        .send({ body: "updated tweet body" })
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });

    it("requires a body", (done) => {
      chai
        .request(app)
        .patch(`/tweets/${tweetA}`)
        .set("Authorization", tokenA)
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
    });

    it("returns the updated tweet", (done) => {
      chai
        .request(app)
        .patch(`/tweets/${tweetA}`)
        .set("Authorization", tokenA)
        .send({ body: "updated tweet body" })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.haveOwnProperty("body");
          expect(res.body).to.haveOwnProperty("createdAt");
          expect(res.body).to.haveOwnProperty("author");
          expect(res.body.body).to.equal("updated tweet body");
          done();
        });
    });
  });

  describe("DELETE /tweets/:id", () => {
    it("requires the user to be authenticated", (done) => {
      chai
        .request(app)
        .delete(`/tweets/${tweetA}`)
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });

    it("requires the user to own the tweet", (done) => {
      chai
        .request(app)
        .delete(`/tweets/${tweetA}`)
        .set("Authorization", tokenB)
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });

    it("deletes the tweet", (done) => {
      chai
        .request(app)
        .delete(`/tweets/${tweetA}`)
        .set("Authorization", tokenA)
        .end((err, res) => {
          expect(res).to.have.status(204);
          done();
        });
    });
  });

  describe("GET /tweets (post-delete)", () => {
    it("returns the one remaining tweet", (done) => {
      chai
        .request(app)
        .get("/tweets")
        .set("Authorization", tokenA)
        .end((err, res) => {
          expect(res).to.have.status(200);
          // expect one tweet
          expect(res.body).to.have.length(1);
          done();
        });
    });
  });

  describe("POST /tweets/:id/retweet", () => {
    it("requires a user to be authenticated", (done) => {
      chai
        .request(app)
        .post(`/tweets/${tweetA}/retweet`)
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });

    it("fails for invalid tweet id", (done) => {
      chai
        .request(app)
        .post(`/tweets/not_a_real_id/retweet`)
        .set("Authorization", tokenB)
        .end((err, res) => {
          expect(res).to.have.status(500);
          done();
        });
    });

    it("creates a new tweet, linking to the original", (done) => {
      chai
        .request(app)
        .post(`/tweets/${tweetB}/retweet`)
        .set("Authorization", tokenA)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.haveOwnProperty("body");
          expect(res.body).to.haveOwnProperty("createdAt");
          expect(res.body).to.haveOwnProperty("author");
          expect(res.body).to.haveOwnProperty("retweet");
          expect(res.body.retweet).to.equal(tweetB);
          done();
        });
    });
  });
});
