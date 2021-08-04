require("dotenv").config();
const request = require('supertest');
const App = require('../appServer');
const app = new App();
// const mockEmployeeRequest = require('../mockdata/employeeReqPayload.json')
const mongoose = require("mongoose")
// const contractUrl = "/api/contacts";


beforeAll(done => {
  mongoose.connect(process.env.MONGO_URL,
    { useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: true },
    () => done()
  )
  console.log("connected to Mongo")
});

afterAll(done => {
  mongoose.connection.close()
  console.log("disconnected from Mongo")
  done()
})

test("GET /api/posts", async () => {
    expect(2).toBeGreaterThan(0);
});

test.only("GET /api/posts", async () => {
  await request(app.runApp)
    .get("/api/posts")
    .expect(200)
    .then((response) => {
        console.log("bsfh");
        expect(Array.isArray(response.body)).toBeTruthy()
        expect(response.body.length).toBeGreaterThan(0);
    });
});

test("GET " + "/api/posts" + " Get all posts", (done) => {
        request(app.runApp)
        .get("/api/posts")
        .expect(200)
        .then(response => {
            console.log(response.body);
            expect(response.body.length).toBeGreaterThan(0);
            done();
        });
    });

// describe("Positive scenarios ->validate "+ contractUrl, ()=>{
//     

// });