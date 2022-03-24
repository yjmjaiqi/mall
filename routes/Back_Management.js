var express = require('express');
var multer = require('multer')
var router = express.Router();
var db = require("../mysql/mysql")

var uploadFolder = './public/img';

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
   cb(null, uploadFolder); // 保存的路径，备注：需要自己创建
   console.log(uploadFolder);
  },
  filename: function (req, file, cb) {upload.single('file')
   // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
   let suffix=file.mimetype.split('/')[0];//获取文件格式
   console.log("suffix",suffix) 
   cb(null, file.originalname); //+'.'+suffix
   console.log(file.originalname);
  }
 });
 // 通过 storage 选项来对 上传行为 进行定制化
 var upload = multer({ storage: storage })



// Back_Manage
// 个人中心  上架商品
router.get('/', function(req, res) {
  res.render('Back_Manage')
});
router.post("/",upload.single('file'),function (req,res){
  console.log("router.username,password",req.session.username,req.session.password);
  console.log(req.file,'------',req.body,'-------',req.file.path);
  console.log(req.file.path.replace("public",''))
  category = req.body.category
  productName = req.body.productName
  information = req.body.information
  img_link = req.file.path.replace("public",'')
  price = req.body.price
  console.log(category,productName,information,img_link,price)
  db.query('select * from user where username=? and password=?',[req.session.username,req.session.password],(err,result,field)=>{
    console.log(result);
    sql = 'insert into product(category,productName,sellers,price,information,img_link,launch_time,state,userid) values(?,?,?,?,?,?,CURRENT_TIMESTAMP,?,?)'
    db.query(sql,[category,productName,req.session.username,price,information,img_link,'未售出',result[0].id],(err,result,field)=>{
        console.log(result)
    })
  })
  // res.render("img",{"img":req.file.path.replace("public",'')})
  res.redirect('/management')
})
// 历史交易记录
router.get('/history', function(req, res) {
  res.render('history')
});
// 电子发票凭证
router.get('/bill', function(req, res) {
  res.render('bill')
});
// 个人信息
router.get('/user', function(req, res) {
  res.render('user')
});
module.exports = router;