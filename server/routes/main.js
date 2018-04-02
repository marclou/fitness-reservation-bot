const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.send('<h1> Welcome here ! </h1>');
});

module.exports = {
    mainRouter: router,
};
