const posts = require('../routes/posts')
const model = require('../models/Post');
const httpMock = require('node-mocks-http');
const mockPost = require('./mockdata/postReqPayload.json')
const mockPostList = require('./mockdata/posts.json')


let req, res;

beforeEach(()=>{
    // model.save.mockClear();
    req = httpMock.createRequest();
    res = httpMock.createResponse();
})

describe("posts controller: create post",()=>{
    test("PostCreateController function is defined", () => {
        expect(typeof posts.PostCreateController).toBe('function')
    });

    test.only("create a valid post" , async()=>{
        const newPost = new model(mockPost)
        
        newPost.save = jest.fn(() => Promise.resolve(mockPostList[3]));
        // newPost.save.mockReturnValue(new Promise(function(resolve, reject) { setTimeout(() => resolve(mockPostList[3]), 1000); }));
        const func = () => newPost.save();
        const promise = func();
        await posts.PostCreateController(req, res);
        expect(newPost.save).toHaveBeenCalledWith();
        expect(promise).resolves.toEqual(mockPostList[3])
        expect(res.statusCode).toBe(201);
        expect(res._getJSONData()).toStrictEqual(mockPostList[3]);
        
    });

    test("return 500 when post creation failed", async () => {
        const newPost = new model(mockPost);
        newPost.save = jest.fn();
        newPost.save.mockRejectedValue("fake exception from save");
        await posts.PostCreateController(req, res);
        expect(res.statusCode).toEqual(500);
        expect(res._getJSONData()).toStrictEqual("There was an error")
    })

   

});