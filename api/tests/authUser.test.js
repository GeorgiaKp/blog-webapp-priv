const auth = require('../routes/auth')
const model = require('../models/User');
const bcrypt = require('bcrypt');
const mockUser = require('./mockdata/userReqPayload.json')
const httpMock = require('node-mocks-http');
const mockUserList = require('./mockdata/users.json')


bcrypt.hash = jest.fn();
bcrypt.genSalt = jest.fn();
bcrypt.compare = jest.fn();
model.findOne = jest.fn();
let req, res;


beforeEach(()=>{
    model.findOne.mockClear();
    bcrypt.hash.mockClear();
    bcrypt.genSalt.mockClear();
    bcrypt.compare.mockClear();
    req = httpMock.createRequest();
    res = httpMock.createResponse();
    req.body = {...mockUser}
})

describe("Register",() => {
    test.only("RegisterPostController function is defined", () => {
        expect(typeof auth.RegisterPostController).toBe('function')
    });

    test("register a valid user" , async () => {
        const hashedPass = "hashedBriePass"; 
        bcrypt.genSalt.mockReturnValue("$2b$10$bfYR1V8/jOPm7tE2QAhmIu");
        bcrypt.hash.mockReturnValue("hashedBriePass");
        const newUser = new model({...req.body, password: hashedPass});
        newUser.save = jest.fn();
        newUser.save.mockReturnValue(new Promise(function(resolve, reject) { setTimeout(() => resolve({...mockUserList[2], password: hashedPass}), 1000); }))
        await auth.RegisterPostController(req, res);
        expect(res.statusCode).toBe(201);
        expect(res._getJSONData()).toStrictEqual({...mockUserList[2], password: hashedPass});
    });

    

    test.only("422 when trying to register user which already exists", async ()=>{
        const newUser = new model(req.body);
        newUser.save = jest.fn();
        newUser.save.mockRejectedValue("fake exception from save");
        await auth.RegisterPostController(req, res);
        expect(res.statusCode).toBe(422);
        expect(res._getJSONData()).toStrictEqual("Couldn't create user");

    })
    
    test.only('return 500 when bcrypt.genSalt rejects', async () => {
      bcrypt.genSalt.mockRejectedValue('Hello from rejected genSalt');
      await auth.RegisterPostController(req, res);
      expect(res.statusCode).toEqual(500);
      expect(res._getJSONData()).toStrictEqual("There was an error!");
  });
    

});

describe("Login",() => {

    test("login a valid user" , async () => {
        req.body.username = mockUser.username;
        const { password, ...others} = mockUserList[2];
        model.findOne.mockReturnValue(mockUserList[2]);
        bcrypt.compare.mockReturnValue(true);
        await auth.LoginPostController(req, res);
        expect(model.findOne).toHaveBeenCalledWith({ username: mockUser.username },{},{lean:true});
        expect(bcrypt.compare).toHaveBeenCalledWith(mockUser.password, mockUserList[2].password)
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(others);
    });
    
    test.only('return 403 when username was not found', async () => {
      req.body.username = "MpleTuri";
      model.findOne.mockReturnValue(false);
      bcrypt.compare.mockRejectedValue('Hello from rejected compare');
      await auth.LoginPostController(req, res);
      expect(model.findOne).toHaveBeenCalledWith({ username: "MpleTuri" },{},{lean:true});
      expect(res.statusCode).toEqual(403);
      expect(res._getJSONData()).toStrictEqual("Wrong credentials!");
  });

    test.only('return 403 when username exists but password is wrong', async () => {
      req.body.username = mockUser.username;
      req.body.password = "wrongpass"
      model.findOne.mockReturnValue(mockUserList[2]);
      bcrypt.compare.mockReturnValue(false);
      await auth.LoginPostController(req, res);
      expect(model.findOne).toHaveBeenCalledWith({ username: mockUser.username },{},{lean:true});
      expect(bcrypt.compare).toHaveBeenCalledWith("wrongpass", mockUserList[2].password)
      expect(res.statusCode).toEqual(403);
      expect(res._getJSONData()).toStrictEqual("Wrong credentials!");
  });

    test('return 500 when bcrypt.compare rejects', async () => {
      req.body.username = mockUser.username;
      model.findOne.mockReturnValue(mockUserList[2]);
      bcrypt.compare.mockRejectedValue('Hello from rejected compare');
      await auth.LoginPostController(req, res);
      expect(model.findOne).toHaveBeenCalledWith({ username: mockUser.username },{},{lean:true});
      expect(bcrypt.compare).toHaveBeenCalledWith(mockUser.password, mockUserList[2].password)
      expect(res.statusCode).toEqual(500);
      expect(res._getJSONData()).toStrictEqual("There was an error");
  });
});