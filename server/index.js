const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');

module.exports = function () {
	const server = express();

	const create = (config) => {
		const routes = require('./routes');

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
		server.use(['/dashboard/workout', '/dashboard/broadcast'], express.static(config.publicDir));

		// Set up routes
		routes.init(server);

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
