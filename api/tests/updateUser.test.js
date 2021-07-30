const users = require('../routes/users')
const model = require('../models/User');
const httpMock = require('node-mocks-http');
const mockUserList = require('./mockdata/users.json')

model.findByIdAndUpdate = jest.fn();
let req, res;

beforeEach(()=>{
    req = httpMock.createRequest();
    res = httpMock.createResponse();
})
describe("users controller: update user by id",()=>{
    test.only("findByIdAndUpdate function is defined", ()=> {
        expect(typeof users.UserUpdateController).toBe('function')
    }); 

    test.only("update an exisitng user", async () => {
        req.params.id = mockUserList[1]._doc._id;
        req.body.userId = mockUserList[1]._doc._id;
        console.log( req.body.userId)
        let toUpdate = {...mockUserList[1]._doc, email:"ianni@gmail.com"};
        req.body = {...toUpdate};
        console.log( req.body.userId)
        console.log(req.body._id)
        console.log(req.body)
        model.findByIdAndUpdate.mockReturnValue(toUpdate);
        await users.UserUpdateController(req, res);
        expect(req.params.id).toEqual(req.body.userId)
        expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
            req.params.id,
            {
              $set: req.body,
            },
            { new: true }
        );
        expect(res.statusCode).toEqual(200);
        expect(res._getJSONData()).toStrictEqual(toUpdate);
    });
    test("return 401 when attempting to update not your account", async ()=>{
        req.params.id = mockUserList[0]._doc._id;
        req.body.userId = mockUserList[1]._doc._id;
        await users.UserUpdateController(req, res);
        expect(req.params.id).not.toEqual(req.body.userId)
        expect(res.statusCode).toEqual(401);
        expect(res._getJSONData()).toStrictEqual("You can update only your account!")

    });
    // test("return error when findByIdAndUpdate raise exception", async ()=>{
    //     model.findByIdAndUpdate.mockRejectedValue("fake error");
    //     await users.UserUpdateController(req, res);
    //     expect(res.statusCode).toEqual(500);
    //     expect(res._isEndCalled()).toBeTruthy();
    //     expect(res._getJSONData()).toStrictEqual("fake error");

    // })
});