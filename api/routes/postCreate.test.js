require("dotenv").config();
const createServer = require('../index') // Link to server file
const app = createServer()
const supertest = require("supertest")
const request = supertest(app)
const mongoose = require("mongoose");
const Post = require("../models/Post");

beforeEach((done) => {
  mongoose.connect(process.env.MONGO_URL,
    { useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: true },
    () => done()
  )
});

test("GET /posts", async () => {
  // const post = await Post.create({
  //   title: "Post 1",
  //   content: "Lorem ipsum",
  // })

  await supertest(app)
    .get("/api/posts")
    .expect(200)
    .then((response) => {
      // Check the response type and length
      expect(Array.isArray(response.body)).toBeTruthy()
      expect(response.body.length).toEqual(1)

      // Check the response data
      expect(response.body[0]._id).toBe(post.id)
      expect(response.body[0].title).toBe(post.title)
      expect(response.body[0].desc).toBe(post.desc)
    })
})

afterEach((done) => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done())
  })
});