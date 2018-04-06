const express = require('express');
const { ObjectId } = require('mongodb');
const workoutController = require('../controllers/workoutController');
const gymController = require('../controllers/gymController');
const broadcastController = require('../controllers/broadcastController');

const router = express.Router();

router.param('id', (req, res, next, id) => {
    if (!ObjectId.isValid(id)) {
        res.status(404).send({ error: 'Invalid workout ID' });
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
