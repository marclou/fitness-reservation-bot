const dialogflow = require('dialogflow');
const config = require('./../../config');

const projectId = config.DIALOGFLOW_PROJECT_ID;
const languageCode = 'en-US';

const sessionClient = new dialogflow.SessionsClient();


const receiveIntent = (senderId, sessionId, text) => {
    const request = {
      session: sessionClient.sessionPath(projectId, sessionId),
      queryInput: {
        text: {
          text,
          languageCode,
        },
      },
    };
    sessionClient.detectIntent(request)
        .then((responses) => {
            console.log('--- Detected intent --- ');
            console.log(JSON.stringify(responses, undefined, 2));
            const result = responses[0].queryResult;
            console.log(` < Query: ${result.queryText}`);
            console.log(` > Response: ${result.fulfillmentText}`);
            if (result.intent) {
                console.log(` ----- Intent: ${result.intent.displayName} -----`);
            } else {
                console.log('No intent matched.');
            }
        })
        .catch((err) => {
            console.error('ERROR:', err);
        });
};

module.exports = {
    receiveIntent,
};
