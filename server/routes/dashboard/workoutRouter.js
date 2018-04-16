const express = require('express');
const { ObjectId } = require('mongodb');
const createError = require('http-errors');
const workoutController = require('../../controllers/workoutController');
const adminController = require('../../controllers/adminController');
const config = require('../../../config');

const router = express.Router();

// Router Middleware
router.use(express.static(config.publicDir));

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

router.all('*', adminController.authenticate);

router.get('/', workoutController.list);

router.get('/create', workoutController.getCreateForm);

router.post('/create', workoutController.createOne);

router.use('/:id/', express.static(config.publicDir));

router.get('/:id', workoutController.details);

router.post('/:id/update', workoutController.updateOne);

router.post('/:id/delete', workoutController.deleteOne);

module.exports = {
    workoutRouter: router,
};
