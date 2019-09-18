// const models = require('../models/modelagregator');

// // const fktifakult = new agregator.Fakult({
// //   name: 'FKTI'
// // });

// // fktifakult.save((err) => {
// //   if (err) {
// //     throw err;
// //   }
// // });

// // bcrypt.hash('123', null, null, (err, hash) => {
// //   models.User.create({
// //     name: 'admin',
// //     email: 'a@a',
// //     password: hash,
// //     isAdmin: true
// //   });
// // });

// // const faksultets = [
// //   'ФКТИ',
// //   'ФРТ',
// //   'ФЭЛ',
// //   'ФИБС',
// //   'ФЭА',
// //   'ФЭМ',
// //   'Открытый факультет',
// //   'Гуманитарный факультет'
// // ];

// // const specialisations = [
// //   'Applied Mathematics and Informatics',
// //   'Computer Systems Engineering and Informatics',
// //   'Information Systems and Technologies',
// //   'Software Engineering',
// //   'Computer Security',
// //   'System Analysis and Control',
// //   'Control in Technical Systems'
// // ];

// const specialisationsRus = [
//   'Прикладная математика и информатика',
//   'Информатика и разработака компьютерных систем',
//   'Информационные системы и технологии',
//   'Программная инженерия',
//   'Компьютерная безопасность',
//   'Контроль и анализ систем',
//   'Управление в технических системах'
// ];

// // MARKS UPDATING

// // models.User.findOne({ email: 'a@a' }, (err, data) => {
// //   if (err) {
// //     console.log(err);
// //   }
// //   // console.log(data.studentProfile.subjects[2]);
// //   // data.studentProfile.subjects[2].marks[0].value = '5';
// //   // data.save(err);
// // });

// // const insertSpecs = models.Fakult.findOne({ name: 'ФКТИ' }, (err, data) => {
// //   Object.entries(specialisationsRus).forEach((item) => {
// //     data.specs[item[0]] = item[1];
// //   });
// //   data.save();
// // });

// // const createGroups = Object.entries(specialisationsRus).forEach((item) => {
// //   groups = ['6304', '5101', '2523', '1234', '5231', '2723', '8261'];
// //   courses = ['1', '2', '3', '4'];
// //   models.Group.create({
// //     name: groups[item[0]],
// //     spec: item[1],
// //     course: courses[item[0]]
// //   });
// // });

// const sems = {
//   0: '1',
//   1: '2',
//   2: '3',
//   3: '4',
//   4: '5'
// };

// const subjects5sem = ['Матанализ', 'Алгебра', 'Программировнаие', 'Базы данных', 'OpenGl'];
// const subjects4sem = ['Матанализ', 'Алгебра', 'Программировнаие', 'Экономика', 'Право'];
// const subjects3sem = ['Матанализ', 'История', 'Программировнаие', 'Экология', 'NoSQL'];
// const subjects2sem = [
//   'Машинное обучение',
//   'Алгебра',
//   'Программировнаие',
//   'Базы данных',
//   'Распределенные системы данных'
// ];
// const subjects1sem = ['Матанализ', 'Алгебра', 'Программировнаие', 'Теория групп',
// 'ВВедение в ПИ'];

// const semssubjs = [subjects1sem, subjects2sem, subjects3sem, subjects4sem, subjects5sem];

// // Object.entries(specialisationsRus).forEach((item) => {
// //   models.Spec.create({
// //     name: item[1],
// //     'eduInfo[item[0]].semester': sems[item[0]],
// //     'eduInfo[item[0]].subjects': semssubjs[item[0]]
// //   });
// // });

// // models.Spec.find({ name: 'Программная инженерия' }, (err, data) => {
// //   Object.entries(sems).forEach((item) => {
// //     console.log(item);
// //     console.log(item[0]);
// //     data.eduInfo.push({sems[item[1]], semssubjs[item[0]]});
// //   });
// //   data.save();
// // });

// // ********* INSERTING SUBJECTS BY SEMESTER IN SPECIA:ISATION ********

// // models.Spec.findOne({ name: 'Программная инженерия' }, { upsert: true }, (err, data) => {
// //   const arr = [
// //     { semester: '1', subjects: subjects1sem },
// //     { semester: '2', subjects: subjects2sem },
// //     { semester: '3', subjects: subjects3sem },
// //     { semester: '4', subjects: subjects4sem },
// //     { semester: '5', subjects: subjects5sem }
// //   ];
// //   data.eduInfo = arr;
// //   data.save();
// // });

// // ***** INSERTING USERS IN GROUPS **********

// // models.User.find(
// //   { 'studentProfile.fakult': 'ФКТИ', 'studentProfile.course': '2' },
// //   (err, users) => {
// //     console.log(users);
// //     models.Group.findOne({ spec: 'Программная инженерия' }, (err1, group) => {
// //       console.log(group);
// //       group.name = '5404';
// //       const usersId = [];
// //       Object.values(users).forEach((user) => {
// //         // group.students.push(user.id);
// //         usersId.push(user.id);
// //       });
// //       group.students = usersId;
// //       // users.group = group.name;
// //       group.save();
// //     });
// //   }
// // );

// // ****** GROUP SUBJECTS FROM SPECIALISATION *******

// // models.Group.findOne({ spec: 'Программная инженерия' }, (err, data) => {
// //   data.name = '4403';
// //   const semester = '4';
// //   models.Spec.findOne({ name: 'Программная инженерия' }, (err1, specdata) => {
// //     for (let i = 0; i < specdata.eduInfo.length; i += 1) {
// //       if (specdata.eduInfo[i].semester === semester) {
// //         console.log(specdata.eduInfo[i]);
// //         for (let j = 0; j < specdata.eduInfo[i].subjects.length; j += 1) {
// //           data.subjects[j] = { name: '', lecturers: [] };
// //           // console.log(specdata.eduInfo[i].subjects[j]);
// //           data.subjects[j].name = specdata.eduInfo[i].subjects[j];
// //           console.log(data.subjects[j].name);
// //         }
// //         data.save();
// //       }
// //     }
// //   });
// // });

// // *********** INSERTING SUBJECTS FROM GROUP TO USER ***********

// // models.Subject.deleteMany({}, (err) => {});

// // const subjectItem = models.Subject.create({});

// // const testuserId = '5d751ed255b5bf1cb83eb54e';

// // models.User.findByIdAndUpdate(testuserId, { upsert: true }, (err, user) => {
// //   // console.log(user.studentProfile);
// //   models.Group.findOne({ students: user._id }, (err, group) => {
// //     // console.log(group);
// //     if (group) {
// //       const semester = { number: '4', subjects: [] };
// //       for (let i = 0; i < group.subjects.length; i += 1) {
// //         semester.subjects.push({
// //           name: group.subjects[i].name,
// //           marks: [{ value: '1' }, { value: '2' }, { value: '3' }]
// //         });
// //       }
// //       user.studentProfile.semesters = []; /** * CLEAR ALL SEMESTERS ** */
// //       user.studentProfile.semesters.push(semester);
// //       user.save();
// //     }
// //   });
// // });

// module.exports;
