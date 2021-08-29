const dotenv = require('dotenv');

const mongoose = require("mongoose");

const setup = () => {
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
}

module.exports = setup;