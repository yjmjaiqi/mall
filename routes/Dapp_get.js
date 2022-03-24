var express = require('express');
var router = express.Router();
// var multer = require('multer')
var db = require("../mysql/mysql")
// var uploadFolder = './public/img';
 
// 通过 filename 属性定制
// var storage = multer.diskStorage({
//  destination: function (req, file, cb) {
//   cb(null, uploadFolder); // 保存的路径，备注：需要自己创建
//   console.log(uploadFolder);
//  },
//  filename: function (req, file, cb) {upload.single('file')
//   // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
//   let suffix=file.mimetype.split('/')[0];//获取文件格式
//   console.log("suffix",suffix) 
//   cb(null, file.originalname); //+'.'+suffix
//   console.log(file.originalname);
//  }
// });
// // 通过 storage 选项来对 上传行为 进行定制化
// var upload = multer({ storage: storage })


// 注册
var username,password
router.get('/register', function(req, res) {
  res.render('register');
});
router.post('/register', function(req, res) {
  web3A = req.body.web3
  address = req.body.address
  username = req.body.username
  password = req.body.password
  console.log(web3A,address,username,password)
  addrs = ''
  sql = "insert into user (address,username,password) values(?,?,?)"
  db.query('select address from user',(err,result,field)=>{
    console.log(result)
    for(let addr of result){
      addrs = addr.address
    }
    if (addrs == address || web3A != address){
      res.render('info',{
        title:'注册失败',
        content:'用户凭证错误或已存在',
        href:'register',
        text:'注册页'
      });
    }else{
      if (web3A == address){
        db.query(sql,[address,username,password],(err,result,field)=>{
          if(result != ''){
            res.render('login')
          }
        })
      } 
    } 
  })
});
// 登录
router.get('/login', function(req, res) {
  res.render('login')
});
router.post('/login', function(req, res) {
  req.session.username=req.body.username;
  req.session.password=req.body.password;
  // username = req.body.username
  // password = req.body.password
  db.query('select * from user where username=? and password=?',[req.session.username,req.session.password],(err,result,field)=>{
    console.log(result);
    if(result == ''){
      res.render('info',{
        title:'登录失败',
        content:'用户名或密码错误',
        href:'login',
        text:'登录页'
      });
    }else{
      res.render('about')
    }
  })
});
// 忘记密码
router.get('/AlterUser', function(req, res) {
  res.render('Alter_User')
});
router.post('/AlterUser', function(req, res) {
  res.render('login');
});
//首页
router.get('/about', function(req, res) {
  res.render('about')
});
// 日常
router.get('/everyday', function(req, res) {
  res.render('everyday')
});
// 书籍
router.get('/book', function(req, res) {
  res.render('book')
});
// 电器
router.get('/electric', function(req, res) {
  res.render('electric')
});
// 食物
router.get('/food', function(req, res) {
  res.render('food')
});
// 衣物
router.get('/clothes', function(req, res) {
  res.render('clothes')
});
// 单个产品详情
router.get('/single', function(req, res) {
  res.render('single')
});
// 商品评论
router.get('/comment', function(req, res) {
  res.render('comment')
});
// // Back_Manage
// // 个人中心  上架商品
// router.get('/management', function(req, res) {
//   res.render('Back_Manage')
// });
// router.post("/management",upload.single('file'),function (req,res){
//   console.log("router.username,password",req.session.username,req.session.password);
//   console.log(req.file,'------',req.body,'-------',req.file.path);
//   console.log(req.file.path.replace("public",''))
//   category = req.body.category
//   productName = req.body.productName
//   information = req.body.information
//   img_link = req.file.path.replace("public",'')
//   price = req.body.price
//   console.log(category,productName,information,img_link,price)
//   db.query('select * from user where username=? and password=?',[req.session.username,req.session.password],(err,result,field)=>{
//     console.log(result);
//     sql = 'insert into product(category,productName,sellers,price,information,img_link,launch_time,state,userid) values(?,?,?,?,?,?,CURRENT_TIMESTAMP,?,?)'
//     db.query(sql,[category,productName,req.session.username,price,information,img_link,'未售出',result[0].id],(err,result,field)=>{
//         console.log(result)
//     })
//   })
//   // res.render("img",{"img":req.file.path.replace("public",'')})
//   res.redirect('./management')
// })
// // 历史交易记录
// router.get('/history', function(req, res) {
//   res.render('history')
// });
// // 电子发票凭证
// router.get('/bill', function(req, res) {
//   res.render('bill')
// });
// // 个人信息
// router.get('/user', function(req, res) {
//   res.render('user')
// });
module.exports = router

