require('./config/config');
require('./db/mongoose');

const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const { indexRouter } = require('./routes/index');
const { dashboardRouter } = require('./routes/dashboard');
const { webhookRouter } = require('./routes/webhook');

const app = express();
const { PORT, MONGODB_URI } = process.env;
const publicPath = path.join(__dirname, '../', 'public');
const viewsPath = path.join(__dirname, '../', 'views/');

app.engine('hbs', exphbs({
	layoutsDir: `${viewsPath}/layouts`,
	partialsDir: `${viewsPath}/partials`,
	extname: '.hbs',
	defaultLayout: 'main',
}));
app.set('views', `${viewsPath}/pages`);
app.set('view engine', 'hbs');

app.use(express.json());
app.use(express.urlencoded({
	extended: false,
}));
app.use(express.static(publicPath));
app.use('/', indexRouter);
app.use('/dashboard', dashboardRouter);
app.use('/webhook', webhookRouter);

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}. \nMongoDB URI is : ${MONGODB_URI}`);
});

module.exports = {
	app,
};
