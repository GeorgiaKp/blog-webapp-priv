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
        req.body = {...mockPost}
        const newPost = new model(req.body)
        newPost.save = jest.fn();
        newPost.save.mockReturnValue(mockPostList[3]);
        await posts.PostCreateController(req, res);
        expect(newPost.save).toHaveBeenCalledWith();
        expect(res.statusCode).toBe(200);
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