const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon');

module.exports = function () {
	const server = express();

	const create = (config) => {
		const routes = require('./routes');

		// Server setting
		server.set('hostname', config.hostname);
		server.set('env', config.env);
        server.set('port', config.port);
		server.set('viewDir', config.viewDir);
		// server.enable('strict routing');

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
		server.use(cookieParser());
		server.use(express.urlencoded({ extended: false }));
		server.use(favicon(`${config.publicDir}/images/favicon/favicon.ico`));

		// Set up routes
		routes.init(server);

		// Errors handler
		server.use((err, req, res, next) => {
		  res.locals.message = err.message;
		  res.locals.error = req.app.get('env') === 'development' ? err : {};
		  if (err.status === 401) {
			  return res.render('welcome');
		  }

		  res.status(err.status || 500);
		  res.render('error', { pageTitle: `Error ${err.status}`, error: err.message });
		});

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
