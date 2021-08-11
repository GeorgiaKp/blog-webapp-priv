const mongoose = require("mongoose");

const teardown = () =>{
  afterAll(done => {
    mongoose.connection.close()
    console.log("disconnected from Mongo")
    done()
  })
}

module.exports = teardown;
