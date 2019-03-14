const express = require('express')
const mongoose  = require('mongoose')
const bodyParser = require('body-parser') // 加载请求体的解析插件
const Cookies = require('cookies')
const session = require("express-session"); // 引入session
const app = express()
const connection = require('./config')
const axios = require('axios')
const swig = require('swig') // 加载模板引擎
const sha1 = require('sha1')
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
// 设置模板路径
app.set('views', './view')
// 配置模板引擎，使用swig的renderFile方法来渲染后缀为html的文件
app.engine('html', swig.renderFile)
// 注册模板引擎
app.set('view engine', 'html')

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
  var noAuth = ['/user/signin', '/user/signup', '/', '/MP_verify_UpZ3j1inwr26spWo.txt', '/getWxSignature', '/getWxToken']
  if (noAuth.indexOf(req._parsedUrl.pathname) < 0) {
    var reg = new RegExp(/\/assets\//)
    var reg2 = new RegExp(/\/static\//)
    if (req._parsedUrl.pathname.match(reg)) {
      next()
    } else if (req._parsedUrl.pathname.match(reg2)) {
      next()
    } else {
      if (!req.session.user) {
        res.status = 401
        res.json({
          code: 401,
          message: '用户未登录！！！！'
        })
      } else {
        next()
      }
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
app.use('/assets', express.static(__dirname + '/view/assets'))
app.use('/user', require('./routers/user'))
app.use('/memory', require('./routers/memory'))
app.use('/tools', require('./routers/tools'))

// 拉取微信toke

app.get('/getWxToken', function (req, res, next) {
  axios.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxdb95caaf5fab5d83&secret=0fd3bec107b2ba7e11d5cb5d7d40524c').then(doc => {
    response.data = doc.data
    res.json(response)
  }).catch(e => {
    response.code = 500
    response.data = e
    res.json(response)
    console.log(e)
  })
})

// 拉取微信签名 https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token="+token+"&type=jsapi
app.get('/getWxSignature', function (req, res, next) {
  var query = req.query
  axios.get(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${query.token}&type=jsapi`).then(doc => {
    var ticket = doc.data.ticket
    var str = `jsapi_ticket=${ticket}&noncestr=${query.nonceStr}&timestamp=${query.timestamp}&url=${query.src}`
    response.data = sha1(str)
    res.json(response)
  }).catch(e => {
    response.code = 500
    response.data = e
    res.json(response)
    console.log(e)
  })
})


app.get('/', function (req, res, next) {
  res.render('index')
})

app.use('/', express.static(__dirname + '/'))

/*app.get('*', function(req, res){
  res.write(`
    <!DOCTYPE html>
      <head>
        <meta charset='utf-8'/>
      </head>
      <body>
        <h1>404</h1>
      </body>
    </html>
  `)
  res.end()
})
*/


