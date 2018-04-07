const express = require('express');
const { ObjectId } = require('mongodb');
const createError = require('http-errors');
const workoutController = require('../controllers/workoutController');
const gymController = require('../controllers/gymController');
const broadcastController = require('../controllers/broadcastController');

const router = express.Router();
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

router.get('/workout', workoutController.list);

router.get('/workout/create', workoutController.getCreateForm);

router.post('/workout/create', workoutController.createOne);

router.get('/workout/:id', workoutController.details);

router.post('/workout/:id/update', workoutController.updateOne);

router.post('/workout/:id/delete', workoutController.deleteOne);

router.get('/gym', gymController.list);

router.post('/gym', gymController.createOne);

router.get('/broadcast', broadcastController.index);

module.exports = {
    dashboardRouter: router,
};
