const express = require('express');
const fakults = require('../test/test');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Express', fakults });
});

module.exports = router;
