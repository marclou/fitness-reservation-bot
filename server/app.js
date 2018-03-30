require('./config/config');
const mongoose = require('./db/mongoose');
const express = require('express');

const {
	Gym,
	Workout,
} = require('./models/index');

const app = express();
const { PORT } = process.env;

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});

module.exports = {
	app,
};
