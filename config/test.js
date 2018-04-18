const path = require('path');

const testConfig = {
    hostname: 'localhost',
    port: 3000,
    mongodbUri: 'mongodb://localhost:27017/WonjiFitTest',
    viewDir: path.join(__dirname, '../../', '/views'),
    publicDir: path.join(__dirname, '../../', '/public'),
};

module.exports = testConfig;
