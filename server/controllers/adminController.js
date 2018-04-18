const _ = require('lodash');
const createError = require('http-errors');
const { Admin } = require('./../models/index');

module.exports = {
    getLoginForm: (req, res, next) => {
        res.status(200).render('login', { tabTitle: 'Login' });
    },

    getSignUpForm: (req, res, next) => {
        res.status(200).render('signup', { tabTitle: 'Sign-up' });
    },

    createOne: (req, res, next) => {
    	const adminToAdd = _.pick(req.body, ['email', 'password']);
    	const adminDoc = new Admin(adminToAdd);

    	adminDoc.save()
        .then((admin) => {
    		if (!admin) {
    			return next(createError(404, 'Can\'t save admin. Verify fields.'));
    		}
            return admin.generateAuthToken();
    	})
        .then((token) => {
            res.cookie('token', token).status(200).redirect('/dashboard/workout');
        })
        .catch((error) => {
    		next(createError(400, error));
    	});
    },

    login: (req, res, next) => {
        Admin.findByCreditentials(req.body.email, req.body.password).then((admin) => {
            return admin.generateAuthToken().then((token) => {
                res.cookie('token', token).status(200).redirect('/dashboard/workout');
            });
        }).catch((error) => {
            next(createError(401, error));
        });
    },

    logout: (req, res, next) => {
        const { token } = req.cookies;

        // Logging out erase all tokens so far. Need to be improved later.
        Admin.findByToken(token).then((admin) => {
            return admin.update({ tokens: [] }).then(() => {
                res.redirect('/dashboard');
            });
        }).catch((error) => {
            next(createError(401, error));
        });
    },

    authenticate: (req, res, next) => {
        const { token } = req.cookies;

        Admin.findByToken(token).then((admin) => {
            if (!admin) {
                return Promise.reject(new Error('Admin not found, verify token.'));
            }
            req.admin = admin;
            next();
        }).catch((error) => {
            next(createError(401, 'Must be authenticated'));
        });
    },
};
