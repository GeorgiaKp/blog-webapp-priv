const posts = require('../routes/posts')
const model = require('../models/Post');
const httpMock = require('node-mocks-http');
const mockPost = require('./mockdata/postReqPayload.json')
const mockPostList = require('./mockdata/posts.json')

model.findByIdAndUpdate = jest.fn();
model.findById = jest.fn();
model.find = jest.fn();
let req, res;

beforeEach(()=>{
    model.findByIdAndUpdate.mockClear();
    model.findById.mockClear();
    model.find.mockClear();
    req = httpMock.createRequest();
    res = httpMock.createResponse();
})

describe("posts controller: update post by id",()=>{
    test("PostUpdateController function is defined", () => {
        expect(typeof posts.PostUpdateController).toBe('function')
    });

    test("update the desc of a valid post" , async()=>{
        req.params.id = mockPostList[0]._id;
        const post = mockPostList[0];
        req.body.username = mockPostList[0].username;
        req.body.desc = "sitting happily";
        let toUpdate = {...mockPostList[0], desc: "sitting happily"};
        let bodyUpdate = {
         username: req.body.username, 
         desc: req.body.desc
        }
        model.findById.mockReturnValue(mockPostList[0]);
        model.findByIdAndUpdate.mockReturnValue(toUpdate)
        await posts.PostUpdateController(req, res);
        expect(model.findById).toHaveBeenCalledWith(req.params.id);
        expect(post.username).toEqual(req.body.username)
        expect(model.findByIdAndUpdate).toHaveBeenCalledWith(req.params.id,
          { 
            $set: bodyUpdate, 
          },
          { new: true }
        );
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(toUpdate);
        
    });

    test("401 when to be updated post is not yours", async ()=> {
        req.params.id = mockPostList[0]._id;
        const post = mockPostList[0];
        req.body.username = mockPostList[1].username;
        model.findById.mockReturnValue(mockPostList[0])
        await posts.PostUpdateController(req, res);
        expect(model.findById).toHaveBeenCalledWith(req.params.id);
        expect(post.username).not.toEqual(req.body.username)
        expect(res.statusCode).toEqual(401);
        expect(res._getJSONData()).toStrictEqual("You can update only your posts!")
        
    });

    test("return 500 when couldn't get post", async () => {
        req.params.id = mockPostList[0]._id;
        model.findById.mockRejectedValue("fake exception from findById");
        await posts.PostUpdateController(req, res);
        expect(model.findById).toHaveBeenCalledWith(req.params.id);
        expect(res.statusCode).toEqual(500);
        expect(res._getJSONData()).toStrictEqual("There was an error!")
    })

    
});
