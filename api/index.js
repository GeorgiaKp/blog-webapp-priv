const dotenv = require('dotenv');
const AppServer = require('./appServer')

dotenv.config();

const PORT = process.env.port || 5000;
const appServer = new AppServer(PORT);
appServer.run()



