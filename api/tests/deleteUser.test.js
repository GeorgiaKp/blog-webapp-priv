const users = require('../routes/users')
const modelU = require('../models/User');
const modelP = require('../models/Post');
const httpMock = require('node-mocks-http');
const mockUserList = require('./mockdata/users.json')


modelU.findByIdAndDelete = jest.fn();
modelU.findById = jest.fn();
modelP.deleteMany = jest.fn();
let req, res;

beforeEach(()=>{
    modelU.findByIdAndDelete.mockClear();
    modelU.findById.mockClear();
    req = httpMock.createRequest();
    res = httpMock.createResponse();
})

describe("users controller: delete user by id",()=>{
    test("UserDeleteController function is defined", () => {
        expect(typeof users.UserDeleteController).toBe('function')
    });

    test("404 when user not found", async () => {
        req.params.id = mockUserList[0]._id;
        modelU.findById.mockRejectedValue("fake exception from findbyid");
        await users.UserDeleteController(req, res);
        expect(modelU.findById).toHaveBeenCalledWith(req.params.id);
        expect(res.statusCode).toEqual(404);
        expect(res._getJSONData()).toStrictEqual('User not found!');
    })

    test("401 when to be deleted user is not yours", async ()=> {
        req.params.id = mockUserList[0]._id;
        req.body.userId = mockUserList[1]._id;
        modelU.findById.mockReturnValue(req.params.id)
        await users.UserDeleteController(req, res);
        expect(req.params.id).not.toEqual(req.body.userId)
        expect(res.statusCode).toEqual(401);
        expect(res._getJSONData()).toStrictEqual("You can delete only your account!")
        
    });

    test("500 when Post.deleteMany throws error", async ()=> {
        req.params.id = mockUserList[0]._id;
        req.body.userId = mockUserList[0]._id;
        modelU.findById.mockReturnValue(req.params.id)
        modelP.deleteMany.mockRejectedValue("fake exception from deleteMany")
        modelU.findByIdAndDelete.mockReturnValue(req.params.id);
        await users.UserDeleteController(req, res);
        expect(req.params.id).toEqual(req.body.userId)
        expect(res.statusCode).toEqual(500);
        expect(res._getJSONData()).toStrictEqual("There was an error")
        
    });

    test("500 when User.findByIdAndDelete throws error", async ()=> {
        req.params.id = mockUserList[0]._id;
        req.body.userId = mockUserList[0]._id;
        modelU.findById.mockReturnValue((req.params.id))
        modelP.deleteMany.mockReturnValue({ username: mockUserList[0].username })
        modelU.findByIdAndDelete.mockRejectedValue("fake exception from deleteMany");
        await users.UserDeleteController(req, res);
        expect(req.params.id).toEqual(req.body.userId)
        expect(res.statusCode).toEqual(500);
        expect(res._getJSONData()).toStrictEqual("There was an error")
        
    });

    test("delete a valid user", async () => {
        req.params.id = mockUserList[0]._id;
        req.body.userId = mockUserList[0]._id;
        modelU.findById.mockReturnValue(mockUserList[0]);
        modelP.deleteMany.mockReturnValue({ username: mockUserList[0].username })
        modelU.findByIdAndDelete.mockReturnValue(req.params.id);
        await users.UserDeleteController(req, res);
        expect(req.params.id).toEqual(req.body.userId)
        expect(modelP.deleteMany).toBeCalledWith({ username : mockUserList[0].username });
        expect(modelU.findByIdAndDelete).toBeCalledWith(req.params.id);
        expect(res.statusCode).toEqual(200);
        expect(res._getJSONData()).toStrictEqual("User has been deleted.")
    });

    

});