const posts = require('../routes/posts')
const model = require('../models/Post');
const httpMock = require('node-mocks-http');
const mockPostList = require('./mockdata/posts.json')

model.findById = jest.fn();
let req, res;

beforeEach(()=>{
    model.findById.mockClear();
    req = httpMock.createRequest();
    res = httpMock.createResponse();
})

describe("posts controller: delete post",()=>{
    test("PostDeleteController function is defined", () => {
        expect(typeof posts.PostDeleteController).toBe('function')
    });

    test("delete a post" , async()=>{
        req.params.id = mockPostList[0]._id;
        const post = mockPostList[0]
        req.body.username = mockPostList[0].username;
        post.delete = jest.fn();
        model.findById.mockReturnValue(mockPostList[0])
        post.delete.mockReturnValue(new Promise(function(resolve, reject) { setTimeout(() => resolve({msg: 'To do some more job'}), 1000); }))
        await posts.PostDeleteController(req, res);
        expect(model.findById).toHaveBeenCalledWith(req.params.id);
        expect(post.username).toEqual(req.body.username)
        expect(post.delete).toHaveBeenCalledWith();
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual("Post has been deleted...");
        
    });

    test("return 404 when post not found", async () => {
        req.params.id = mockPostList[0]._id;
        model.findById.mockRejectedValue("fake exception from save");
        await posts.PostDeleteController(req, res);
        expect(model.findById).toHaveBeenCalledWith(req.params.id);
        expect(res.statusCode).toEqual(404);
        expect(res._getJSONData()).toStrictEqual("There was an error")
    })

    test("401 when to be deleted post is not yours", async ()=> {
        req.params.id = mockPostList[0]._id;
        const post = mockPostList[0]
        req.body.username = mockPostList[1].username;
        model.findById.mockReturnValue(mockPostList[0])
        await posts.PostDeleteController(req, res);
        expect(model.findById).toHaveBeenCalledWith(req.params.id);
        expect(post.username).not.toEqual(req.body.username)
        expect(res.statusCode).toEqual(401);
        expect(res._getJSONData()).toStrictEqual("You can delete only your posts!")
        
    });

   test("500 when post delete() failed", async ()=> {
        req.params.id = mockPostList[0]._id;
        const post = mockPostList[0]
        req.body.username = mockPostList[0].username;
        post.delete = jest.fn();
        model.findById.mockReturnValue(mockPostList[0])
        post.delete.mockRejectedValue("fake error from delete")
        await posts.PostDeleteController(req, res);
        expect(model.findById).toHaveBeenCalledWith(req.params.id);
        expect(post.username).toEqual(req.body.username)
        expect(post.delete).toHaveBeenCalledWith();
        expect(res.statusCode).toEqual(500);
        expect(res._getJSONData()).toStrictEqual("There was an error")
        
   });

   // test("500 when post delete() failed", async ()=> {
   //      req.params.id = mockPostList[0]._id;
   //      const postUsername = mockPostList[0].username;
   //      req.body.username = mockPostList[0].username;
   //      const post = mockPostList[0];

   //      // post.delete = jest.fn();
   //      const deleteSpy = jest.spyOn(Object.prototype, 'delete');
   //      deleteSpy.mockImplementation(() => {});
   //      model.findById.mockReturnValue(req.params.id)
   //      post.deleteSpy.mockRejectedValue("fake error from delete")
   //      await posts.PostDeleteController(req, res);
   //      expect(model.findById).toHaveBeenCalledWith(req.params.id);
   //      expect(postUsername).toEqual(req.body.username)
   //      expect(post.deleteSpy).toHaveBeenCalledWith();
   //      expect(res.statusCode).toEqual(500);
   //      expect(res._getJSONData()).toStrictEqual("There was an error")
        
   // });

    // test('code', () => {
    //   const deleteSpy = jest.spyOn(Object.prototype, 'delete');
    //   deleteSpy.mockImplementation(() => {});

    //   require('./code');  //  <= require the code that calls DClient.alert('hello')
    //   expect(deleteSpy).toHaveBeenCalledWith();  // Success!
    // })
});