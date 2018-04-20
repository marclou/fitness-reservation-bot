const request = require('request');
const config = require('./../../config');

// Call Facebook Send API.
const callSendAPI = (response) => {
	request({
		uri: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {
			access_token: config.PAGE_ACCESS_TOKEN,
		},
		method: 'POST',
		json: response,

	}, (error, res, body) => {
		if (!error && response.statusCode === 200) {
			const recipientId = body.recipient_id;
			const messageId = body.message_id;

			if (messageId) {
				console.log('Successfully sent message with id %s to recipient %s', messageId, recipientId);
			} else {
				console.log('Successfully called Send API for recipient %s', recipientId);
			}
		} else {
			console.error('Failed calling Send API', response.statusCode, response.statusMessage, body.error);
		}
	});
};

// Send the '3 dots' to let user knows his message is processing.
const sendTypingOn = (sender_psid) => {
	const messageData = {
		recipient: {
			id: sender_psid,
		},
		sender_action: 'typing_on',
	};

	callSendAPI(messageData);
};

// Handles messages events
const handleMessage = (sender_psid, received_message) => {
    let response;

    sendTypingOn(sender_psid);
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
