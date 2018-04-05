const prodConfig = {
    hostname: 'heroku',
    port: process.env.PORT,
    mongodbUri: process.env.MONGODB_URI,
    viewDir: './views',
    publicDir: './public',
};

module.exports = prodConfig;
