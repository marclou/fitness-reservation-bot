const express = require('express');
const { ObjectId } = require('mongodb');
const _ = require('lodash');
const { Workout, Gym } = require('./../models/index');

const router = express.Router();

router.get('/workout/list', (req, res) => {
	Workout.find({ date: { $gte: Date.now() } }).then((workouts) => {
		if (!workouts) {
			return res.status(404).send({ error: 'No up-coming workout found' });
		}
		res.status(200).send({ workouts });
	}).catch((error) => {
		res.status(400).send({ error });
	});
});

router.get('/workout/:id', (req, res) => {
	const workoutID = req.params.id;

	if (!ObjectId.isValid(workoutID)) {
		return res.status(404).send({ error: 'Invalid workout ID' });
	}

	Workout.findById(workoutID).populate('location').populate('attendants').populate('guests')
	.then((workout) => {
		if (!workout) {
			return res.status(404).send({ error: 'Workout not found. Verify the ID.' });
		}
		res.status(200).send({ workout });
	})
	.catch((error) => {
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
		if (!workout) {
			return res.status(404).send({ error: 'Workout not found. Verify the ID.' });
		}
		res.status(200).send({ workout: workout.toJSON() });
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
		if (!workout) {
			return res.status(404).send({ error: 'Workout not found. Verify the ID.' });
		}
		res.status(200).send({ workout: workout.toJSON() });
	}).catch((error) => {
		res.status(400).send({ error });
	});
});

router.get('/gym', (req, res) => {
	Gym.find({}).then((gyms) => {
		if (!gyms) {
			return res.status(404).send({ error: 'No gyms added yet.' });
		}
		res.status(200).send({ gyms });
	}).catch((error) => {
		res.status(400).send({ error });
	});
});

router.post('/gym', (req, res) => {
	const gymToAdd = _.pick(req.body, ['name', 'address', 'maxAttendance', 'facilities']);
	const gymDoc = new Gym(gymToAdd);

	gymDoc.save().then((gym) => {
		if (!gym) {
			return res.status(404).send({ error: 'Can\'t save gym' });
		}
		res.status(200).send({ gym });
	}).catch((error) => {
		res.status(400).send({ error });
	});
});

module.exports = {
    dashboardRouter: router,
};
