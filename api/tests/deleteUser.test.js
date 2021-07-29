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
    
    req = httpMock.createRequest();
    req.params.id = "123"
    res = httpMock.createResponse();
})

describe("users controller: delete user by id",()=>{
    test.only("UserDeleteController function is defined", () => {
        expect(typeof users.UserDeleteController).toBe('function')
    });

    test.only("User.findByIdAndDelete throws exception when user not found", async () => {
        req.params.id = mockUserList[0]._id;
        modelU.findById.mockRejectedValue("fake exception from findbyid");
        const res = {
            send: jest.fn(s => s)
        };
        await users.UserDeleteController(req, res);
        expect(modelU.findById).toHaveBeenCalledWith(req.params.id);
        expect(res.send.mock.calls.length).toEqual(1);
        expect(res.send.mock.calls[0][0]).toEqual('User not found!');
    })

    test("delete a valid user", async () => {
        modelU.findByIdAndDelete.mockResolvedValue(mockUserList[0])
        await users.UserDeleteController(req, res);
        expect(modelP.deleteMany).toBeCalledWith({ username: mockUserList[0].username });
        expect(modelU.findByIdAndDelete).toBeCalledWith("123");
        expect(res.statusCode).toEqual(200);
        expect(res._getJSONData()).toStrictEqual(mockUserList[0])
    });

    // test("return 401 when to be deleted user is not yours", async ()=> {
    //     modelU.findByIdAndDelete.mockResolvedValue(null);
    //     await users.UserDeleteController(req, res);
    //     expect(modelU.findByIdAndDelete).toBeCalledWith("123")
    //     expect(res.statusCode).toBe(404);
    //     expect(res._getJSONData()).toStrictEqual("User Not Found");
        
    // });

    // test("return 500 when model.findByIdAndDelete throw exception ", async () => {
    //     modelU.findByIdAndDelete.mockRejectedValue("fake error from mongoose findByIdAndDelete api");
    //     await users.UserDeleteController(req, res);
    //     expect(res.statusCode).toBe(500);
    //     expect(modelU.findByIdAndDelete).toBeCalledWith("123")
    //     expect(res._getData()).toStrictEqual("fake error from mongoose findByIdAndDelete api");
    //   });



});