const express = require('express');
const { ObjectId } = require('mongodb');

const { Workout } = require('./../models/index');

const router = express.Router();

router.use(express.json());

router.get('/', (req, res) => {
	Workout.find({ date: { $gte: Date.now() } }).populate('location').then((workouts) => {
		if (workouts) {
			res.status(200).send({ workouts });
		}
		return res.status(404).send({ error: 'No up-coming workout found' });
	}).catch((error) => {
		res.status(400).send({ error });
	});
});

router.post('/workout', (req, res) => {
	const {
		name,
		location,
		duration,
		cost,
		date,
		miscellaneous,
	} = req.body;

	const workoutDoc = new Workout({
		name,
		location,
		duration,
		cost,
		date,
		miscellaneous,
	});

	workoutDoc.save().then((workout) => {
		res.status(200).send({ workout });
	}).catch((error) => {
		res.status(400).send({ error });
	});
});

router.delete('/workout/:id', (req, res) => {
	const workoutIdToDelete = req.params.id;

	if (!ObjectId.isValid(workoutIdToDelete)) {
		return res.status(404).send({ error: 'Invalid user ID' });
	}

	Workout.findByIdAndRemove(workoutIdToDelete).then((workout) => {
		if (workout) {
			return res.status(200).send({ workout });
		}
		res.status(404).send({ error: 'Workout doesn\'t exist' });
	}).catch((error) => {
		res.status(400).send({ error });
	});
});

module.exports = {
    dashboardRouter: router,
};
