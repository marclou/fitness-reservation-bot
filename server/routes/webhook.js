const router = require('express').Router();

router.get('/', (req, res) => {
  res.send('<h1> Webhook stuff </h1>');
});

module.exports = {
    webhookRouter: router,
};
