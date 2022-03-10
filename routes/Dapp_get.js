var express = require('express');
var router = express.Router();
var db = require("../mysql/mysql")

// 注册
router.get('/register', function(req, res, next) {
  res.render('register');
});
router.post('/register', function(req, res, next) {
  res.render('login');
});
// 登录
router.get('/login', function(req, res, next) {
  res.render('login')
});
router.post('/login', function(req, res, next) {
  res.render('about');
});
// 忘记密码
router.get('/AlterUser', function(req, res, next) {
  res.render('Alter_User')
});
router.post('/AlterUser', function(req, res, next) {
  res.render('login');
});
//首页
router.get('/about', function(req, res, next) {
  res.render('about')
});
// 产品展示
// router.get('/product', function(req, res, next) {
//   res.render('product')
// });
// 日常
router.get('/everyday', function(req, res, next) {
  res.render('everyday')
});
// 书籍
router.get('/book', function(req, res, next) {
  res.render('book')
});
// 电器
router.get('/electric', function(req, res, next) {
  res.render('electric')
});
// 食物
router.get('/food', function(req, res, next) {
  res.render('food')
});
// 衣物
router.get('/clothes', function(req, res, next) {
  res.render('clothes')
});
// 单个产品详情
router.get('/single', function(req, res, next) {
  res.render('single')
});
// 商品评论
router.get('/comment', function(req, res, next) {
  res.render('comment')
});
module.exports = router;
