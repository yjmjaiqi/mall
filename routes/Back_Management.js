var express = require('express');
var router = express.Router();
var db = require("../mysql/mysql")

// Back_Manage
// 个人中心  上架商品
router.get('/', function(req, res, next) {
  res.render('Back_Manage')
});
// 历史交易记录
router.get('/history', function(req, res, next) {
  res.render('history')
});
// 电子发票凭证
router.get('/bill', function(req, res, next) {
  res.render('bill')
});
// 个人信息
router.get('/user', function(req, res, next) {
  res.render('user')
});
module.exports = router;