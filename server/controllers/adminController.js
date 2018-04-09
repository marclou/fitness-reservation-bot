const _ = require('lodash');
const createError = require('http-errors');
const { Admin } = require('./../models/admin');

module.exports = {
    createOne: (req, res, next) => {
    	const adminToAdd = _.pick(req.body, ['email', 'password']);
    	const adminDoc = new Admin(adminToAdd);

    	adminDoc.save().then((admin) => {
    		if (!admin) {
    			return next(createError(404, 'Can\'t save admin. Verify fields.'));
    		}
    		res.status(200).send({ admin });
    	}).catch((error) => {
    		next(createError(400, error));
    	});
    },

    getLoginForm: (req, res, next) => {
        res.status(200).render('login', { tabTitle: 'Login' });
    },

    getSignUpForm: (req, res, next) => {
        res.status(200).render('signup', { tabTitle: 'Sign-up' });
    },
};
