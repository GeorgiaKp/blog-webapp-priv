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

    test("User.findByIdAndDelete throws exception when user not found", async () => {
        req.params.id = mockUserList[0]._doc._id;
        modelU.findById.mockRejectedValue("fake exception from findbyid");
        const res = {
            send: jest.fn(s => s)
        };
        await users.UserDeleteController(req, res);
        expect(modelU.findById).toHaveBeenCalledWith(req.params.id);
        expect(res.send.mock.calls.length).toEqual(1);
        expect(res.send.mock.calls[0][0]).toEqual('User not found!');
    })

    test.only("delete a valid user", async () => {
        req.params.id = mockUserList[0]._doc._id;
        req.body.userId = mockUserList[0]._doc._id;
        modelU.findById.mockReturnValue(req.params.id);
        modelP.deleteMany.mockReturnValue({ username: mockUserList[0]._doc.username })
        modelU.findByIdAndDelete.mockReturnValue(req.params.id);
        await users.UserDeleteController(req, res);
        expect(modelP.deleteMany).toBeCalledWith({ username: mockUserList[0]._doc.username });
        expect(modelU.findByIdAndDelete).toBeCalledWith(req.params.id);
        expect(res.statusCode).toEqual(200);
        expect(res._getJSONData()).toStrictEqual("User has been deleted.")
    });

    test("error msg when to be deleted user is not yours", async ()=> {
        req.params.id = mockUserList[0]._doc._id;
        req.body.userId = mockUserList[1]._doc._id;
        modelU.findById.mockReturnValue(req.params.id)
        const res = {
            send: jest.fn(s => s)
        };
        await users.UserDeleteController(req, res);
        expect(req.params.id).not.toEqual(req.body.userId)
        expect(res.send.mock.calls.length).toEqual(1);
        expect(res.send.mock.calls[0][0]).toEqual("You can delete only your account!");
        
    });

});