const dotenv = require('dotenv');
const AppServer = require('./appServer')

dotenv.config();

const PORT = process.env.port || 5000;
const MONGO_URL = process.env.mongo_url;
const HOST = '127.0.0.1';
const appServer = new AppServer(PORT, MONGO_URL, HOST);

async function Main() {
  let message;
  message = await appServer.runMongo();
  console.log(message);
  message = await appServer.runApp();
  console.log(message);
}
Main();
