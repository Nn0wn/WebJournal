const debug = require('debug');
const express = require('express');
const path = require('path');
// const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const database = require('./database');
const config = require('./config');

let server;

const routes = require('./routes/index');
const users = require('./routes/users');

const app = express();

app.use(
  session({
    secret: config.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection
    })
  })
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res) => {
  const { userId } = req.session;

  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
    userId
  });
});

app.set('port', config.PORT);

database()
  .then((info) => {
    console.log(`Connected to ${info.host}:${info.port}/${info.name}`);
    server = app.listen(app.get('port'), () => {
      debug(`Express server listening on port ${server.address().port}`);
      (err) => {
        console.log(`Connection error: ${err}`);
      };
    });
  })
  .catch(() => {
    console.log('Unable to connect to database');
    process.exit(1);
  });
