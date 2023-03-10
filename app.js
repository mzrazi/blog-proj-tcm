var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();
var session= require('express-session')
const dbConnect = require('./config/connection');
var hbs = require('express-handlebars')
var fileupload=require('express-fileupload')
const bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));

var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');
var managerRouter=require('./routes/manager')


dbConnect()
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine({
  extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/', partialsDir: __dirname + '/views/partials/', runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
}))

app.use(logger('dev'));


app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(session({secret:'key',cookie:{maxAge:600000}}))
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileupload()) 
app.use(function(req, res, next) {
  res.locals.session = req.session;
  next();
});


app.use('/', userRouter);
app.use('/admin', adminRouter);
app.use('/manager',managerRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
