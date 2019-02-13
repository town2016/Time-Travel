const express = require('express')
const connection = require('../config')
const router = express.Router()
const tools = require('../utils/plugins')
let response = {}
router.use((req, res, next) => {
  response = {
    code: 200,
    message: ''
  }
  next()
})

const SQL = {
  queryAll: 'select account, avatar, userId, slogon, createDate, updateDate from user',
  queryOne: 'select account, avatar, userId, slogon, createDate, updateDate, phone from user where ',
  add: 'insert into user ',
  update: 'update user set '
}

// 拉取所有用户
router.get('/getUserList', (req, res, next) => {
  if (res.status === 401) {
    res.json({code: 401, message: '用户未登录'})
    return
  }
  connection.query(SQL.queryAll, (err, rows) => {
    tools.makeResponse(req, res, err, rows)
  })
})
// 更具用户Id拉取用户详情
router.get('/getUserById', (req, res, next) => {
  connection.query(`${SQL.queryOne}userId=${req.query.uId}`, (err, rows) => {
    tools.makeResponse(req, res, err, rows)
  })
})
// 条件查询某用户
router.get('/queryUser', (req, res, next) => {
  let querys = tools.makeQueryTerms(req.query)
  if (querys) {
    connection.query(`${SQL.queryOne}${querys}`, (err, rows) => {
      tools.makeResponse(req, res, err, rows)
    })
  } else {
    response.code = 500
    response.message = '查询条件不能为空'
    res.json(response)
  }
})
// 添加用户
router.post('/addUser', (req, res, next) => {
  var params = req.body
  params = tools.makeInserts(params)
  connection.query(`${SQL.add}${params}`, (err, rows) => {
    tools.makeResponse(req, res, err, rows)
  })
})
// 用户注册
router.post('/signup', (req, res, next) => {
  
  if (!req.body.account) {
    response.code = 500
    response.message = '账号不能为空'
    res.json(response)
    return
  }
  
  if (!req.body.phone) {
    response.code = 500
    response.message = '手机号不能为空'
    res.json(response)
    return
  }
  if (!req.body.password) {
    response.code = 500
    response.message = '密码不能为空'
    res.json(response)
    return
  }
  
  var params = req.body
  let querys = tools.makeQueryTerms(params)
  connection.query(`${SQL.queryOne}${querys}`, (err, rows) => {
    if (err) {
      tools.makeResponse(req, res, err, rows)
    }
    if (rows.length > 0) {
      response.code = 500
      response.message = '账号已存在'
      res.json(response)
      return
    }
    params = tools.makeInserts(params)
    connection.query(`${SQL.add}${params}`, (err, rows) => {
      tools.makeResponse(req, res, err, rows)
    })
  })
})

// 用户登录
router.post('/signin', (req, res, next) => {
  if (!req.body.phone) {
    response.code = 500
    response.message = '手机号不能为空'
    res.json(response)
    return
  }
  if (!req.body.password) {
    response.code = 500
    response.message = '密码不能为空'
    res.json(response)
    return
  }
  let querys = tools.makeQueryTerms(req.body)
  connection.query(`${SQL.queryOne}${querys}`, (err, rows) => {
    if (!err && rows.length > 0) {
      req.session.user = rows[0]
    }
    tools.makeResponse(req, res, err, rows)
  })
})

// 退出登录
router.get('/signout', (req, res, next) => {
  if (req.session.user) {
    req.session.destroy();
    response.message = '登出成功'
  } else {
    response.code = 401
    response.message = '当前状态为未登录状态'
  }
  res.json(response)
})

// 修改用户信息
router.post('/updateUser', (req, res, next) => {
  if (res.status === 401) {
    res.json({code: 401, message: '用户未登录'})
    return
  }
  var params = req.body
  var where = `userId = ${params.userId}`
  params = tools.makeUpdates(params)
  connection.query(`${SQL.update}${params} WHERE ${where}`, (err, rows) => {
    tools.makeResponse(req, res, err, rows)
  })
})

module.exports = router
