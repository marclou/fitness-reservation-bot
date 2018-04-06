const express = require('express');
const _ = require('lodash');
const { ObjectId } = require('mongodb');
const { Workout, Gym } = require('./../models/index');

const router = express.Router();

router.get('/', (req, res) => {
    Workout.find({ date: { $gte: Date.now() } }).then((workouts) => {
		if (!workouts) {
			return res.status(404).send({ error: 'No up-coming workout found' });
		}
		res.render('dashboard', {
            workouts,
        });
	}).catch((error) => {
		res.status(400).send({ error });
	});
});

router.get('/workout', (req, res) => {
    Gym.find({}).then((gyms) => {
		if (!gyms) {
			return res.status(404).send({ error: 'No gyms added yet.' });
		}
        res.render('workoutForm', {
            tabTitle: 'Add Workout',
            gyms,
        });
    }).catch((error) => {
        res.status(400).send({ error });
    });
});

router.post('/workout', (req, res) => {
    if (!req.body.data) {
        return res.status(404).send({ error: 'Please fill-in the workout' });
    }
	const workoutToAdd = _.pick(JSON.parse(req.body.data), ['name', 'location', 'duration', 'cost', 'date', 'miscellaneous']);
	const workoutDoc = new Workout(workoutToAdd);

	workoutDoc.save().then((workout) => {
        if (!workout) {
            return res.status(404).send({ error: 'Invalid workout information' });
        }
        res.redirect(`/workout/${workout._id}`);
	}).catch((error) => {
        res.render('error', {
            pageTitle: 'Error',
            error,
        });
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
		res.render('workoutDetail', {
            tabTitle: 'Workout Details',
            workout,
        });
	})
	.catch((error) => {
		res.status(400).send({ error });
	});
});

router.get('/broadcast', (req, res) => {
  res.render('broadcast', { tabTitle: 'Broacast' });
});

module.exports = {
    indexRouter: router,
};
