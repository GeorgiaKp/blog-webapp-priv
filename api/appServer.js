const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const multer = require('multer');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');
const postRoute = require('./routes/posts');
const categoryRoute = require('./routes/categories');


class AppServer {

  
  constructor(serverPort, mongoURL, host) {
    this._app = express();
    this._port = serverPort;
    this._mongoURL = mongoURL;
    this._localhost = host;
    this._authRoute = authRoute;
    this._userRoute = userRoute;
    this._postRoute = postRoute;
    this._categoryRoute = categoryRoute;

    dotenv.config();
    this._app.use(express.json());
    this._app.use('/images', express.static(path.join(__dirname, '/images')));
    
    const apiPrefix = '/api/';
    this._app.use(`${apiPrefix}auth`, this._authRoute.router);
    this._app.use(`${apiPrefix}users`, this._userRoute.router);
    this._app.use(`${apiPrefix}posts`, this._postRoute.router);
    this._app.use(`${apiPrefix}categories`, this._categoryRoute.router);
  }

  async runMongo() {
    
    try {
      await mongoose.connect(this._mongoURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: true,
      });
    } catch (err) {
      console.log(err);
      return;
    }
    return('Connected to MongoDB');   
  }

  async runApp() {
    const storage = multer.diskStorage({
      destination: (req, file, callback) => {
        callback(null, 'images');
      },
      filename: (req, file, callback) => {
        callback(null, req.body.name);
      },
    });

    const upload = multer({ storage });
    this._app.post('/api/upload', upload.single('file'), (req, res) => {
      res.status(200).json('File has been uploaded');
    });

    return new Promise((resolve, reject) => {
      this._server = this._app.listen(this._port, this._localhost, () => resolve('Server starts listening'));
    });
  }

  async stop() {
    try {
      await mongoose.connection.close()
      } catch (err) {
      console.log(err);
      return;
    }
    console.log('Closed connection to MongoDB'); 

    try {
      await this._server.close()
    } catch (err) {
      console.log(err);
      return;
    }
    console.log('Closed server');
  }

}
module.exports = AppServer;

