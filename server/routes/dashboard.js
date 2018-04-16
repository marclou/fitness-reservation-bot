const express = require('express');
const { ObjectId } = require('mongodb');
const createError = require('http-errors');
const workoutController = require('../controllers/workoutController');
const gymController = require('../controllers/gymController');
const broadcastController = require('../controllers/broadcastController');
const adminController = require('../controllers/adminController');
const config = require('../../config');

const router = express.Router();
const { authenticate } = adminController;

// Router Middleware
router.use(express.static(config.publicDir));
router.use(['/workout', '/login', '/signup', '/broadcast'], express.static(config.publicDir));

/**
 * Middleware that verifies all :ID parameters given in routes and test it's type
 * Throw an error if not a valid mongoDB ObjectID type
 */
router.param('id', (req, res, next, id) => {
    if (!ObjectId.isValid(id)) {
        return next(createError(404, 'Invalid Object ID'));
	}
    next();
});

router.get('/', (req, res) => {
    res.redirect('/dashboard/workout');
});

router.get('/workout', authenticate, workoutController.list);

router.get('/workout/create', authenticate, workoutController.getCreateForm);

router.post('/workout/create', authenticate, workoutController.createOne);

router.get('/workout/:id', authenticate, workoutController.details);

router.post('/workout/:id/update', authenticate, workoutController.updateOne);

router.post('/workout/:id/delete', authenticate, workoutController.deleteOne);

router.get('/gym', authenticate, gymController.list);

router.post('/gym', authenticate, gymController.createOne);

router.get('/broadcast', authenticate, broadcastController.index);

router.get('/login', adminController.getLoginForm);

router.post('/login', adminController.login);

router.get('/signup', adminController.getSignUpForm);

router.post('/signup', adminController.createOne);

router.get('/logout', authenticate, adminController.logout);

module.exports = {
    dashboardRouter: router,
};
