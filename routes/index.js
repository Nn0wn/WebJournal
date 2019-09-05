const express = require('express');
// const fakults = require('../test/test');
const bcrypt = require('bcrypt-nodejs');
const models = require('../models/modelagregator');

// bcrypt.hash('123', null, null, (err, hash) => {
//   models.User.create({
//     email: 'a@a',
//     password: hash,
//     studentProfile: {
//       name: 'a',
//       surname: 'b',
//       patronymic: 'c',
//       fakult: 'ФКТИ',
//       course: 1,
//       spec: 'Программная инженерия'
//     }
//   });
// });

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
  if (req.session.userId) {
    models.Fakult.find({}, 'name', (err, faks) => {
      models.Course.find({}, 'name', (err1, specs) => {
        models.User.find({}, (err2, studs) => {
          if (err) {
            console.log(err);
          } else if (err1) {
            console.log(err1);
          } else if (err2) {
            console.log(err2);
          } else {
            res.render('index', {
              title: 'Express',
              faks,
              specs,
              studs
            });
          }
        });
      });
      // res.render('index', { title: 'Express', agregator, fakults });
    });
  } else {
    res.redirect('/auth');
  }
});

router.get('/students/:studentId', (req, res) => {
  if (req.session.userId) {
    models.User.findById(req.params.studentId, (err1, data) => {
      if (data) {
        res.render('studentPage', { studentName: req.params.studentId });
      } else {
        res.render('error', {
          message: 'Студент не найден',
          error: {},
          userId: req.session.userId
        });
      }
    });
  } else {
    res.redirect('/auth');
  }
});

router.get('/auth', (req, res) => {
  if (!req.session.userId) {
    res.render('auth');
  } else {
    res.redirect(`/students/${req.session.userId}`);
  }
});

router.post('/auth/login', (req, res) => {
  console.log(req.body);
  const { email } = req.body;
  const { password } = req.body;

  if (!email || !password) {
    const fields = [];
    if (!email) {
      fields.push('log-email');
    }
    if (!password) {
      fields.push('log-password');
    }

    res.json({
      ok: false,
      error: 'Все поля должны быть заполнены',
      fields
    });
  } else if (email.length < 3) {
    res.json({
      ok: false,
      error: 'Некорректный email',
      fields: ['log-email']
    });
  } else {
    models.User.findOne({ email }, (err, data) => {
      if (err) {
        console.log(err);
      }
      if (!data) {
        res.json({
          ok: false,
          error: 'Данный email не найден',
          fields: ['log-email']
        });
      } else {
        bcrypt.compare(password, data.password, (err1, hash) => {
          if (err1) {
            console.log(err1);
          }
          console.log(hash);
          if (!hash) {
            res.json({
              ok: false,
              error: 'Пара значений Email-пароль не найдена',
              fields: ['log-email', 'log-password']
            });
          } else {
            req.session.userId = data.id;
            req.session.userEmail = data.email;
            res.json({
              ok: true
            });
          }
        });
      }
    });
  }
});

router.get('/auth/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(() => {
      res.redirect('/auth');
    });
  } else {
    res.redirect('/auth');
  }
});

router.post('/search/students', (req, res) => {
  console.log(req.body);

  // models.User.create({
  //   email: '1@1',
  //   password: '000',
  //   studentProfile: {
  //     name: 'a',
  //     surname: 'b',
  //     patronymic: 'c',
  //     fakult: 'ФКТИ',
  //     course: 1,
  //     spec: 'Программная инженерия'
  //   }
  // });

  // models.User.create({
  //   email: '2@2',
  //   password: '001',
  //   studentProfile: {
  //     name: 'c',
  //     surname: 'a',
  //     patronymic: 'b',
  //     fakult: 'ФЭА',
  //     course: 2,
  //     spec: 'Прикладная математика и информатика'
  //   }
  // });

  // models.User.create({
  //   email: '3@3',
  //   password: '002',
  //   studentProfile: {
  //     name: 'b',
  //     surname: 'c',
  //     patronymic: 'a',
  //     fakult: 'ФРТ',
  //     course: 5,
  //     spec: 'Компьютерная безопасность'
  //   }
  // });

  const { fio } = req.body;
  const { fakult } = req.body;
  const { course } = req.body;
  const { spec } = req.body;

  const fields = {};

  if (fakult !== '') fields['studentProfile.fakult'] = fakult;
  if (course !== '') fields['studentProfile.course'] = course;
  if (spec !== '') fields['studentProfile.spec'] = spec;

  if (fio) {
    const fioParts = fio.split('');
    if (fioParts.length === 1) {
      models.User.find(
        {
          ...fields,
          ...{ 'studentProfile.name': fioParts[0] }
        },
        (err1, data1) => {
          models.User.find(
            {
              ...fields,
              ...{ 'studentProfile.surname': fioParts[0] }
            },
            (err2, data2) => {
              models.User.find(
                {
                  ...fields,
                  ...{ 'studentProfile.patronymic': fioParts[0] }
                },
                (err3, data3) => {
                  const data = Array.from(new Set([...data1, ...data2, ...data3]));
                  res.json({
                    ok: true,
                    data
                  });
                }
              );
            }
          );
        }
      );
    } else if (fioParts.length === 3) {
      models.User.find(
        {
          ...fields,
          ...{ 'studentProfile.name': fioParts[0], 'studentProfile.surname': fioParts[2] }
        },
        (err1, data1) => {
          models.User.find(
            {
              ...fields,
              ...{ 'studentProfile.surname': fioParts[0], 'studentProfile.patronymic': fioParts[2] }
            },
            (err2, data2) => {
              const data = Array.from(new Set([...data1, ...data2]));
              res.json({
                ok: true,
                data
              });
            }
          );
        }
      );
    } else {
      models.User.find(
        {
          ...fields,
          ...{
            'studentProfile.name': fioParts[0],
            'studentProfile.surname': fioParts[2],
            'studentProfile.patronymic': fioParts[4]
          }
        },
        (err, data) => {
          res.json({
            ok: true,
            data
          });
        }
      );
    }
  } else {
    models.User.find(fields, (err, data) => {
      res.json({
        ok: true,
        data
      });
    });
  }
});

module.exports = router;
