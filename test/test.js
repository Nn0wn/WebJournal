const agregator = require('../modelagregator');

const fktifakult = new agregator.Fakult({
  name: 'FKTI'
});

fktifakult.save((err) => {
  if (err) {
    throw err;
  }
});

module.exports = fktifakult;
