const path = require('path');

const devConfig = {
    hostname: 'localhost',
    port: 3000,
    mongodbUri: 'mongodb://localhost:27017/WonjiFit',
    viewDir: path.join(__dirname, '..', '/views'),
    publicDir: path.join(__dirname, '..', '/public'),
};

module.exports = devConfig;
