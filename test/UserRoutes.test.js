const app = require("../index.js");
const { User } = require("../models");
const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = require("chai");
const should = chai.should();

chai.use(chaiHttp);

describe("UserRoutes", () => {
  // clear users collection
  before((done) => {
    User.deleteMany({}).then(() => done());
  });

  describe("POST /register", () => {
    it("registers a user", (done) => {
      chai
        .request(app)
        .post("/register")
        .send({ username: "testuser", password: "testpass" })
        .end((err, res) => {
          expect(res).to.have.status(201);
          done();
        });
    });

    it("prevents the same user from being registered again", (done) => {
      chai
        .request(app)
        .post("/register")
        .send({ username: "testuser", password: "testpass" })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.equal("user already exists");
          done();
        });
    });

    it("prevents the same user with different capitalization from being registered again", (done) => {
      chai
        .request(app)
        .post("/register")
        .send({ username: "TeStUsEr", password: "testpass" })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.equal("user already exists");
          done();
        });
    });

    it("fails without a username", (done) => {
      chai
        .request(app)
        .post("/register")
        .send({ password: "testpass" })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.equal("username and password required");
          done();
        });
    });

    it("fails without a password", (done) => {
      chai
        .request(app)
        .post("/register")
        .send({ username: "TeStUsEr" })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.equal("username and password required");
          done();
        });
    });

    it("registers a second user", (done) => {
      chai
        .request(app)
        .post("/register")
        .send({ username: "testuser2", password: "testpass" })
        .end((err, res) => {
          expect(res).to.have.status(201);
          done();
        });
    });
  });
});
