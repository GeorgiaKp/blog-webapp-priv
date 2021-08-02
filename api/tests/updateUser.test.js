const users = require('../routes/users')
const modelU = require('../models/User');
const modelP = require('../models/Post');
const httpMock = require('node-mocks-http');
const mockUserList = require('./mockdata/users.json')
const bcrypt = require("bcrypt");

modelU.findByIdAndUpdate = jest.fn();
modelU.findById = jest.fn();
modelP.updateMany = jest.fn();
jest.mock('bcrypt');
let req, res;

beforeEach(()=>{
    req = httpMock.createRequest();
    res = httpMock.createResponse();
})
describe("users controller: update user by id",()=>{
    test.only("findByIdAndUpdate function is defined", ()=> {
        expect(typeof users.UserUpdateController).toBe('function')
    }); 

    test("update an existing user", async () => {
        req.params.id = mockUserList[1]._id;
        req.body.userId = mockUserList[1]._id;
        req.body.password = "1234567"
        let toUpdate = {...mockUserList[1], email:"ianni@gmail.com"};
        const {_id , ...others} = toUpdate
        let toUpdate2 = {...others, userId:"60f3f1a9a5d6231bac0615a3"}
        let updatedPosts = { n: 1, nModified: 1, ok: 1 };
        modelU.findByIdAndUpdate.mockReturnValue(toUpdate);
        modelP.updateMany.mockReturnValue(updatedPosts)
        await users.UserUpdateController(req, res);
        expect(req.params.id).toEqual(req.body.userId)
        expect(modelU.findByIdAndUpdate).toHaveBeenCalledWith(
            req.params.id,
            {
              $set: toUpdate2,
            }
        );
        expect(res.statusCode).toEqual(200);
        expect(res._getJSONData()).toStrictEqual(toUpdate2);
    });

    test("return 401 when attempting to update not your account", async ()=>{
        req.params.id = mockUserList[0]._id;
        req.body.userId = mockUserList[1]._id;
        await users.UserUpdateController(req, res);
        expect(req.params.id).not.toEqual(req.body.userId)
        expect(res.statusCode).toEqual(401);
        expect(res._getJSONData()).toStrictEqual("You can update only your account!")

    });

    test("return 403 when attempting to update with weak password", async ()=>{
        req.params.id = mockUserList[0]._id;
        req.body.userId = mockUserList[0]._id;
        req.body.password = "123"
        await users.UserUpdateController(req, res);
        expect(req.params.id).toEqual(req.body.userId)
        expect(res.statusCode).toEqual(403);
        expect(req.body.password.length).not.toBeGreaterThanOrEqual(6)
        expect(res._getJSONData()).toStrictEqual("You need a password with 6+ characters")

    });

    test.only("return 404 when couldn't find user to be updated", async ()=>{
        modelU.findById.mockRejectedValue("fake error");
        await users.UserUpdateController(req, res);
        expect(res.statusCode).toEqual(404);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual("User not found!");
    })

    test("return 500 when findByIdAndUpdate raise exception", async ()=>{
        req.params.id = mockUserList[0]._id;
        modelU.findByIdAndUpdate.mockRejectedValue("fake error");
        await users.UserUpdateController(req, res);
        expect(res.statusCode).toEqual(500);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual("There was an error");
    })

    
    test('return 500 when bcrypt.genSalt rejects', async () => {
      req.params.id = mockUserList[0]._id;
      req.body.userId = mockUserList[0]._id;
      req.body.password = "1234567"
      modelU.findById.mockReturnValue(mockUserList[0]);
      bcrypt.genSalt.mockRejectedValue('Hello from rejected genSalt');
      await users.UserUpdateController(req, res);
      expect(res.statusCode).toEqual(500);
      expect(res._getJSONData()).toStrictEqual("There was an error!");
  });
  

});