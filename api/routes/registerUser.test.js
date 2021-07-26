// require("leaked-handles");
var path = require('path');
let auth = require( path.resolve( __dirname, "./auth.js" ) );
const bcrypt = require('bcrypt');
// const mockUser = require('../mockdata/userReqPayload.json')

require("dotenv").config();
const app = require('../index') // Link to server file
// const supertest = require("supertest")
// const request = supertest(app)
const mongoose = require("mongoose");
const model = require("../models/User");

// model.create = jest.fn();
// model.findOne = jest.fn();
// bcrypt.hash = jest.fn();
// bcrypt.genSalt = jest.fn()
// let req , res, next;

beforeAll(done => {
  mongoose.connect(process.env.MONGO_URL,
    { useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: true },
    () => done()
  )
  console.log("connected to Mongo")
});

afterAll(done => {
  // Closing the DB connection allows Jest to exit successfully.
  mongoose.connection.close()
  done()
})


// afterAll(async () => {
//     await mongoose.connection.close();
//   });



// beforeEach(()=>{
//     model.create.mockClear();
//     model.findOne.mockClear();
//     bcrypt.hash.mockClear();
//     bcrypt.genSalt.mockClear();
//     // req = httpMock.createRequest();
//     // res = httpMock.createResponse();
//     // next = null;
//     // // if you set req.body =  . it fails as reference value is getting changed
//     // req.body = {...mockUser}
// })

describe("auth.RegisterPostController",() => {
    test("RegisterPostController function is defined", () => {
        expect(typeof auth.RegisterPostController).toBe('function')
    });

    // test("register a valid user" , async (done) => {
    //     model.create.mockReturnValue(mockUser);
    //     model.findOne.mockReturnValue(false);
    //     bcrypt.hash.mockReturnValue("fakehashstring");
    //     bcrypt.genSalt.mockReturnValue(10);
    //     await auth.RegisterPostController(req, res, next);
    //     expect(res.statusCode).toBe(200);
    //     expect(res._getJSONData()).toStrictEqual(mockUser);
    //     expect(model.create).toBeCalledWith({...mockUser,password: "fakehashstring"});
    //     done();
    // });

    // test("register user which already exists", async ()=>{
    //     model.create.mockReturnValue(mockUser);
    //     model.findOne.mockReturnValue(true);
    //     await auth.RegisterPostController(req, res, next);
    //     expect(res.statusCode).toBe(400);
    //     expect(res._getJSONData()).toStrictEqual('Email you provided already exist in our database');

    // })

    

});