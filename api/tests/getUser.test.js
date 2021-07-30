const users = require('../routes/users')
const model = require('../models/User');
const httpMock = require('node-mocks-http');
const mockUserList = require('./mockdata/users.json')

model.findById = jest.fn();
let req, res;

beforeEach(()=>{
    req = httpMock.createRequest();
    res = httpMock.createResponse();
});

afterEach(()=>{
    model.findById.mockClear();
});

describe("users controller: get user by id",()=>{
    test("UserGetController function is defined", () => {
        expect(typeof users.UserGetController).toBe('function')
    });

    test("return a user by id", async () => {
        req.params.id = mockUserList[0]._doc._id;
        model.findById.mockReturnValue(mockUserList[0]);
        await users.UserGetController(req, res);
        expect(model.findById).toHaveBeenCalledWith(req.params.id);
        expect(res.statusCode).toBe(200);
        const { password, ...others } = mockUserList[0]._doc;
        expect(res._getJSONData()).toStrictEqual(others);
    })

    test("User.findById throws exception when needed", async()=>{
        req.params.id = mockUserList[0]._id;
        model.findById.mockRejectedValue("fake exception from findbyid");
        const res = {
            send: jest.fn(s => s)
        };
        await users.UserGetController(req, res);
        expect(model.findById).toHaveBeenCalledWith(req.params.id);
        expect(res.send.mock.calls.length).toEqual(1);
        expect(res.send.mock.calls[0][0]).toEqual('There was an error');
    })

})


