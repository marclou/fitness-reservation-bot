const express = require('express');
const { ObjectId } = require('mongodb');
const _ = require('lodash');

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

router.get('/workout/:id', (req, res) => {
	const workoutID = req.params.id;

	if (!ObjectId.isValid(workoutID)) {
		return res.status(404).send({ error: 'Invalid workout ID' });
	}

	Workout.findById(workoutID).populate('location').then((workout) => {
		if (workout) {
			res.status(200).send({ workout: workout.toJSON() });
		}
		return res.status(404).send({ error: 'Error with workout' });
	}).catch((error) => {
		res.status(400).send({ error });
	});
});

router.post('/workout', (req, res) => {
	const workoutToAdd = _.pick(req.body, ['name', 'location', 'duration', 'cost', 'date', 'miscellaneous']);
	const workoutDoc = new Workout(workoutToAdd);

	workoutDoc.save().then((workout) => {
		res.status(200).send({ workout: workout.toJSON() });
	}).catch((error) => {
		res.status(400).send({ error });
	});
});

router.delete('/workout/:id', (req, res) => {
	const workoutID = req.params.id;

	if (!ObjectId.isValid(workoutID)) {
		return res.status(404).send({ error: 'Invalid workout ID' });
	}

	Workout.findByIdAndRemove(workoutID).then((workout) => {
		if (workout) {
			return res.status(200).send({ workout: workout.toJSON() });
		}
		res.status(404).send({ error: 'Workout doesn\'t exist' });
	}).catch((error) => {
		res.status(400).send({ error });
	});
});

router.patch('/workout/:id', (req, res) => {
	const workoutID = req.params.id;
	const workoutUpdated = _.pick(req.body, ['name', 'location', 'duration', 'cost', 'date', 'miscellaneous']);

	if (!ObjectId.isValid(workoutID)) {
		return res.status(404).send({ error: 'Invalid workout ID' });
	}

	Workout.findByIdAndUpdate(workoutID, workoutUpdated, { new: true, runValidators: true }).then((workout) => {
		res.status(200).send({ workout: workout.toJSON() });
	}).catch((error) => {
		res.status(400).send({ error });
	});
});

module.exports = {
    dashboardRouter: router,
};
