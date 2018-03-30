require('./config/config');

const mongoose = require('./db/mongoose');
const express = require('express');

const {
	Gym,
	Workout,
} = require('./models/index');

const app = express();
const { PORT, MONGODB_URI } = process.env;

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}. \nMongoDB URI is : ${MONGODB_URI}`);
});

module.exports = {
	app,
};
