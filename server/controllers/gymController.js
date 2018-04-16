const _ = require('lodash');
const createError = require('http-errors');
const { Gym } = require('./../models/index');

module.exports = {
    list: (req, res, next) => {
    	Gym.find({}).then((gyms) => {
    		res.render('nameToUrlList', {
                tabTitle: 'Gyms',
                listName: 'Existing Gyms',
                items: gyms,
            });
    	}).catch((error) => {
    		next(createError(400, error));
    	});
    },

    details: (req, res, next) => {
        const gymID = req.params.id;

    	Gym.findById(gymID)
    	.then((gym) => {
    		if (!gym) {
				return next(createError(404, 'Gym not found, verify ID'));
    		}
    		res.render('gymDetails', {
                tabTitle: 'Gym Details',
                gym,
             });
    	})
    	.catch((error) => {
			next(createError(400, error));
    	});
    },

    getCreateForm: (req, res, next) => {
        res.render('gymForm', { tabTitle: 'Add Gym' });
    },

    createOne: (req, res, next) => {
        if (!req.body.data) {
            return next(createError(404, 'Please, fill-in the form'));
        }
    	const gymToAdd = _.pick(JSON.parse(req.body.data), ['name', 'address', 'maxAttendance', 'facilities']);
    	const gymDoc = new Gym(gymToAdd);

    	gymDoc.save().then((gym) => {
    		if (!gym) {
    			return next(createError(404, 'Can\'t save gym. Verify fields.'));
    		}
    		res.redirect(gym.url);
    	}).catch((error) => {
    		next(createError(400, error));
    	});
    },

    deleteOne: (req, res, next) => {
    	const gymID = req.params.id;

    	Gym.findByIdAndRemove(gymID).then((gym) => {
    		if (!gym) {
    			return next(createError(404, 'Gym not found, verify ID'));
    		}
    		res.status(200).send();
    	}).catch((error) => {
    		next(createError(400, error));
    	});
    },
};
