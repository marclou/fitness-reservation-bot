const router = require('express').Router();

router.get('/', (req, res) => {
  res.send('<h1> Webhook URI </h1>');
});

module.exports = {
    webhookRouter: router,
};
