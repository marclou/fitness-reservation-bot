const request = require('request');
const config = require('./../../config');
const dialogflowController = require('./dialogflowController');

// Call Facebook Send API.
const callSendAPI = (messageData) => {
	request({
		uri: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {
			access_token: config.PAGE_ACCESS_TOKEN,
		},
		method: 'POST',
		json: messageData,

	}, (error, response, body) => {
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

const sendTypingOn = (sender_psid) => {
	const responseData = {
		recipient: {
			id: sender_psid,
		},
		sender_action: 'typing_on',
	};

	callSendAPI(responseData);
};

const sendTypingOff = (sender_psid) => {
	const responseData = {
		recipient: {
			id: sender_psid,
		},
		sender_action: 'typing_off',
	};

	callSendAPI(responseData);
};

const sendMarkSeen = (sender_psid) => {
	const responseData = {
		recipient: {
			id: sender_psid,
		},
		sender_action: 'mark_seen',
	};

	callSendAPI(responseData);
};

// Handles messages events
const handleMessage = (sender_psid, received_message) => {
    const { text, attachments, quick_reply } = received_message;
    let responseData;

    sendMarkSeen(sender_psid);
    if (text) {
        dialogflowController.receiveIntent(sender_psid, 'test', text);
    } else if (attachments) {
        responseData = {
            recipient: {
                id: sender_psid,
            },
            message: {
                text: `You sent the attachment: "${attachments}".`,
            },
        };
    } else if (quick_reply) {
        responseData = {
            recipient: {
                id: sender_psid,
            },
            message: {
                text: `You sent the attachment: "${attachments}".`,
            },
        };
    } else {
        throw new Error('Unknown received message type.');
    }
    callSendAPI(responseData);
};

// Handles messaging_postbacks events
const handlePostback = (sender_psid, received_postback) => {
    sendMarkSeen(sender_psid);
};

module.exports = {
    handleMessage,
    handlePostback,
};
