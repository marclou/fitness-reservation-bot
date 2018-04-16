const express = require('express');
const { ObjectId } = require('mongodb');
const createError = require('http-errors');
const gymController = require('../../controllers/gymController');
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

router.get('/', gymController.list);

router.get('/create', gymController.getCreateForm);

router.post('/create', gymController.createOne);

router.use('/:id/', express.static(config.publicDir));

router.get('/:id', gymController.details);

router.get('/:id/update', gymController.getUpdateForm);

router.post('/:id/update', gymController.updateOne);

router.post('/:id/delete', gymController.deleteOne);

module.exports = {
    gymRouter: router,
};
