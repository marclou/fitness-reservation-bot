const _ = require('lodash');
const { Workout, Gym } = require('./../models/index');

module.exports = {
	list: (req, res) => {
		Workout.find({ date: { $gte: Date.now() } }).then((workouts) => {
			if (!workouts) {
				return res.status(404).send({ error: 'No up-coming workout found' });
			}
			res.render('dashboard', { workouts });
		}).catch((error) => {
			res.status(400).send({ error });
		});
	},

    details: (req, res) => {
        const workoutID = req.params.id;

    	Workout.findById(workoutID).populate('location').populate('attendants').populate('guests')
    	.then((workout) => {
    		if (!workout) {
    			return res.status(404).send({ error: 'Workout not found. Verify the ID.' });
    		}
    		res.render('workoutDetail', { tabTitle: 'Workout Details', workout });
    	})
    	.catch((error) => {
    		res.status(400).send({ error });
    	});
    },

    getCreateForm: (req, res) => {
        Gym.find({}).then((gyms) => {
    		if (!gyms) {
    			return res.status(404).send({ error: 'No gyms added yet.' });
    		}
            res.render('workoutForm', { tabTitle: 'Add Workout', gyms });
        }).catch((error) => {
            res.status(400).send({ error });
        });
    },

    createOne: (req, res) => {
        if (!req.body.data) {
            return res.status(404).send({ error: 'Please fill-in the workout' });
        }
    	const workoutToAdd = _.pick(JSON.parse(req.body.data), ['name', 'location', 'duration', 'cost', 'date', 'miscellaneous']);
    	const workoutDoc = new Workout(workoutToAdd);

    	// verify location._id is valid and exist

    	workoutDoc.save().then((workout) => {
            if (!workout) {
                return res.status(404).send({ error: 'Invalid workout information' });
            }
            res.redirect(`/dashboard/workout/${workout._id}`);
    	}).catch((error) => {
            res.render('error', { pageTitle: 'Error', error });
    	});
    },

    updateOne: (req, res) => {
    	const workoutID = req.params.id;
    	const workoutUpdated = _.pick(req.body, ['name', 'location', 'duration', 'cost', 'date', 'miscellaneous']);

    	Workout.findByIdAndUpdate(workoutID, workoutUpdated, {
    		new: true,
    		runValidators: true,
    	}).then((workout) => {
    		if (!workout) {
    			return res.status(404).send({ error: 'Workout not found. Verify the ID.' });
    		}
    		res.status(200).send({ workout: workout.toJSON() });
    	}).catch((error) => {
    		res.status(400).send({ error });
    	});
    },

    deleteOne: (req, res) => {
    	const workoutID = req.params.id;

    	Workout.findByIdAndRemove(workoutID).then((workout) => {
    		if (!workout) {
    			return res.status(404).send({ error: 'Workout not found. Verify the ID.' });
    		}
    		res.status(200).send({ workout: workout.toJSON() });
    	}).catch((error) => {
    		res.status(400).send({ error });
    	});
    },

};
