const express = require('express');

const app = express();
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const multer = require('multer');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');
const postRoute = require('./routes/posts');
const categoryRoute = require('./routes/categories');

async function main() {
  dotenv.config();
  app.use(express.json());
  app.use('/images', express.static(path.join(__dirname, '/images')));

  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: true,
    });
  } catch (err) {
    console.log(err);
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
  app.post('/api/upload', upload.single('file'), (req, res) => {
    res.status(200).json('File has been uploaded');
  });

  const apiPrefix = '/api/';
  app.use(`${apiPrefix}auth`, authRoute);
  app.use(`${apiPrefix}users`, userRoute);
  app.use(`${apiPrefix}posts`, postRoute);
  app.use(`${apiPrefix}categories`, categoryRoute);

  app.listen(13371, '127.0.0.1', () => {
    console.log('Server up');
  });
}

main();
