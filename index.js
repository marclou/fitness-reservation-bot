const server = require('./server')();
const config = require('./config');

server.create(config);
server.start();
