var express = require('express');
const { redirect } = require('express/lib/response');
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
  // web3A = req.body.web3
  address = req.body.address
  username = req.body.username
  password = req.body.password
  console.log(address, username, password)
  addrs = ''
  user = ''
  sql = "insert into user (address,username,password) values(?,?,?)"
  db.query('select address,username from user', (err, result, field) => {
    console.log(result)
    for (let addr of result) {
      addrs = addr.address
      user = addr.username
    }
    db.query(sql, [address, username, password], (err, result, field) => {
      if (result != '') {
        db.query("select*from product", (err, result, file) => {
          console.log(result);
          res.render("login", { product: result })
        })
      }
    })
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
  // web3A = req.body.web3
  address = req.body.address
  username = req.body.username
  password = req.body.password
  console.log(address, username, password)
  sql = 'update user set username=?,password=? where address=?'
  db.query('select*from user where address=?', [address], (err, result, field) => {
    console.log("result", result);
    if (result != '') {
      db.query(sql, [username, password, address], (err, results, field) => {
        console.log("results", results)
        if (results != "") {
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
  })
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
      db.query('select comment from comment where productid=? order by id desc', [req.params.id], (err, result, field) => {
        db.query('select count(id) as num from comment where productid=?', [req.params.id], (err, resu, field) => {
          db.query('select success_num from user where id=?', [results[0].userid], (err, resul, field) => {
            db.query('select * from indent where buyers=? and productid=? and deliver="已发货"', [resulted[0].id, req.params.id], (err, resultd, field) => {
              if (resultd != '') {
                res.render('detail', {
                  detail: results, comments: result, id: resulted[0].id, indentbuyers: resultd[0].buyers,
                  receive_address: resulted[0].receive_address, success_num: resul[0].success_num, num: resu[0].num
                })
              } else {
                res.render('detail', {
                  detail: results, comments: result, id: resulted[0].id, indentbuyers: 0,
                  receive_address: resulted[0].receive_address, success_num: resul[0].success_num, num: resu[0].num
                })
              }
            })
          })
        })
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
    sqls = "select*from product where productName like '%" + productname + "%' and userid!=? and category='水果' and CURRENT_DATE<=end_time order by id desc"
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
    sqls = "select*from product where productName like '%" + productname + "%' and userid!=? and category='家具' and CURRENT_DATE<=end_time order by id desc"
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
    sqls = "select*from product where productName like '%" + productname + "%' and userid!=? and category='坚果' and CURRENT_DATE<=end_time order by id desc"
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
    sqls = "select*from product where productName like '%" + productname + "%' and userid!=? and category='零食' and CURRENT_DATE<=end_time order by id desc"
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
// 详情页收藏
router.get('/collect/:id', function (req, res) {
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
    db.query('select*from product where userid!=? and CURRENT_DATE<=end_time and id=? order by id desc', [results[0].id, req.params.id], (err, result, field) => {
      res.redirect('/detail/' + req.params.id)
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
    res.redirect('/collect')
  })
})
//详情购买
router.get('/buydetail/:id', function (req, res) {
  id = req.params.id.split(':')[0]
  num = req.params.id.split(':')[1]
  console.log("id", id, "num", num);
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
      sql = "insert into indent(productid,sellers,buyers,deliver,buynum) values(?,?,?,'待发货',?)"

      //更新商品状态
      // db.query('update product set state="售罄" where and id=?', [results[0].id], (err, result, field) => { })
      db.query('select * from product where id=?', [id], (err, resulted, field) => {
        db.query(sql, [id, resulted[0].sellers, results[0].id, num], (err, result, field) => {
          console.log("result[0].category", results[0].category);
          res.redirect('/detail/' + id)
        })
      })
    }
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
      db.query('select * from product where id=?', [id], (err, result, field) => {
        sql = "insert into indent(productid,sellers,buyers,deliver,buynum) values(?,?,?,'待发货',1)"
        db.query(sql, [id, result[0].sellers, results[0].id], (err, result, field) => {
          console.log(result);
          //更新商品状态
          // db.query('update product set state="售罄" where and id=?', [results[0].id], (err, result, field) => { })
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
      })
    }
  })
})
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
    db.query("select count(*) as counts from indent where (deliver='待发货' or deliver='商家发货') and tuikuan!='确认退款' and sellers=?", [results[0].address], (err, resulted, field) => {
      console.log("resulted", resulted[0].counts);
      db.query('select count(*) as coun from indent where (deliver="待发货" or deliver="商家发货") and tuikuan!="确认退款" and buyers=?', [results[0].id], (err, result, field) => {
        res.render('usercenter', { users: results, amount: resulted[0].counts, coun: result[0].coun })
      })
    })
  })
});
// 个人中心我的消息页面渲染
router.get('/mychats/:id', function (req, res) {
  if (req.session.address == undefined && req.session.password == undefined) {
    res.render('info', {
      title: '页面访问失败',
      content: '请先登录',
      href: 'login',
      text: '登录页'
    });
  }
  console.log(req.params.id);
  sql = 'select*from user where address=?'
  db.query(sql, [req.session.address], (err, results, field) => {
    db.query('select*from chat', (err, resul, field) => {
      db.query('select*from user where id!=?', [req.params.id], (err, resulted, field) => {
        res.render('mychat', {
          userphoto: results[0].photo, userid: results[0].id, Ouserphoto: resulted[0].photo, Ousername: resulted[0].username,
          msg: resul, Ouserid: resulted[0].id
        })
      })
    })
  })
})
// 个人中心我的消息发送请求
router.get('/mychat/:id', function (req, res) {
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
    db.query('insert into chat(userid,time,msg) values(?,CURRENT_TIMESTAMP,?)', [results[0].id, req.params.id.split(":")[0]], (err, result, field) => {
      res.redirect('/mychats/' + results[0].id)
    })
  })
})
// 详情页客服页面渲染
router.get('/shopchats/:id', function (req, res) {
  if (req.session.address == undefined && req.session.password == undefined) {
    res.render('info', {
      title: '页面访问失败',
      content: '请先登录',
      href: 'login',
      text: '登录页'
    });
  }
  console.log(req.params.id);
  sql = 'select*from user where address=?'
  db.query(sql, [req.session.address], (err, results, field) => {
    db.query('select*from product where id=?', [req.params.id], (err, result, field) => {
      db.query('select*from user where id=?', [result[0].userid], (err, resulted, field) => {
        db.query('select*from chat', (err, resul, field) => {
          res.render('shopchat', {
            userphoto: results[0].photo, userid: results[0].id, Ouserphoto: resulted[0].photo, Ousername: resulted[0].username,
            msg: resul, productid: req.params.id, Ouserid: resulted[0].id
          })
        })
      })
    })
  })
})
// 详情页客服页面发送消息
router.get('/shopchat/:id', function (req, res) {
  if (req.session.address == undefined && req.session.password == undefined) {
    res.render('info', {
      title: '页面访问失败',
      content: '请先登录',
      href: 'login',
      text: '登录页'
    });
  }
  console.log(req.params.id);
  sql = 'select*from user where address=?'
  db.query(sql, [req.session.address], (err, results, field) => {
    db.query('select * from product where id=?', [req.params.id.split(":")[1]], (err, resul, field) => {
      db.query('insert into chat (userid,time,msg) values(?,CURRENT_TIMESTAMP,?)', [results[0].id, req.params.id.split(':')[0]], (err, result, field) => {
        console.log(result);
        res.redirect('/shopchats/' + req.params.id.split(":")[1])
      })
    })
  })
})
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
    sql = "select * from(select * from indent where (deliver='待发货' or deliver='商家发货') and tuikuan!='确认退款' and buyers!=?) as inde join product p on inde.productid=p.id "
    db.query(sql, [results[0].id], (err, result, field) => {
      console.log("result", result);
      if (result != '') {
        db.query("select receive_address,address from user where id=?", [result[0].buyers], (err, resulted, field) => {
          if (resulted != '') {
            str = resulted[0].receive_address
            str = str.split(":")
            res.render('indent', { indent: result, str: str, address: resulted[0].address })
          } else {
            res.render('indent', { indent: result, str: str, address: '' })
          }
        })
      } else {
        res.render('indent', { indent: result, str: str, address: '' })
      }
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
  db.query("update indent set deliver='商家发货' where indentid=?", [id], (err, result, field) => {
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
    sqls = "select * from(select*from indent where (deliver='商家发货' or deliver='待发货') and tuikuan!='确认退款' and buyers=?) as inde join product p on inde.productid=p.id "
    db.query(sqls, [results[0].id], (err, result, field) => {
      console.log("result", result);

      if (result != '') {
        db.query("select receive_address from user where id=?", [results[0].id], (err, resulted, field) => {
          if (resulted != '') {
            str = resulted[0].receive_address
            str = str.split(":")
            res.render('buyshop', { buyshop: result, str: str })
          } else {
            res.render('buyshop', { buyshop: result, str: str })
          }
        })
      } else {
        res.render('buyshop', { buyshop: result, str: str })
      }
    })
  })
})
//退款页面
router.get('/tuikuan/:id', function (req, res) {
  if (req.session.address == undefined && req.session.password == undefined) {
    res.render('info', {
      title: '页面访问失败',
      content: '请先登录',
      href: 'login',
      text: '登录页'
    });
  }
  console.log(req.params.id.split(':')[0], req.params.id.split(':')[1]);
  sql = 'select*from user where address=? and password=?'
  db.query(sql, [req.session.address, req.session.password], (err, resulted, field) => {
    db.query('select * from product where id=?', [req.params.id.split(':')[0]], (err, results, field) => {
      console.log(resulted);
      console.log(results);
      db.query('select*from indent where indentid=?', [req.params.id.split(':')[1]], (err, resul, field) => {
        console.log(resul);
        res.render('tuikuan', { tuikuan: results, receive_address: resulted[0].receive_address, id: req.params.id.split(':')[1], buynum: resul[0].buynum })
      })
    })
  })
});
//买家申请退款
router.post('/apply_tui', function (req, res) {
  id = req.body.id
  indentid = req.body.indentid
  reason = req.body.reason
  clarify = req.body.clarify
  tuikuan = req.body.reason + ":" + req.body.clarify
  console.log(id, indentid, reason, clarify);
  db.query('update indent set yuanyin=?,tuikuan="申请退款" where indentid=?', [tuikuan, indentid], (err, result, field) => {
    console.log(result);
    res.redirect('/buyshop')
  })
})
//卖家确认退款
router.get('/suretuikuan/:id', function (req, res) {
  console.log(req.params.id);
  db.query('update indent set tuikuan="确认退款" where indentid=?', [req.params.id], (err, result, field) => {
    console.log(result);
  })
  res.redirect('/indent')
})
//买家确认发货
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
    db.query("update indent set deliver='已发货' where buyers=? and indentid=?", [results[0].id, req.params.id], (err, result, field) => {
      console.log("result", result);
      //刷新成功交易数目
      db.query('select productid from indent where indentid=?', [req.params.id], (err, result, field) => {
        console.log(result);
        db.query('select sellers from product where id = ?', [result[0].productid], (err, result, field) => {
          db.query('update user set success_num=success_num+1 where address=?', [result[0].sellers], (err, result, field) => {
            console.log(result);
          })
        })
      })
    })
  })
  res.redirect('/buyshop')
})
// 添加评论 
router.get('/pinglun/:id', function (req, res) {
  if (req.session.address == undefined && req.session.password == undefined) {
    res.render('info', {
      title: '页面访问失败',
      content: '请先登录',
      href: 'login',
      text: '登录页'
    });
  }
  console.log(req.params.id.split[1]);
  sql = 'select*from user where address=?'
  str = ''
  //确已发货评论

  db.query(sql, [req.session.address], (err, results, field) => {
    console.log(results);
    sqls = "select * from(select*from indent where (deliver='商家发货' or deliver='待发货') and tuikuan!='确认退款' and buyers=?) as inde join product p on inde.productid=p.id "
    // sqls = "select "
    db.query(sqls, [results[0].id], (err, result, field) => {
      console.log("result", result);
      if (result != '') {
        db.query("update indent set deliver='已发货' where indentid=?", [req.params.id.split(":")[1]], (err, resul, field) => {
          console.log("result", resul);
        })
        db.query("select receive_address from user where id=?", [results[0].id], (err, resulted, field) => {
          str = resulted[0].receive_address
          str = str.split(":")
          res.render('pinglun', { detail: result, str: str })
        })
      } else (res.redirect('pinglun'))
    })
  })
});
// 收货商品评论
router.post('/comment', function (req, res) {
  id = req.body.id
  console.log(req.body.content);
  comment = req.session.address + ":" + req.body.content
  comment = comment.replace(comment.slice(5, 37), '......')
  console.log(id, comment);
  db.query('insert into comment(productid,comment) values(?,?)', [id, comment], (err, result, field) => { console.log(result); })
  db.query('select * from user where address=?', [req.session.address], (err, results, field) => {
    db.query('update product set buyer=? where id=?', [results[0].id, id], (err, resulted, field) => {
      console.log(results, resulted);
      res.redirect('/buyshop')
    })
  })
});
// 商品详情评论
router.post('/decomment', function (req, res) {
  id = req.body.id
  console.log(req.body.content);
  comment = req.session.address + ":" + req.body.content
  comment = comment.replace(comment.slice(5, 37), '......')
  console.log(id, comment);
  db.query('insert into comment(productid,comment) values(?,?)', [id, comment], (err, result, field) => {
    console.log(result);
    res.redirect('/detail/' + id)
  })
});
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
  hash = req.body.hash
  category = req.body.categories
  productName = req.body.productname
  information = req.body.information
  price = req.body.price
  // num = req.body.num
  start_time = req.body.start_time
  end_time = req.body.end_time
  img_link = req.file.path.replace("public", '')
  console.log(category, productName, hash, information, start_time, end_time, typeof (end_time), img_link, price)
  db.query('select * from user where address=? and password=?', [req.session.address, req.session.password], (err, result, field) => {
    console.log(result);
    sql = 'insert into product(category,productName,sellers,price,information,img_link,launch_time,end_time,userid,hash) values(?,?,?,?,?,?,?,?,?,?)'
    db.query(sql, [category, productName, req.session.address, price, information, img_link, start_time, end_time, result[0].id, hash], (err, result, field) => {
      console.log(result)
    })
    db.query('update user set launch_num=launch_num+1 where id=?', [result[0].id], (err, result, field) => { console.log(result); })
  })
  // res.render("img",{"img":req.file.path.replace("public",'')})
  res.redirect('/productadd')
})
// 上传头像
router.post('/photo', upload.single('file'), function (req, res) {
  console.log("router.address,password", req.session.address, req.session.password);
  console.log(req.file, '------', req.body, '-------', req.file.path);
  console.log(req.file.path.replace("public", ''))
  id = req.body.id
  photo = req.file.path.replace("public", '')
  console.log("id", id, "photo", photo);
  db.query('update user set photo=? where id=?', [photo, id], (err, result, field) => {
    console.log(result);
    res.redirect('/usercenter')
  })
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
  cmbProvince = req.body.cmbProvince
  cmbCity = req.body.cmbCity
  cmbArea = req.body.cmbArea
  address1 = cmbProvince + cmbCity + cmbArea + address
  str = repeople + ":" + phone + ":" + address1
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

