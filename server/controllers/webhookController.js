const request = require('request');
const config = require('./../../config');

const sendTypeOn = (sender_psid) => {
    request({
        'uri': 'https://graph.facebook.com/v2.6/me/messages',
        'qs': { 'access_token': config.PAGE_ACCESS_TOKEN },
        'method': 'POST',
        'json': {
            'recipient': {
                'id': sender_psid,
            },
            'sender_action': 'typing_on',
        },
    });
};

// Sends response messages via the Send API
const callSendAPI = (sender_psid, response) => {
    const request_body = {
        'messaging_type': 'RESPONSE',
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
};

// Handles messages events
const handleMessage = (sender_psid, received_message) => {
    let response;
    
    sendTypeOn(sender_psid);
    if (received_message.text) {
        response = {
            'text': `You sent the message: "${received_message.text}". Now send me an image!`,
        };
    }
    callSendAPI(sender_psid, response);
};

// Handles messaging_postbacks events
const handlePostback = (sender_psid, received_postback) => {

};


module.exports = {
    handleMessage,
    handlePostback,
};
