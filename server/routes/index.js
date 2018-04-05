const { indexRouter } = require('./main');
const { dashboardRouter } = require('./dashboard');
const { webhookRouter } = require('./webhook');

const init = (server) => {
    server.use('/', indexRouter);
    server.use('/dashboard', dashboardRouter);
    server.use('/webhook', webhookRouter);
};

module.exports = {
    init,
};
