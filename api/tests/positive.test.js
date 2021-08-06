require("dotenv").config();
const request = require('supertest');
const App = require('../appServer');
const app = new App();
const mockPostRequest = require('./mockdata/postReqPayload.json')
const mongoose = require("mongoose")


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

test.only("GET /api/posts", async () => {
    app._app.get("/api/fa", (req, res) => res.send("Hello World!"));
    console.log("routess",app._app._router.stack) 
    expect(2).toBeGreaterThan(0);
});

test("GET /api/posts", async () => {
  await request(app._app)
    .get("/api/fake")
    .expect(200)
    .then((response) => {
        console.log(response.body);
        expect(Array.isArray(response.body)).toBeTruthy()
        expect(response.body.length).toBeGreaterThan(0);
    });
});
// 
// test("GET /api/posts/:id ", async () => {
//   const responseOfCreate = await request(app)
//                   .post("/api/posts/")
//                   .send({
//                       title:"Brie",
//                       email: "Brie@gmail.com",
//                       password: "ttt123567$"
//                   });
//   expect(responseOfCreate.statusCode).toBe(201);
//   console.log(responseOfCreate.body._id)
//   const responseOfGet = await request(app)
//                   .get(contractUrl + "/" + responseOfCreate.body._id);
//   console.log(responseOfGet.body)
//   expect(responseOfGet.statusCode).toBe(200);
//   expect(responseOfGet.body._id).toStrictEqual(responseOfCreate.body._id);
// });



test("POST /api/posts", async()=>{
    const response = await request(app._app)
                    .post("/api/posts")
                    .send(mockPostRequest);
    console.log("rp",response.body);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('username', mockPostRequest.name);
    expect(response.body).toHaveProperty('title', mockPostRequest.title);
    expect(response.body).toHaveProperty('_id');
    expect(response.body).toHaveProperty('createdAt');
    expect(Object.keys(response.body).length).toEqual(8);

});

// test("GET " + "/api/posts" + " Get all posts", (done) => {
//         request(app._app)
//         .get("/api/posts")
//         .expect(200)
//         .then(response => {
//             console.log(response.body);
//             expect(response.body.length).toBeGreaterThan(0);
//             done();
//         });
//     });

// describe("Positive scenarios ->validate "+ contractUrl, ()=>{
//     

// });