const path = require('path');

const prodConfig = {
    hostname: 'heroku',
    port: process.env.PORT,
    mongodbUri: process.env.MONGODB_URI,
    viewDir: path.join(__dirname, '..', '/views'),
    publicDir: path.join(__dirname, '..', '/public'),
};

module.exports = prodConfig;
