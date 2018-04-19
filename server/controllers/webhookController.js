const request = require('request');
const config = require('./../../config');

module.exports = {
    // Handles messages events
    handleMessage: (sender_psid, received_message) => {
        let response;
        if (received_message.text) {
            response = {
                'text': `You sent the message: "${received_message.text}". Now send me an image!`
            };
        }
        this.callSendAPI(sender_psid, response);
    },

    // Handles messaging_postbacks events
    handlePostback: (sender_psid, received_postback) => {

    },

    // Sends response messages via the Send API
    callSendAPI: (sender_psid, response) => {
        const request_body = {
            'recipient': {
                'id': sender_psid,
            },
            'message': response,
        };

        request({
            'uri': 'https://graph.facebook.com/v2.6/me/messages',
            'qs': { 'access_token': config.PAGE_ACCESS_TOKEN },
            'method': 'POST',
            'json': request_body,
        }, (err, res, body) => {
            if (!err) {
                console.log('message sent!');
            } else {
                console.error(`Unable to send message:${err}`);
            }
        });
    },
};
