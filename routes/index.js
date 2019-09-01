const express = require('express');
// const fakults = require('../test/test');
const agregator = require('../modelagregator');

const faksultets = [
  'ФКТИ',
  'ФРТ',
  'ФЭЛ',
  'ФИБС',
  'ФЭА',
  'ФЭМ',
  'Открытый факультет',
  'Гуманитарный факультет'
];

const specialisations = [
  'Applied Mathematics and Informatics',
  'Computer Systems Engineering and Informatics',
  'Information Systems and Technologies',
  'Software Engineering',
  'Computer Security',
  'System Analysis and Control',
  'Control in Technical Systems'
];

const specialisationsRus = [
  'Прикладная математика и информатика',
  'Информатика и разработака компьютерных систем',
  'Информационные системы и технологии',
  'Программная инженерия',
  'Компьютерная безопасность',
  'Контроль и анализ систем',
  'Управление в технических системах'
];

// for (let i = 0; i < specialisationsRus.length; i += 1) {
// const fktifakult = new agregator.Fakult({
//   name: faksultets[i]
// });
// fktifakult.save((err) => {
//   if (err) {
//     throw err;
//   }
// });
//   const specs = new agregator.Course({
//     name: specialisationsRus[i]
//   });
//   specs.save((err) => {
//     if (err) {
//       throw err;
//     }
//   });
// }

// agregator.Fakult.deleteMany({ name: 'FKTI' }, (err) => {
//   if (err) {
//     console.log(err);
//   }
// });

// agregator.Course.deleteMany((err) => {
//   if (err) {
//     console.log(err);
//   }
// });

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  agregator.Fakult.find({}, 'name', (err1, faks) => {
    agregator.Course.find({}, 'name', (err, specs) => {
      if (err) {
        console.log(err);
      } else if (err1) {
        console.log(err1);
      } else {
        res.render('index', { title: 'Express', faks, specs });
      }
    });
    // res.render('index', { title: 'Express', agregator, fakults });
  });
});

router.get('/students/:studentId', (req, res) => {
  res.render('studentPage', { studentName: req.params.studentId });
});

router.get('/login', (req, res) => {
  res.render('login');
});

module.exports = router;
