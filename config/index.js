/*eslint-disable*/
const _ = require('lodash');

/**
 * Global environement variable.
 * = 'production' on heroku server,
 * = 'test' when running npm test scripts,
 * = 'development' by default.
 */
const env = process.env.NODE_ENV || 'development';
const defaultConfig = {
    env,
};
const envConfig = require(`./${env}`);
const secretConfig = require('./secret')

/**
 * Set up some local environement variables such as mongodb URI.
 * Done by default on production environement. cf. env.json for the variables.
 */
if (env === 'development' || env === 'test') {
    process.env.MONGODB_URI = envConfig.mongodbUri;
}

// Set up the env variable to the credentials for using dialoigflow.
process.env.GOOGLE_APPLICATION_CREDENTIALS = secretConfig.DIALOGFLOW_CREDENTIALS_PATH;

module.exports = _.merge(defaultConfig, envConfig, secretConfig);
