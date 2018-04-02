const { mainRouter } = require('./main');
const { dashboardRouter } = require('./dashboard');
const { webhookRouter } = require('./webhook');

module.exports = {
    mainRouter,
    dashboardRouter,
    webhookRouter,
};
