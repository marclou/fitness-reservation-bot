const express = require('express');
const config = require('./../../config');
const webhookController = require('../controllers/webhookController');

const router = express.Router();

router.get('/', (req, res) => {
    const { VERIFY_TOKEN } = config;
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
              res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});

router.post('/', (req, res) => {
    const { body } = req;

    if (body.object === 'page') {
        body.entry.forEach((entry) => {
            const webhook_event = entry.messaging[0];
            const sender_psid = webhook_event.sender.id;

            if (webhook_event.message) {
                webhookController.handleMessage(sender_psid, webhook_event.message);
            } else if (webhook_event.postback) {
                webhookController.handlePostback(sender_psid, webhook_event.postback);
            }
        });
        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.sendStatus(404);
    }
});

module.exports = {
    webhookRouter: router,
};
