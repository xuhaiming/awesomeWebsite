var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var todos = require('./routes/todos');
var activities = require('./routes/activities')
var cloud = require('./cloud');
var _ = require('underscore');

var app = express();

// 设置 view 引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// 加载云代码方法
app.use(cloud);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/', function(req, res) {
  var AV = require('leanengine');
  var Activity = AV.Object.extend('Activity');
  var query = new AV.Query(Activity);
  query.descending('createdAt');
  query.find({
    success: function(results) {
      var currentActivity = _.find(results, function(act) {return act.id == req.param('activityId')});
      res.render('index', {
        activities: results,
        currentActivity: currentActivity
      });
    },
    error: function(err) {
      next(err);
    }
  });
})

// 可以将一类的路由单独保存在一个文件中
app.use('/todos', todos);
app.use('/activities', activities);

// 如果任何路由都没匹配到，则认为 404
// 生成一个异常让后面的 err handler 捕获
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// 如果是开发环境，则将异常堆栈输出到页面，方便开发调试
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// 如果是非开发环境，则页面只输出简单的错误信息
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
