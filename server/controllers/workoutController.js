const _ = require('lodash');
const createError = require('http-errors');
const { Workout, Gym } = require('./../models/index');

module.exports = {
	list: (req, res, next) => {
		Workout.find({ date: { $gte: Date.now() } }).then((workouts) => {
			res.render('nameToUrlList', {
				tabTitle: 'Workouts',
				listName: 'Up-coming Workouts',
				items: workouts,
			});
		}).catch((error) => {
			next(createError(400, error));
		});
	},

    details: (req, res, next) => {
        const workoutID = req.params.id;

    	Workout.findById(workoutID).populate('location').populate('attendants').populate('guests')
    	.then((workout) => {
    		if (!workout) {
				return next(createError(404, 'Workout not found, verify ID'));
    		}
    		res.render('workoutDetail', { tabTitle: 'Workout Details', workout });
    	})
    	.catch((error) => {
			next(createError(400, error));
    	});
    },

    getCreateForm: (req, res, next) => {
        Gym.find({}).then((gyms) => {
    		if (gyms.length === 0) {
    			return next(createError(404, 'No gyms added yet.'));
    		}
            res.render('workoutForm', { tabTitle: 'Add Workout', gyms });
        }).catch((error) => {
            next(createError(400, error));
        });
    },

    createOne: (req, res, next) => {
        if (!req.body.data) {
            return next(createError(404, 'Please, fill-in the form'));
        }
    	const workoutToAdd = _.pick(JSON.parse(req.body.data), ['name', 'location', 'duration', 'cost', 'date', 'miscellaneous']);
    	const workoutDoc = new Workout(workoutToAdd);

    	workoutDoc.save().then((workout) => {
            if (!workout) {
                return next(createError(404, 'Invalid Workout information'));
            }
            res.redirect(workout.url);
    	}).catch((error) => {
            next(createError(400, error));
    	});
    },

    updateOne: (req, res, next) => {
    	const workoutID = req.params.id;
    	const workoutUpdated = _.pick(req.body, ['name', 'location', 'duration', 'cost', 'date', 'miscellaneous']);

    	Workout.findByIdAndUpdate(workoutID, workoutUpdated, {
    		new: true,
    		runValidators: true,
    	}).then((workout) => {
    		if (!workout) {
    			return next(createError(404, 'Workout not found, verify ID'));
    		}
    		res.status(200).send({ workout: workout.toJSON() });
    	}).catch((error) => {
    		next(createError(400, error));
    	});
    },

    deleteOne: (req, res, next) => {
    	const workoutID = req.params.id;

    	Workout.findByIdAndRemove(workoutID).then((workout) => {
    		if (!workout) {
    			return next(createError(404, 'Workout not found, verify ID'));
    		}
    		res.status(200).send();
    	}).catch((error) => {
    		next(createError(400, error));
    	});
    },

};
