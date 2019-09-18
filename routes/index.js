const express = require('express');
const bcrypt = require('bcrypt-nodejs');
// const test = require('../test/test');
const models = require('../models/modelagregator');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  if (req.session.userId) {
    models.Fakult.find({}, 'name', (err, faks) => {
      models.Spec.find({}, 'name', (err1, specs) => {
        models.User.find({ 'studentProfile._id': { $exists: true } }, (err2, studs) => {
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
              studs,
              isAdmin: req.session.isAdmin
            });
          }
        });
      });
    });
  } else {
    res.redirect('/auth');
  }
});

router.get('/students/:studentId', (req, res) => {
  if (req.session.userId) {
    models.User.findById(req.params.studentId, (err1, data) => {
      if (data) {
        if (req.session.userId === req.params.studentId) {
          res.render('studentPage', {
            student: data,
            canChange: false,
            show: 'all',
            isAdmin: req.session.isAdmin
          });
        } else {
          models.User.findById(req.session.userId, (err2, lookingUser) => {
            if (lookingUser.isAdmin) {
              res.render('studentPage', {
                student: data,
                canChange: true,
                show: 'all',
                isAdmin: req.session.isAdmin
              });
            } else if (lookingUser.lecturerProfile) {
              const subjects = [];
              for (let i = 0; i < lookingUser.lecturerProfile.studInfo.length; i += 1) {
                console.log(lookingUser.lecturerProfile.studInfo.length);
                if (lookingUser.lecturerProfile.studInfo[i].group === data.studentProfile.group) {
                  console.log('insert');
                  subjects.push(lookingUser.lecturerProfile.studInfo[i].subject);
                }
              }
              console.log(subjects);
              if (Array.isArray(subjects) && subjects.length) {
                res.render('studentPage', {
                  student: data,
                  canChange: true,
                  show: subjects,
                  isAdmin: req.session.isAdmin
                });
              } else {
                res.render('error', {
                  message: 'Недостаточно прав',
                  error: {},
                  userId: req.session.userId,
                  isAdmin: req.session.isAdmin
                });
              }
            } else {
              res.render('error', {
                message: 'Недостаточно прав',
                error: {},
                userId: req.session.userId,
                isAdmin: req.session.isAdmin
              });
            }
          });
        }
      } else {
        res.render('error', {
          message: 'Студент не найден',
          error: {},
          userId: req.session.userId,
          isAdmin: req.session.isAdmin
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
            req.session.isAdmin = data.isAdmin;
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

  const { fio } = req.body;
  const { fakult } = req.body;
  const { course } = req.body;
  const { spec } = req.body;

  const fields = {};

  if (fakult !== '') fields['studentProfile.fakult'] = fakult;
  if (course !== '') fields['studentProfile.course'] = course;
  if (spec !== '') fields['studentProfile.spec'] = spec;

  if (fio) {
    const fioParts = fio.split(' ');
    console.log(fioParts);
    console.log(fioParts.length);
    if (fioParts.length === 1) {
      models.User.find(
        {
          ...fields,
          ...{ name: fioParts[0] },
          ...{ 'studentProfile._id': { $exists: true } }
        },
        (err1, data1) => {
          models.User.find(
            {
              ...fields,
              ...{ surname: fioParts[0] },
              ...{ 'studentProfile._id': { $exists: true } }
            },
            (err2, data2) => {
              models.User.find(
                {
                  ...fields,
                  ...{ patronymic: fioParts[0] },
                  ...{ 'studentProfile._id': { $exists: true } }
                },
                (err3, data3) => {
                  const used = {};
                  const newData = [...data1, ...data2, ...data3];
                  // eslint-disable-next-line no-return-assign
                  const data = newData.filter(item => (item.id in used ? 0 : (used[item.id] = 1)));
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
    } else if (fioParts.length === 2) {
      models.User.find(
        {
          ...fields,
          ...{ name: fioParts[0], surname: fioParts[1] },
          ...{ 'studentProfile._id': { $exists: true } }
        },
        (err1, data1) => {
          models.User.find(
            {
              ...fields,
              ...{ surname: fioParts[0], patronymic: fioParts[1] },
              ...{ 'studentProfile._id': { $exists: true } }
            },
            (err2, data2) => {
              const newData = [...data1, ...data2];
              const used = {};
              // eslint-disable-next-line no-return-assign
              const data = newData.filter(item => (item.id in used ? 0 : (used[item.id] = 1)));
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
            name: fioParts[0],
            surname: fioParts[1],
            patronymic: fioParts[2]
          },
          ...{ 'studentProfile._id': { $exists: true } }
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
    models.User.find({ ...fields, ...{ 'studentProfile._id': { $exists: true } } }, (err, data) => {
      res.json({
        ok: true,
        data
      });
    });
  }
});

router.get('/administration', (req, res) => {
  if (req.session.userId) {
    models.User.findById(req.session.userId, (err, data) => {
      if (data.isAdmin) {
        models.Fakult.find({}, 'name', (err1, faks) => {
          models.Spec.find({}, 'name', (err2, specs) => {
            models.User.find({}, (err3, studs) => {
              models.Group.find({}, (err4, groups) => {
                if (err1) {
                  console.log(err1);
                } else if (err2) {
                  console.log(err2);
                } else if (err3) {
                  console.log(err3);
                } else if (err4) {
                  console.log(err4);
                } else {
                  res.render('adminPage', {
                    faks,
                    specs,
                    studs,
                    groups
                  });
                }
              });
            });
          });
        });
      } else {
        res.render('error', {
          message: 'Ошибка доступа',
          error: {},
          userId: req.session.userId
        });
      }
    });
  } else {
    res.redirect('/auth');
  }
});

router.post('/administration/newuser', (req, res) => {
  switch (req.body.type) {
    case 0:
      bcrypt.hash('test', null, null, (err, hash) => {
        models.User.create(
          {
            email: 'temp@temp',
            password: hash,
            name: req.body.name,
            surname: req.body.surname,
            patronymic: req.body.patronymic,
            isAdmin: req.body.isAdmin
          },
          (err1, dat) => {
            if (err1) {
              console.log(err1);
            }
            // eslint-disable-next-line no-param-reassign
            dat.email = dat.id;
            dat.save();
            res.json({ err1 });
          }
        );
      });
      break;
    case 1:
      bcrypt.hash('test', null, null, (err, hash) => {
        models.User.create(
          {
            email: 'temp@temp',
            password: hash,
            name: req.body.name,
            surname: req.body.surname,
            patronymic: req.body.patronymic,
            isAdmin: req.body.isAdmin,
            'studentProfile.fakult': req.body.fakult,
            'studentProfile.spec': req.body.spec,
            'studentProfile.course': req.body.course
          },
          (err1, dat) => {
            if (err1) {
              console.log(err1);
            }
            // eslint-disable-next-line no-param-reassign
            dat.email = dat.id;
            // dat.save();
            models.Group.find({ spec: req.body.spec, course: req.body.course }, (err2, groups) => {
              let groupId = 0;
              for (let i = 0; i < groups.length; i += 1) {
                if (groups[i].students.length < 25) {
                  console.log(groups[i].id);
                  groupId = groups[i].id;
                  break;
                }
              }
              if (groupId !== 0) {
                models.Group.findByIdAndUpdate(groupId, { upsert: true }, (err3, group) => {
                  const dateNow = new Date();
                  let userSemester = {};
                  const userSubjects = [];
                  for (let i = 0; i < group.subjects.length; i += 1) {
                    userSubjects.push({ name: group.subjects[i].name, marks: [] });
                  }
                  userSemester = {
                    number: (
                      parseInt(dat.studentProfile.course, 10)
                      + (dateNow.getMonth() > 0 && dateNow.getMonth() < 8 ? 1 : 0)
                    ).toString(),
                    subjects: userSubjects
                  };
                  group.students.push(dat.id);
                  // eslint-disable-next-line no-param-reassign
                  dat.studentProfile.group = group.name;
                  dat.studentProfile.semesters.push(userSemester);
                  group.save();
                  dat.save();
                });
              } else {
                models.Fakult.findOne({ name: dat.studentProfile.fakult }, (err4, fakult) => {
                  let specNum = 0;
                  for (let i = 0; i < fakult.specs.length; i += 1) {
                    if (fakult.specs[i] === dat.studentProfile.spec) {
                      specNum = i;
                      break;
                    }
                  }
                  models.Spec.findOne({ name: dat.studentProfile.spec }, (err3, spec) => {
                    const groupSbjs = [];
                    let bakalavrGroups = 0;
                    let magisterGroups = 0;
                    const dateNow = new Date();
                    for (let i = 0; i < spec.eduInfo.length; i += 1) {
                      if (
                        spec.eduInfo[i].semester
                        === (
                          parseInt(dat.studentProfile.course, 10)
                          + (dateNow.getMonth() > 0 && dateNow.getMonth() < 8 ? 1 : 0)
                        ).toString()
                      ) {
                        for (let j = 0; j < spec.eduInfo[i].subjects.length; j += 1) {
                          groupSbjs.push({ name: spec.eduInfo[i].subjects[j], lecturers: [] });
                        }
                        break;
                      }
                    }
                    for (let i = 0; i < spec.groups.length; i += 1) {
                      if (parseInt(spec.groups[i][2], 10) < 7) {
                        bakalavrGroups += 1;
                      } else {
                        magisterGroups += 1;
                      }
                    }
                    if (bakalavrGroups < 10) {
                      bakalavrGroups = `0${bakalavrGroups.toString()}`;
                    } else {
                      bakalavrGroups = bakalavrGroups.toString();
                    }
                    magisterGroups = (70 + magisterGroups).toString();
                    models.Group.create(
                      {
                        name:
                          (
                            (dateNow.getFullYear() - parseInt(dat.studentProfile.course, 10) + 1)
                            % 10
                          ).toString()
                          + specNum.toString()
                          + (dat.studentProfile.course < 5 ? bakalavrGroups : magisterGroups),
                        spec: dat.studentProfile.spec,
                        course: dat.studentProfile.course,
                        students: [dat.id],
                        subjects: groupSbjs
                      },
                      (err5, group) => {
                        let userSemester = {};
                        const userSubjects = [];
                        for (let i = 0; i < group.subjects.length; i += 1) {
                          userSubjects.push({ name: group.subjects[i].name, marks: [] });
                        }
                        userSemester = {
                          number: (
                            parseInt(dat.studentProfile.course, 10)
                            + (dateNow.getMonth() > 0 && dateNow.getMonth() < 8 ? 1 : 0)
                          ).toString(),
                          subjects: userSubjects
                        };
                        // eslint-disable-next-line no-param-reassign
                        dat.studentProfile.group = group.name;
                        dat.studentProfile.semesters.push(userSemester);
                        dat.save();
                      }
                    );
                  });
                });
              }
            });
            res.json({ err1 });
          }
        );
      });
      break;
    case 2:
      bcrypt.hash('test', null, null, (err, hash) => {
        models.User.create(
          {
            email: 'temp@temp',
            password: hash,
            name: req.body.name,
            surname: req.body.surname,
            patronymic: req.body.patronymic,
            isAdmin: req.body.isAdmin,
            'lecturerProfile.department': req.body.department
          },
          (err1, dat) => {
            if (err1) {
              console.log(err1);
            }
            // eslint-disable-next-line no-param-reassign
            dat.email = dat.id;
            dat.save();
            res.json({ err1 });
          }
        );
      });
      break;
    default:
      break;
  }
});

router.post('/marks/update', (req, res) => {
  models.User.findOneAndUpdate(
    { 'studentProfile.semesters.subjects._id': req.body.subject },
    { upsert: true },
    (err, data) => {
      for (let i = 0; i < data.studentProfile.semesters.length; i += 1) {
        for (let j = 0; j < data.studentProfile.semesters[i].subjects.length; j += 1) {
          if (data.studentProfile.semesters[i].subjects[j].id === req.body.subject) {
            if (req.body.id === 'new') {
              data.studentProfile.semesters[i].subjects[j].marks.push({
                value: req.body.value,
                lastUpdated: Date.now(),
                comments: req.body.comment
              });
              data.save();
              res.json({
                ok: true,
                type: 'insert',
                newId:
                  data.studentProfile.semesters[i].subjects[j].marks[
                    data.studentProfile.semesters[i].subjects[j].marks.length - 1
                  ].id
              });
            } else {
              for (
                let k = 0;
                k < data.studentProfile.semesters[i].subjects[j].marks.length;
                k += 1
              ) {
                if (data.studentProfile.semesters[i].subjects[j].marks[k].id === req.body.id) {
                  /* eslint-disable no-param-reassign */
                  data.studentProfile.semesters[i].subjects[j].marks[k].value = req.body.value;
                  data.studentProfile.semesters[i].subjects[j].marks[k].date = Date.now();
                  data.studentProfile.semesters[i].subjects[j].marks[k].comments = req.body.comment;
                  /* eslint-enable no-param-reassign */
                  data.save();
                  res.json({
                    ok: true,
                    type: 'update'
                  });
                  break;
                }
              }
            }
            break;
          }
        }
      }
    }
  );
});

router.post('/marks/get', (req, res) => {
  models.User.findById(req.body.page, (err, data) => {
    res.json({
      data
    });
  });
});

router.post('/administration/get/group', (req, res) => {
  models.Group.findById(req.body.val, (err, group) => {
    res.json({
      subjects: group.subjects
    });
  });
});

router.post('/administration/set/group/lecturer', (req, res) => {
  models.Group.findByIdAndUpdate(req.body.group, { upsert: true }, (err, group) => {
    models.User.findByIdAndUpdate(req.body.lecturer, { upsert: true }, (err1, lecturer) => {
      for (let i = 0; i < group.subjects.length; i += 1) {
        if (group.subjects[i].name === req.body.subject) {
          group.subjects[i].lecturers.push(req.body.lecturer);
          lecturer.lecturerProfile.studInfo.push({
            group: group.name,
            subject: req.body.subject
          });
          lecturer.save();
          group.save();
          res.json({
            ok: true
          });
        }
      }
    });
  });
});

router.post('/administration/get/spec', (req, res) => {
  if (req.body.val === '') {
    models.Spec.find({}, (err, spec) => {
      // console.log(fakult.length);
      // const specs = [];
      // for (let i = 0; i < fakult.length; i += 1) {
      //   for (let j = 0; j < fakult[i].specs.length; j += 1) {
      //     specs.push(fakult[i].specs[j]);
      //   }
      // }
      const specs = [];
      for (let i = 0; i < spec.length; i += 1) {
        specs.push(spec[i].name);
      }
      res.json({
        specs
      });
    });
  } else {
    models.Fakult.findOne({ name: req.body.val }, (err, fakult) => {
      res.json({
        specs: fakult.specs
      });
    });
  }
});

module.exports = router;
