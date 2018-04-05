const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');

const { indexRouter } = require('./routes/index');
const { dashboardRouter } = require('./routes/dashboard');
const { webhookRouter } = require('./routes/webhook');

module.exports = function () {
	const server = express();

	const create = (config) => {
		// Server setting
		server.set('hostname', config.hostname);
		server.set('env', config.env);
        server.set('port', config.port);
		server.set('viewDir', config.viewDir);

		// Set up view engine
		server.engine('hbs', exphbs({
			layoutsDir: `${config.viewDir}/layouts`,
			partialsDir: `${config.viewDir}/partials`,
			extname: '.hbs',
			defaultLayout: 'main',
		}));
		server.set('views', `${config.viewDir}/pages`);
		server.set('view engine', 'hbs');

		// Middleware
		server.use(express.json());
		server.use(express.urlencoded({ extended: false }));
		server.use(express.static(config.publicDir));
		// Set up routes
		server.use('/', indexRouter);
		server.use('/dashboard', dashboardRouter);
		server.use('/webhook', webhookRouter);

		// Connect mongoDB
		mongoose.connect(config.mongodbUri);
	};

	const start = () => {
		const port = server.get('port');
		const hostname = server.get('hostname');

		server.listen(port, () => {
			console.log(`Server listening - http://${hostname}:${port}`);
		});
	};

	return {
		create,
		start,
	};
};
