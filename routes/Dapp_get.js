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
  filename: function (req, file, cb) {
    upload.single('file')
    // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
    let suffix = file.mimetype.split('/')[0];//获取文件格式
    console.log("suffix", suffix)
    cb(null, file.originalname); //+'.'+suffix
    console.log(file.originalname);
  }
});
// 通过 storage 选项来对 上传行为 进行定制化
var upload = multer({ storage: storage })

// 注册
router.get('/register', function (req, res) {
  db.query("select*from user", (err, result, field) => {
    console.log(result);
    // console.log("result[0].username",result[0].username);
    res.render('register');//,{username:result[0].username}
  })

});
router.post('/register', function (req, res) {
  web3A = req.body.web3
  address = req.body.address
  username = req.body.username
  password = req.body.password
  console.log(web3A, address, username, password)
  addrs = ''
  user = ''
  sql = "insert into user (address,username,password) values(?,?,?)"
  db.query('select address,username from user', (err, result, field) => {
    console.log(result)
    for (let addr of result) {
      addrs = addr.address
      user = addr.username
    }
    if (addrs == address || web3A != address) {
      res.render('info', {
        title: '注册失败',
        content: '用户凭证错误或已存在',
        href: 'register',
        text: '注册页'
      });
    } else {
      if (web3A == address) {
        db.query(sql, [address, username, password], (err, result, field) => {
          if (result != '') {
            db.query("select*from product", (err, result, file) => {
              console.log(result);
              res.render("login", { product: result })
            })
          }
        })
      }
    }
  })
});
// 登录
router.get('/login', function (req, res) {
  // 通过登录把数据传给web3删除商品
  db.query("select*from product", (err, result, file) => {
    console.log(result);
    res.render("login", { product: result })
  })
});
router.post('/login', function (req, res) {
  req.session.address = req.body.address;
  req.session.password = req.body.password;
  // username = req.body.username
  // password = req.body.password
  db.query('select * from user where address=? and password=?', [req.session.address, req.session.password], (err, result, field) => {
    console.log(result);
    if (result == '') {
      res.render('info', {
        title: '登录失败',
        content: '用户凭证或密码错误',
        href: 'login',
        text: '登录页'
      });
    } else {
      sql = 'select*from user where address=? and password=?'
      db.query(sql, [req.session.address, req.session.password], (err, result, field) => {
        console.log(result);
        db.query('select*from product where userid!=? and CURRENT_DATE<=end_time order by id desc', [result[0].id], (err, result, field) => {
          res.render('index', { product: result })
        })
      })
    }
  })
});
// 忘记密码
router.get('/alteruser', function (req, res) {
  res.render('alteruser')
});
router.post('/alteruser', function (req, res) {
  web3A = req.body.web3
  address = req.body.address
  username = req.body.username
  password = req.body.password
  console.log(web3A, address, username, password)
  sql = 'update user set username=?,password=? where address=?'
  if (web3A == address) {
    db.query(sql, [username, password, address], (err, result, field) => {
      console.log(result)
      if (result != "") {
        res.render('login')
      }
    })
  } else {
    res.render('info', {
      title: '修改失败',
      content: '用户凭证错误或不存在',
      href: 'alteruser',
      text: '忘记密码'
    })
  }
});
//首页
router.get('/index', function (req, res) {
  console.log(req.session.username);
  if (req.session.address == undefined && req.session.password == undefined) {
    res.render('info', {
      title: '页面访问失败',
      content: '请先登录',
      href: 'login',
      text: '登录页'
    });
  }
  sql = 'select*from user where address=? and password=?'
  db.query(sql, [req.session.address, req.session.password], (err, result, field) => {
    console.log(result);
    db.query('select*from product where userid!=? and CURRENT_DATE<=end_time order by id desc', [result[0].id], (err, result, field) => {
      res.render('index', { product: result })
    })
  })
});
//详情
router.get('/detail/:id', function (req, res) {
  if (req.session.address == undefined && req.session.password == undefined) {
    res.render('info', {
      title: '页面访问失败',
      content: '请先登录',
      href: 'login',
      text: '登录页'
    });
  }
  console.log(req.params.id);
  sql = 'select*from user where address=? and password=?'
  db.query(sql, [req.session.address, req.session.password], (err, resulted, field) => {
    db.query("select*from product where id=?", [req.params.id], (err, results, field) => {
      console.log(results);
      db.query('select comment from comment where productid=?', [req.params.id], (err, result, field) => {
        res.render('detail', { detail: results, comments: result, receive_address: resulted[0].receive_address })
      })
    })
  })
})
// 水果
router.get('/fruits', function (req, res) {
  if (req.session.address == undefined && req.session.password == undefined) {
    res.render('info', {
      title: '页面访问失败',
      content: '请先登录',
      href: 'login',
      text: '登录页'
    });
  }
  sql = 'select*from user where address=? and password=?'
  db.query(sql, [req.session.address, req.session.password], (err, results, field) => {
    console.log(results);
    db.query('select*from product where userid!=? and category="水果" and CURRENT_DATE<=end_time order by id desc', [results[0].id], (err, result, field) => {
      res.render('fruits', { fruits: result, receive_address: results[0].receive_address })
    })
  })
})
//水果搜索
router.post('/search_fruits', function (req, res) {
  productname = req.body.productname
  sql = 'select*from user where address=? and password=?'
  db.query(sql, [req.session.address, req.session.password], (err, results, field) => {
    console.log(results);
    sqls = "select*from product where productName like '%" + productname + "' and userid!=? and category='水果' and CURRENT_DATE<=end_time order by id desc"
    db.query(sqls, [results[0].id], (err, result, field) => {
      console.log(result);
      res.render('fruits', { fruits: result, receive_address: results[0].receive_address })
    })
  })
});
// 水果收藏
router.get('/fruits/:id', function (req, res) {
  if (req.session.address == undefined && req.session.password == undefined) {
    res.render('info', {
      title: '页面访问失败',
      content: '请先登录',
      href: 'login',
      text: '登录页'
    });
  }
  sql = 'select*from user where address=? and password=?'
  db.query(sql, [req.session.address, req.session.password], (err, results, field) => {
    console.log(results);
    db.query("update product set collectuser=? where id=?", [[results[0].id], req.params.id], (err, result, field) => { console.log(result); })
    db.query('select*from product where userid!=? and category="水果" and CURRENT_DATE<=end_time order by id desc', [results[0].id], (err, result, field) => {
      res.render('fruits', { fruits: result, receive_address: results[0].receive_address })
    })
  })
})
// 家具
router.get('/furnitures', function (req, res) {
  if (req.session.address == undefined && req.session.password == undefined) {
    res.render('info', {
      title: '页面访问失败',
      content: '请先登录',
      href: 'login',
      text: '登录页'
    });
  }
  sql = 'select*from user where address=? and password=?'
  db.query(sql, [req.session.address, req.session.password], (err, results, field) => {
    console.log(results);
    db.query('select*from product where userid!=? and category="家具" and CURRENT_DATE<=end_time order by id desc', [results[0].id], (err, result, field) => {
      res.render('furnitures', { furnitures: result, receive_address: results[0].receive_address })
    })
  })
});
//家具搜索
router.post('/search_furnitures', function (req, res) {
  productname = req.body.productname
  sql = 'select*from user where address=? and password=?'
  db.query(sql, [req.session.address, req.session.password], (err, results, field) => {
    console.log(results);
    sqls = "select*from product where productName like '%" + productname + "' and userid!=? and and category='家具' and CURRENT_DATE<=end_time order by id desc"
    db.query(sqls, [results[0].id], (err, result, field) => {
      res.render('furnitures', { furnitures: result, receive_address: results[0].receive_address })
    })
  })
});
//家具收藏
router.get('/furnitures/:id', function (req, res) {
  if (req.session.address == undefined && req.session.password == undefined) {
    res.render('info', {
      title: '页面访问失败',
      content: '请先登录',
      href: 'login',
      text: '登录页'
    });
  }
  sql = 'select*from user where address=? and password=?'
  db.query(sql, [req.session.address, req.session.password], (err, results, field) => {
    console.log(results);
    db.query("update product set collectuser=? where id=?", [[results[0].id], req.params.id], (err, result, field) => { console.log(result); })
    db.query('select*from product where userid!=? and category="家具" and CURRENT_DATE<=end_time order by id desc', [results[0].id], (err, result, field) => {
      res.render('furnitures', { furnitures: result, receive_address: results[0].receive_address })
    })
  })
})
// 坚果
router.get('/nuts', function (req, res) {
  if (req.session.address == undefined && req.session.password == undefined) {
    res.render('info', {
      title: '页面访问失败',
      content: '请先登录',
      href: 'login',
      text: '登录页'
    });
  }
  sql = 'select*from user where address=? and password=?'
  db.query(sql, [req.session.address, req.session.password], (err, results, field) => {
    console.log(results);
    db.query('select*from product where userid!=? and category="坚果" and CURRENT_DATE<=end_time order by id desc', [results[0].id], (err, result, field) => {
      console.log(result);
      res.render('nuts', { nuts: result, receive_address: results[0].receive_address })
    })
  })
});
//坚果搜索
router.post('/search_nuts', function (req, res) {
  productname = req.body.productname
  sql = 'select*from user where address=? and password=?'
  db.query(sql, [req.session.address, req.session.password], (err, results, field) => {
    console.log(results);
    sqls = "select*from product where productName like '%" + productname + "' and userid!=? and category='坚果' and CURRENT_DATE<=end_time order by id desc"
    db.query(sqls, [results[0].id], (err, result, field) => {
      res.render('nuts', { nuts: result, receive_address: results[0].receive_address })
    })
  })
});
//坚果收藏
router.get('/nuts/:id', function (req, res) {
  if (req.session.address == undefined && req.session.password == undefined) {
    res.render('info', {
      title: '页面访问失败',
      content: '请先登录',
      href: 'login',
      text: '登录页'
    });
  }
  sql = 'select*from user where address=? and password=?'
  db.query(sql, [req.session.address, req.session.password], (err, results, field) => {
    console.log(results);
    db.query("update product set collectuser=? where id=?", [[results[0].id], req.params.id], (err, result, field) => { console.log(result); })
    db.query('select*from product where userid!=? and category="坚果" and CURRENT_DATE<=end_time order by id desc', [results[0].id], (err, result, field) => {
      res.render('nuts', { nuts: result, receive_address: results[0].receive_address })
    })
  })
})
// 零食
router.get('/snacks', function (req, res) {
  if (req.session.address == undefined && req.session.password == undefined) {
    res.render('info', {
      title: '页面访问失败',
      content: '请先登录',
      href: 'login',
      text: '登录页'
    });
  }
  sql = 'select*from user where address=? and password=?'
  db.query(sql, [req.session.address, req.session.password], (err, results, field) => {
    console.log(results);
    db.query('select*from product where userid!=? and category="零食" and CURRENT_DATE<=end_time order by id desc', [results[0].id], (err, result, field) => {
      res.render('snacks', { snacks: result, receive_address: results[0].receive_address })
    })
  })
});
//零食搜索
router.post('/search_shacks', function (req, res) {
  productname = req.body.productname
  sql = 'select*from user where address=? and password=?'
  db.query(sql, [req.session.address, req.session.password], (err, results, field) => {
    console.log(results);
    sqls = "select*from product where productName like '%" + productname + "' and userid!=? and category='零食' and CURRENT_DATE<=end_time order by id desc"
    db.query(sqls, [results[0].id], (err, result, field) => {
      res.render('snacks', { snacks: result, receive_address: results[0].receive_address })
    })
  })
});
//零食收藏
router.get('/snacks/:id', function (req, res) {
  if (req.session.address == undefined && req.session.password == undefined) {
    res.render('info', {
      title: '页面访问失败',
      content: '请先登录',
      href: 'login',
      text: '登录页'
    });
  }
  sql = 'select*from user where address=? and password=?'
  db.query(sql, [req.session.address, req.session.password], (err, results, field) => {
    console.log(results);
    db.query("update product set collectuser=? where id=?", [[results[0].id], req.params.id], (err, result, field) => { console.log(result); })
    db.query('select*from product where userid!=? and category="零食" and CURRENT_DATE<=end_time order by id desc', [results[0].id], (err, result, field) => {
      res.render('snacks', { snacks: result, receive_address: results[0].receive_address })
    })
  })
})
// 收藏
router.get('/collect', function (req, res) {
  if (req.session.address == undefined && req.session.password == undefined) {
    res.render('info', {
      title: '页面访问失败',
      content: '请先登录',
      href: 'login',
      text: '登录页'
    });
  }
  sql = 'select*from user where address=? and password=?'
  db.query(sql, [req.session.address, req.session.password], (err, results, field) => {
    console.log(results);
    db.query("select * from product where collectuser=? and CURRENT_DATE<=end_time order by id desc", [results[0].id], (err, result, field) => {
      res.render('collect', { collect: result, receive_address: results[0].receive_address })
    })
  })

});
router.get('/decollect/:id', function (req, res) {
  id = req.params.id
  db.query("update product set collectuser=0 where id=?", [id], (err, result, field) => {
    console.log(result);
    sql = 'select*from user where address=? and password=?'
    db.query(sql, [req.session.address, req.session.password], (err, results, field) => {
      console.log(results);
      db.query("select * from product where collectuser=? and CURRENT_DATE<=end_time order by id desc", [results[0].id], (err, result, field) => {
        res.render('collect', { collect: result, receive_address: results[0].receive_address })
      })
    })
  })
})
// 购买商品
router.get('/shop/:id', function (req, res) {
  if (req.session.address == undefined && req.session.password == undefined) {
    res.render('info', {
      title: '页面访问失败',
      content: '请先登录',
      href: 'login',
      text: '登录页'
    });
  }
  id = req.params.id
  sql = 'select*from user where address=? and password=?'
  db.query(sql, [req.session.address, req.session.password], (err, results, field) => {
    console.log(results, typeof (results[0].receive_address), results[0].receive_address);
    if (results[0].receive_address == null) {
      res.render('info', {
        title: '收货地址为空',
        content: '请先填写',
        href: '../usercenter',
        text: '个人中心'
      });
    } else {
      // db.query("update product set buynum=buynum+1 where id=?", [id], (err, result, field) => { console.log("buynum", result); })
      db.query("update product set buyer=?,deliver='待发货' where id=?", [results[0].id, id], (err, result, field) => {
        //更新商品状态
        db.query('update product set state="售罄" where and id=?', [results[0].id], (err, result, field) => { })
        db.query('select category from product where id=?', [id], (err, result, field) => {
          console.log("result[0].category", result[0].category);
          if (result[0].category == '水果') {
            db.query('select*from product where userid!=? and category="水果" and CURRENT_DATE<=end_time order by id desc', [results[0].id], (err, result, field) => {
              res.render('fruits', { fruits: result, receive_address: results[0].receive_address })
            })
          } else if (result[0].category == '家具') {
            db.query('select*from product where userid!=? and category="家具" and CURRENT_DATE<=end_time order by id desc', [results[0].id], (err, result, field) => {
              res.render('furnitures', { furnitures: result, receive_address: results[0].receive_address })
            })
          } else if (result[0].category == '坚果') {
            db.query('select*from product where userid!=? and category="坚果" and CURRENT_DATE<=end_time order by id desc', [results[0].id], (err, result, field) => {
              res.render('nuts', { nuts: result, receive_address: results[0].receive_address })
            })
          } else {
            db.query('select*from product where userid!=? and category="零食" and CURRENT_DATE<=end_time order by id desc', [results[0].id], (err, result, field) => {
              res.render('snacks', { snacks: result, receive_address: results[0].receive_address })
            })
          }
        })
      })
    }
  })
})
// 商品评论
router.post('/comment', function (req, res) {
  id = req.body.id
  comment = req.session.address + ":" + req.body.content
  console.log(id, comment);
  db.query('insert into comment(productid,comment) values(?,?)', [id, comment], (err, result, field) => { console.log(result); })
  db.query("select*from product where id=?", [id], (err, results, field) => {
    console.log(results);
    db.query('select comment from comment where productid=?', [id], (err, result, field) => {
      res.render('detail', { detail: results, comments: result, receive_address: results[0].receive_address })
    })
  })
});
// 个人中心  
router.get('/usercenter', function (req, res) {
  if (req.session.address == undefined && req.session.password == undefined) {
    res.render('info', {
      title: '页面访问失败',
      content: '请先登录',
      href: 'login',
      text: '登录页'
    });
  }
  sql = 'select*from user where address=?'
  db.query(sql, [req.session.address], (err, results, field) => {
    console.log(results);
    db.query("select count(*) as counts from product where (deliver='待发货' or deliver='商家发货') and buyer!=?", [results[0].id], (err, resulted, field) => {
      console.log("resulted", resulted[0].counts);
      db.query('select count(*) as coun from product where deliver="商家发货" and buyer=?', [results[0].id], (err, result, field) => {
        res.render('usercenter', { users: results, amount: resulted[0].counts, coun: result[0].coun })
      })
    })
  })
});
// 我的订单
router.get('/indent', function (req, res) {
  if (req.session.address == undefined && req.session.password == undefined) {
    res.render('info', {
      title: '页面访问失败',
      content: '请先登录',
      href: 'login',
      text: '登录页'
    });
  }
  str = ''
  sql = 'select*from user where address=?'
  db.query(sql, [req.session.address], (err, results, field) => {
    console.log(results);
    db.query("select * from product where (deliver='待发货' or deliver='商家发货') and buyer!=?", [results[0].id], (err, result, field) => {
      console.log("result", result);
      db.query("select receive_address from user where id=?", [result[0].buyer], (err, resulted, field) => {
        str = resulted[0].receive_address
        str = str.split(":")
        res.render('indent', { indent: result, str: str })
      })
    })
  })
});
//商家确认发货
router.get('/indent/:id', function (req, res) {
  if (req.session.address == undefined && req.session.password == undefined) {
    res.render('info', {
      title: '页面访问失败',
      content: '请先登录',
      href: 'login',
      text: '登录页'
    });
  }
  id = req.params.id
  db.query("update product set deliver='商家发货' where id=?", [id], (err, result, field) => {
    console.log(result);
    res.redirect('/indent')
  })
})
//我的购买
router.get('/buyshop', function (req, res) {
  if (req.session.address == undefined && req.session.password == undefined) {
    res.render('info', {
      title: '页面访问失败',
      content: '请先登录',
      href: 'login',
      text: '登录页'
    });
  }
  str = ''
  sql = 'select*from user where address=?'
  db.query(sql, [req.session.address], (err, results, field) => {
    console.log(results);
    db.query("select * from product where deliver='商家发货' and buyer=?", [results[0].id], (err, result, field) => {
      console.log("result", result);
      db.query("select receive_address from user where id=?", [results[0].id], (err, resulted, field) => {
        str = resulted[0].receive_address.split(":")
        res.render('buyshop', { buyshop: result, str: str })
      })
    })
  })
})
//买家确认收货
router.get('/buyshop/:id', function (req, res) {
  if (req.session.address == undefined && req.session.password == undefined) {
    res.render('info', {
      title: '页面访问失败',
      content: '请先登录',
      href: 'login',
      text: '登录页'
    });
  }
  sql = 'select*from user where address=?'
  db.query(sql, [req.session.address], (err, results, field) => {
    console.log(results);
    db.query("update product set deliver='已发货' where buyer=? and id=?", [results[0].id, req.params.id], (err, result, field) => {
      console.log("result", result);
      //刷新成功交易数目
      db.query('select * from product where id=? and deliver="已发货"', [req.params.id], (err, result, field) => {
        db.query("update user set success_num=success_num+1 where id=?", [result[0].userid], (err, result, field) => {
          console.log(result);
        })
      })
    })
  })
  res.redirect('/buyshop')
})
// 添加商品  
router.get('/productadd', function (req, res) {
  if (req.session.address == undefined && req.session.password == undefined) {
    res.render('info', {
      title: '页面访问失败',
      content: '请先登录',
      href: 'login',
      text: '登录页'
    });
  }
  res.render('productadd')
});
router.post("/productadd", upload.single('file'), function (req, res) {
  console.log("router.address,password", req.session.address, req.session.password);
  console.log(req.file, '------', req.body, '-------', req.file.path);
  console.log(req.file.path.replace("public", ''))
  category = req.body.categories
  productName = req.body.productname
  information = req.body.information
  price = req.body.price
  // num = req.body.num
  start_time = req.body.start_time
  end_time = req.body.end_time
  img_link = req.file.path.replace("public", '')
  console.log(category, productName, information, start_time, end_time, typeof (end_time), img_link, price)
  db.query('select * from user where address=? and password=?', [req.session.address, req.session.password], (err, result, field) => {
    console.log(result);
    sql = 'insert into product(category,productName,sellers,price,information,img_link,launch_time,end_time,userid) values(?,?,?,?,?,?,?,?,?)'
    db.query(sql, [category, productName, req.session.address, price, information, img_link, start_time, end_time, result[0].id], (err, result, field) => {
      console.log(result)
    })
    db.query('update user set launch_num=launch_num+1 where id=?', [result[0].id], (err, result, field) => { console.log(result); })
  })
  // res.render("img",{"img":req.file.path.replace("public",'')})
  res.redirect('/productadd')
})
// 添加收货地址
router.get('/address', function (req, res) {
  if (req.session.address == undefined && req.session.password == undefined) {
    res.render('info', {
      title: '页面访问失败',
      content: '请先登录',
      href: 'login',
      text: '登录页'
    });
  }
  str = ''
  sql = 'select receive_address from user where address=?'
  db.query(sql, [req.session.address], (err, result, field) => {
    console.log("result", result);
    if (result[0].receive_address != null) {
      str = result[0].receive_address
    }
    str = str.split(":")
    console.log("str", str);
    res.render('address', { "str": str })
  })
})
router.post('/address', function (req, res) {
  repeople = req.body.repeople
  phone = req.body.phone
  address = req.body.address
  str = repeople + ":" + phone + ":" + address
  sql = 'update user set receive_address=? where address=?'
  db.query(sql, [str, req.session.address], (err, result, field) => {
    console.log(result);
    sql = 'select*from user where address=?'
    db.query(sql, [req.session.address], (err, result, field) => {
      console.log(result);
      res.redirect('/usercenter')
    })
  })
})

// 用户下架商品
router.get('/soldout/:id', function (req, res) {
  if (req.session.address == undefined && req.session.password == undefined) {
    res.render('info', {
      title: '页面访问失败',
      content: '请先登录',
      href: 'login',
      text: '登录页'
    });
  }
  id = req.params.id
  console.log("id", id);
  db.query('delete from comment where productid=?', [id], (err, result, field) => { console.log(result); })
  db.query("select userid from product where id='" + id + "'", (err, result, filed) => {
    console.log(result);
    sql = "update user set launch_num=launch_num-1 where id=?"
    db.query(sql, [result[0].userid], (err, result, field) => { console.log(result); })
  })
  db.query('delete from product where id=?', [id], (err, result, field) => {
    console.log(result);
    res.redirect("/myshop")
  })
})
// 历史交易记录
router.get('/history', function (req, res) {
  if (req.session.address == undefined && req.session.password == undefined) {
    res.render('info', {
      title: '页面访问失败',
      content: '请先登录',
      href: 'login',
      text: '登录页'
    });
  }
  res.render('history')
});
// 电子发票凭证
router.get('/bill', function (req, res) {
  if (req.session.address == undefined && req.session.password == undefined) {
    res.render('info', {
      title: '页面访问失败',
      content: '请先登录',
      href: 'login',
      text: '登录页'
    });
  }
  res.render('bill')
});
// 个人商品中心展示
router.get('/myshop', function (req, res) {
  if (req.session.address == undefined && req.session.password == undefined) {
    res.render('info', {
      title: '页面访问失败',
      content: '请先登录',
      href: 'login',
      text: '登录页'
    });
  }
  sql = 'select*from user where address=? and password=?'
  db.query(sql, [req.session.address, req.session.password], (err, result, field) => {
    console.log(result);
    db.query('select*from product where userid=? order by id desc', [result[0].id], (err, result, field) => {
      res.render('myshop', { myshop: result })
    })
  })
});
module.exports = router;

