var express = require('express');
var router = express.Router();
var multer = require('multer')
var db = require("../mysql/mysql")
var uploadFolder = './public/img';
 
// 通过 filename 属性定制
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
// 通过上架时线下架商品
db.query('delete * from product where current_timestamp>end_time',(err,res,field)=>{
  console.log(res);
})

// 注册
var username,password
router.get('/register', function(req, res) {
  db.query("select*from user",(err,result,field)=>{
    console.log(result);
    console.log("result[0].username",result[0].username);
    res.render('register',{username:result[0].username});
  })
  
});
router.post('/register', function(req, res) {
  web3A = req.body.web3
  address = req.body.address
  username = req.body.username
  password = req.body.password
  console.log(web3A,address,username,password)
  addrs = ''
  user = ''
  sql = "insert into user (address,username,password) values(?,?,?)"
  db.query('select address,username from user',(err,result,field)=>{
    console.log(result)
    for(let addr of result){
      addrs = addr.address
      user = addr.username
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
  // 通过登录把数据传给web3删除商品
  db.query("select*from product",(err,result,file)=>{
    console.log(result);
    res.render("login",{product:result})
  })
});
router.post('/login', function(req, res) {
  req.session.address=req.body.address;
  req.session.password=req.body.password;
  // username = req.body.username
  // password = req.body.password
  db.query('select * from user where address=? and password=?',[req.session.address,req.session.password],(err,result,field)=>{
    console.log(result);
    if(result == ''){
      res.render('info',{
        title:'登录失败',
        content:'用户凭证或密码错误',
        href:'login',
        text:'登录页'
      });
    }else{
      db.query("select*from product",(err,result,file)=>{
        console.log(result);
        res.render("index",{product:result})
      })
      // res.render('index')
    }
  })
});
// 忘记密码
router.get('/AlterUser', function(req, res) {
  res.render('Alter_User')
});
router.post('/AlterUser', function(req, res) {
  web3A = req.body.web3
  address = req.body.address
  username = req.body.username
  password = req.body.password
  console.log(web3A,address,username,password)
  sql = 'update user set username=?,password=? where address=?'
    if (web3A == address){
      db.query(sql,[username,password,address],(err,result,field)=>{
      console.log(result)
      if(result !="" ){
        res.render('login')
      }
      })
    }else{
      res.render('info',{
      title:'修改失败',
      content:'用户凭证错误或不存在',
      href:'AlterUser',
      text:'忘记密码'
      })
    }
});
//首页
router.get('/index', function(req, res) {
  console.log(req.session.username);
  if(req.session.address==undefined&&req.session.password==undefined){
    res.render('info',{
      title:'页面访问失败',
      content:'请先登录',
      href:'login',
      text:'登录页'
    });
  }
  db.query("select*from product",(err,result,file)=>{
    console.log(result);
    res.render("login",{product:result})
  })
});
// 水果
router.get('/fruits', function(req, res) {
  sql = 'select*from user where address=? and password=?'
  db.query(sql,[req.session.address,req.session.password],(err,result,field)=>{
    console.log(result);
    db.query('select*from product where userid!=? and category="水果"',[result[0].id],(err,result,field)=>{
      res.render('fruits',{fruits: result})
    })
  })
})
// 家具
router.get('/furnitures', function(req, res) {
  sql = 'select*from user where address=? and password=?'
  db.query(sql,[req.session.address,req.session.password],(err,result,field)=>{
    console.log(result);
    db.query('select*from product where userid!=? and category="家具"',[result[0].id],(err,result,field)=>{
      res.render('furnitures',{furnitures: result})
    })
  })
});
// 坚果
router.get('/nuts', function(req, res) {
  sql = 'select*from user where address=? and password=?'
  db.query(sql,[req.session.address,req.session.password],(err,result,field)=>{
    console.log(result);
    db.query('select*from product where userid!=? and category="坚果"',[result[0].id],(err,result,field)=>{
      res.render('nuts',{nuts: result})
    })
  })
});
// 零食
router.get('/snacks', function(req, res) {
  sql = 'select*from user where address=? and password=?'
  db.query(sql,[req.session.address,req.session.password],(err,result,field)=>{
    console.log(result);
    db.query('select*from product where userid!=? and category="零食"',[result[0].id],(err,result,field)=>{
      res.render('snacks',{snacks: results})
    })
  })
});
// 购物车
router.get('/cart', function(req, res) {
  res.render('cart')
});
// 商品评论
router.get('/comment', function(req, res) {
  res.render('comment')
});
// 个人中心  
router.get('/usercenter', function(req, res) {
  sql = 'select*from user where address=?'
  db.query(sql,[req.session.address],(err,result,field)=>{
    console.log(result);
    res.render('usercenter',{users:result})
  })
});
// 我的订单
router.get('/indent', function(req, res) {
  res.render('indent')
});
// 添加商品  
router.get('/productadd', function(req, res) {
  res.render('productadd')
});
router.post("/productadd",upload.single('file'),function (req,res){
  console.log("router.address,password",req.session.address,req.session.password);
  console.log(req.file,'------',req.body,'-------',req.file.path);
  console.log(req.file.path.replace("public",''))
  category = req.body.categories
  productName = req.body.productname
  information = req.body.information
  price = req.body.price
  start_time = req.body.start_time
  end_time = req.body.end_time
  img_link = req.file.path.replace("public",'')
  console.log(category,productName,information,start_time,end_time,typeof(end_time),img_link,price)
  db.query('select * from user where address=? and password=?',[req.session.address,req.session.password],(err,result,field)=>{
    console.log(result);
    sql = 'insert into product(category,productName,sellers,price,information,img_link,launch_time,end_time,state,userid) values(?,?,?,?,?,?,?,?,?,?)'
    db.query(sql,[category,productName,req.session.address,price,information,img_link,start_time,end_time,'未售出',result[0].id],(err,result,field)=>{
        console.log(result)
    })
    db.query('update user set launch_num=launch_num+1 where id=?',[result[0].id],(err,result,field)=>{console.log(result);})
  })
  // res.render("img",{"img":req.file.path.replace("public",'')})
  res.redirect('/productadd')
})
// 用户自主下架商品
router.get('/soldout/:id',function(req,res){
  id = req.params.id
  console.log("id",id);
  db.query('delete from product where id=?',[id],(err,result,field)=>{
    console.log(result);
    res.redirect("/myshop")
  })
})
// 历史交易记录
router.get('/history', function(req, res) {
  res.render('history')
});
// 电子发票凭证
router.get('/bill', function(req, res) {
  res.render('bill')
});
// 个人商品中心展示
router.get('/myshop', function(req, res) {
  sql = 'select*from user where address=? and password=?'
  db.query(sql,[req.session.address,req.session.password],(err,result,field)=>{
    console.log(result);
    db.query('select*from product where userid=?',[result[0].id],(err,result,field)=>{
      res.render('myshop',{myshop:result})
    })
  })
});
module.exports = router

