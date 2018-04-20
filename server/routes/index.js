const { mainRouter } = require('./mainRoute');
const { dashboardRouter } = require('./dashboard/index');
const { webhookRouter } = require('./webhookRoute');

const init = (server) => {
    server.use('/', mainRouter);
    server.use('/dashboard', dashboardRouter);
    server.use('/webhook', webhookRouter);
};

module.exports = {
    init,
};
