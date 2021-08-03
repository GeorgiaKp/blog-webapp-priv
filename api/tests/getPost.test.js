const posts = require('../routes/posts')
const model = require('../models/Post');
const httpMock = require('node-mocks-http');
const mockPost = require('./mockdata/postReqPayload.json')
const mockPostList = require('./mockdata/posts.json')

model.findById = jest.fn();
model.find = jest.fn();
let req, res;

beforeEach(()=>{
    model.findById.mockClear();
    model.find.mockClear();
    req = httpMock.createRequest();
    res = httpMock.createResponse();
})

describe("posts controller: get post by id",()=>{
    test("PostGetController function is defined", () => {
        expect(typeof posts.PostGetController).toBe('function')
    });

    test("get a valid post" , async()=>{
        req.params.id = mockPostList[0]._id;
        model.findById.mockReturnValue(mockPostList[0]);
        await posts.PostGetController(req, res);
        expect(model.findById).toHaveBeenCalledWith(req.params.id);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(mockPostList[0]);
        
    });

    test("return 500 when couldn't get post", async () => {
        req.params.id = mockPostList[0]._id;
        model.findById.mockRejectedValue("fake exception from save");
        await posts.PostGetController(req, res);
        expect(model.findById).toHaveBeenCalledWith(req.params.id);
        expect(res.statusCode).toEqual(500);
        expect(res._getJSONData()).toStrictEqual("There was an error")
    })

    
});

describe("posts controller: get all posts",()=>{
    test("get all Food posts" , async()=>{
        req.query.cat = "Food";
        req.query.user = "";
        const foodPosts = [ mockPostList[1], mockPostList[2] ]
        model.find.mockReturnValue(foodPosts);
        await posts.AllPostsGetController(req, res);
        expect(model.find).toHaveBeenCalledWith({
            categories: {
              $in: [req.query.cat],
            },
          });
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(foodPosts);
    });

    test("get Ian's posts" , async()=>{
        req.query.cat = "";
        req.query.user = "Ian";
        const ianPosts = [ mockPostList[0], mockPostList[2] ]
        model.find.mockReturnValue(ianPosts);
        await posts.AllPostsGetController(req, res);
        expect(model.find).toHaveBeenCalledWith({username:req.query.user});
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(ianPosts);
    });

    test("get every post" , async()=>{
        req.query.cat = "";
        req.query.user = "";
        model.find.mockReturnValue(mockPostList);
        await posts.AllPostsGetController(req, res);
        expect(model.find).toHaveBeenCalledWith();
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(mockPostList);
    });

    test("return 500 when get all posts fails" , async()=>{
        req.query.cat = "";
        req.query.user = "";
        model.find.mockRejectedValue("fake exception from find");
        await posts.AllPostsGetController(req, res);
        expect(model.find).toHaveBeenCalledWith();
        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toStrictEqual("There was an error");
    });

});