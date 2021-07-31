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
  constructor(serverPort) {
    this._app = express();
    this._port = serverPort;
    this._authRoute = authRoute;
    this._userRoute = userRoute;
    this._postRoute = postRoute;
    this._categoryRoute = categoryRoute;
  }

  async run() {
    dotenv.config();
    this._app.use(express.json());
    this._app.use('/images', express.static(path.join(__dirname, '/images')));
    try {
      await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: true,
      });
    } catch (err) {
      console.log(err);
      return;
    }
    console.log('Connected to MongoDB');     

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

    const apiPrefix = '/api/';
    this._app.use(`${apiPrefix}auth`, this._authRoute);
    this._app.use(`${apiPrefix}users`, this._userRoute);
    this._app.use(`${apiPrefix}posts`, this._postRoute);
    this._app.use(`${apiPrefix}categories`, this._categoryRoute);

    return new Promise((resolve, reject) => {
      this._server = this._app.listen(this._port, '127.0.0.1', () => resolve('Server starts listening'));
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

