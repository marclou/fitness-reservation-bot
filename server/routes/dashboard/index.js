const express = require('express');
const config = require('../../../config');
const broadcastController = require('../../controllers/broadcastController');
const adminController = require('../../controllers/adminController');
const { workoutRouter } = require('./workoutRouter');
const { gymRouter } = require('./gymRouter');

const router = express.Router();


// Router Middleware
router.use(express.static(config.publicDir));
router.use(['/login', '/signup', '/broadcast'], express.static(config.publicDir));
// Sub-routes Middleware
router.use('/workout', workoutRouter);
router.use('/gym', gymRouter);


router.get('/', (req, res) => res.redirect('/dashboard/workout'));

router.get('/broadcast', adminController.authenticate, broadcastController.index);

router.get('/login', adminController.getLoginForm);

router.post('/login', adminController.login);

router.get('/signup', adminController.getSignUpForm);

router.post('/signup', adminController.createOne);

router.get('/logout', adminController.authenticate, adminController.logout);

module.exports = {
    dashboardRouter: router,
};
