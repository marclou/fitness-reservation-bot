const _ = require('lodash');
const createError = require('http-errors');
const { Gym } = require('./../models/index');

module.exports = {
    list: (req, res, next) => {
    	Gym.find({}).then((gyms) => {
    		if (!gyms) {
    			return next(createError(404, 'No gym added yet'));
    		}
    		res.status(200).send({ gyms });
    	}).catch((error) => {
    		next(createError(400, error));
    	});
    },

    createOne: (req, res, next) => {
    	const gymToAdd = _.pick(req.body, ['name', 'address', 'maxAttendance', 'facilities']);
    	const gymDoc = new Gym(gymToAdd);

    	gymDoc.save().then((gym) => {
    		if (!gym) {
    			return next(createError(404, 'Can\'t save gym. Verify fields.'));
    		}
    		res.status(200).send({ gym });
    	}).catch((error) => {
    		next(createError(400, error));
    	});
    },
};
