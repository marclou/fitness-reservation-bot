const router = require('express').Router();

const { Workout } = require('./../models/index');

router.get('/', (req, res) => {
	Workout.find({}).populate('location').then((workouts) => {
		res.status(200).send({ workouts });
	}).catch((error) => {
		res.status(404).send({ error });
	});
});

module.exports = {
    dashboardRouter: router,
};
