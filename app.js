var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
var ejs = require("ejs")

var Dapp_get = require('./routes/Dapp_get');
var Back_Management = require('./routes/Back_Management');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
app.engine('.html',ejs.__express)
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret:'sessiontest',
    resave:true,//强制保存session
    cookie:{
      maxAge:7*24*60*60*1000,//设置session有效期为一周
    },
    saveUninitialized:true//强制保存初始化session
  }))
app.use('/', Dapp_get);
app.use('/management', Back_Management);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('info',{
//       content:"错误警告"
//   });
// });

module.exports = app;
