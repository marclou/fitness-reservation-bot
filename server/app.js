require('./config/config');
require('./db/mongoose');

const express = require('express');
const { mainRouter, dashboardRouter, webhookRouter } = require('./routes/index');

const app = express();
const { PORT, MONGODB_URI } = process.env;

app.use('/', mainRouter);
app.use('/dashboard', dashboardRouter);
app.use('/webhook', webhookRouter)

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}. \nMongoDB URI is : ${MONGODB_URI}`);
});

module.exports = {
	app,
};
