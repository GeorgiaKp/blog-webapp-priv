require("dotenv").config();
const app = require('../index') // Link to server file
const supertest = require("supertest")
const request = supertest(app)
const mongoose = require("mongoose");
const Post = require("../models/Post");

describe("Connection", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: true
    })
  });

  it('Should save post to database', async done => {
  const res = await request.post('/')
  .send({
      title: 'I am cheese',
      desc: 'a brie',
      username: 'lebrie'
    })
  done()
});

  afterAll(async done => {
    mongoose.disconnect();
    done();
});

});