const express = require('express')
const mongoose  = require('mongoose')
const bodyParser = require('body-parser') // 加载请求体的解析插件
const Cookies = require('cookies')
const session = require("express-session"); // 引入session
const app = express()
const connection = require('./config')
// 解析请求体的bodyParser 设置
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

/*pool.getConnection((err, connect) => {
  if (err) {
    console.log(err, '数据库链接失败')
    return
  }
  console.log('mysql数据库链接成功')
  pool.query('select * from user', (err, rows) => {
    console.log(err, rows)
  })
  app.listen(9999, function () {
    console.log('服务已启动')
  })
  pool.end()
})
*/
/* mongoose.connect('mongodb://127.0.0.1:27017/blog', {useNewUrlParser:true}, function (err, mongo) {
  if (err) {
    console.log('数据库连接失败')
  } else {
    console.log('数据库连接成功')
    app.listen(9999, function () {
      console.log('服务已启动')
    })
  }
})
 */

app.listen(9999, function () {
  console.log('服务已启动')
})

app.use(
  session({
    secret: 'inneractive',
    name: 'session-id',
    cookie: {maxAge: 1000 * 60 * 60 * 24, httpOnly: false},
    resave: true,
    rolling: true,
    saveUninitialized: true
  })
)
 
// 检测是否登录
app.use((req, res, next) => {
  req.cookies = new Cookies(req, res)
  var noAuth = ['/user/signin', '/user/signup']
  if (noAuth.indexOf(req._parsedUrl.pathname) < 0) {
    if (!req.session.user) {
      res.status = 401
      res.json({
        code: 401,
        message: '用户未登录！！！！'
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

// 捕获异常信息
app.use(function (err, req, res, next) {
  console.warn('错误处理中间捕获Exception', err);
  res.send('内部错误');
});

// 设置回调数据
let response = {}
app.use((req, res, next) => {
  response = {
    code: 200,
    message: ''
  }
  next()
})

exports.response = response 

// 登录
app.get('/signup', (req, res, next) => {
  response.message = '登陆成功'
  res.json(response)
})
// 注册
app.get('/signin', (req, res, next) => {
  response.message = '注册成功'
  res.json(response)
})
// 退出
app.get('/signout', (req, res, next) => {
  response.message = '退出成功'
  res.json(response)
})

app.use('/static', express.static(__dirname + '/static'))
app.use('/user', require('./routers/user'))
app.use('/memory', require('./routers/memory'))
app.use('/tools', require('./routers/tools'))

app.get('*', function(req, res){
  res.write(`
    <html>
      <head>
        <meta charset='utf-8'/>
      </head>
      <body>
        <h1>404</h1>
      </body>
  `)
  res.end()
})



