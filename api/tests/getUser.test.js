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
        req.params.id = mockUserList[0]._id;
        model.findById.mockReturnValue(mockUserList[0]);
        const { password, ...others } = mockUserList[0];
        await users.UserGetController(req, res);
        expect(model.findById).toHaveBeenCalledWith(req.params.id, {}, {lean:true});
        expect(res.statusCode).toEqual(200);
        expect(res._getJSONData()).toStrictEqual(others);
    })

    test("500 when User.findById throws error", async()=>{
        req.params.id = mockUserList[0]._id;
        model.findById.mockRejectedValue("fake exception from findbyid");
        await users.UserGetController(req, res);
        expect(model.findById).toHaveBeenCalledWith(req.params.id, {}, {lean:true});
        expect(res.statusCode).toEqual(500);
        expect(res._getJSONData()).toStrictEqual("There was an error")
    })

})


