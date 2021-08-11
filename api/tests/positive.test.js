require("dotenv").config();
const request = require('supertest');
const App = require('../appServer');
const app = new App();
const mockPostRequest = require('./mockdata/postReqPayload.json')
const mockPostList = require('./mockdata/posts.json')
const mongoose = require("mongoose")
const postsUrl = "/api/posts";
require('./setupTests.js')()
require('./teardownTests.js')()


test("GET /api/posts", async () => {
  await request(app._app)
    .get("/api/posts")
    .expect(200)
    .then((response) => {
        // console.log(response.body);
        expect(Array.isArray(response.body)).toBeTruthy()
        expect(response.body.length).toBeGreaterThan(0);
    });
});

test("GET /api/posts:id", async () => {
    await request(app._app)
        .get("/api/posts/" + mockPostList[0]._id)
        .expect(200)
        .then(response => {
            // console.log(response.body);
        });
    });

test("Create a post (POST /api/posts) then delete it 2 times", async()=>{
    const response = await request(app._app)
                    .post("/api/posts")
                    .send(mockPostRequest);
    // console.log(response.body);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('username', mockPostRequest.username);
    expect(response.body).toHaveProperty('title', mockPostRequest.title);
    expect(response.body).toHaveProperty('_id');
    expect(response.body).toHaveProperty('createdAt');
    expect(Object.keys(response.body).length).toEqual(8);

    const responseOfDelete = await request(app._app)
                    .delete("/api/posts/" + response.body._id)
                    .send({_id:response.body._id,
                            username:response.body.username,
                            title:response.body.title
                          });
    expect(responseOfDelete.statusCode).toBe(200);
    // console.log(responseOfDelete.body);

    const responseOfGet = await request(app._app)
                    .get("/api/posts/" + response.body._id);
    // console.log("get",responseOfGet.body);
    expect(responseOfGet.statusCode).toBe(404);
    
    // // again a delete call should fail 
    let responseOfDelete2= await request(app._app)
                    .delete("/api/posts/" + response.body._id)
                    .send({_id:response.body._id,
                            username:response.body.username,
                            title:response.body.title
                          });
    expect(responseOfDelete2.statusCode).toBe(404);
    // console.log("del2",responseOfDelete2.body);
});


 test("Create a post, then update it (PUT /api/posts/:id)", async () => {
    const responseOfCreate = await request(app._app)
                    .post("/api/posts")
                    .send({
                        username: "lebrie",   
                        title:"A very beautiful",
                        desc: "post",
                    });
    expect(responseOfCreate.statusCode).toBe(201);
    expect(responseOfCreate.body).toHaveProperty("title", "A very beautiful");

    const responseOfUpdate = await request(app._app)
                    .put("/api/posts/" + responseOfCreate.body._id)
                    .send({
                        username: "lebrie",
                        desc:"post about Brie"
                    });
    expect(responseOfUpdate.statusCode).toBe(200);

    const responseOfGet = await request(app._app)
                    .get("/api/posts/" + responseOfCreate.body._id);
    console.log(responseOfGet.statusCode, responseOfGet.body)
    expect(responseOfGet.statusCode).toBe(200);
    expect(responseOfGet.body.updatedAt)
    expect(responseOfGet.body).toHaveProperty('_id', responseOfCreate.body._id);
    expect(responseOfGet.body).toHaveProperty('desc', 'post about Brie');
    expect(responseOfGet.body.updatedAt).toBeDefined()
    expect(Object.keys(responseOfGet.body).length).toEqual(8)


    const responseOfDelete = await request(app._app)
                .delete("/api/posts/" + responseOfCreate.body._id)
                .send({_id:responseOfCreate.body._id,
                        username:responseOfCreate.body.username,
                        title:responseOfCreate.body.title
                      });
    expect(responseOfDelete.statusCode).toBe(200);

});
