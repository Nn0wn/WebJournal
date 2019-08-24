const express = require('express');
// const fakults = require('../test/test');
const agregator = require('../modelagregator');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  agregator.Fakult.find({ name: 'FKTI' }, (err, docs) => {
    if (err) {
      console.log(err);
    } else {
      res.render('index', { title: 'Express', docs });
    }
    // res.render('index', { title: 'Express', agregator, fakults });
  });
});

module.exports = router;
