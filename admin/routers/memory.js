const express = require('express')
const router = express.Router()
const connection = require('../config')
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
  queryAll: 'SELECT * FROM MEMORY m INNER JOIN USER u ON m.userId=u.userId LIMIT ',
  add: 'INSERT INTO MEMORY ',
  queryTerm: 'SELECT * FROM MEMORY m INNER JOIN USER u ON m.userId=u.userId WHERE '
}
// 拉取所有动态列表
router.get('/getMemoryList', (req, res, next) => {
  var query = req.query || {}
  query.pageNo = query.pageNo || 1
  query.pageSize = query.pageSize || 10 
  connection.query(`${SQL,queryAll}${(query.pageNo - 1)*query.pageSize},${query.pageSize}`)
})
// 添加动态
router.post('/addMemory', (req, res, next) => {
  var params = req.body
  params = tools.makeInserts(params)
  connection.query(`${SQL.add}${params}`, (err, rows) => {
    tools.makeResponse(req, res, err, rows)
  }) 
})
// 拉取复合条件的数据
router.get('/getMemoeyWithTerm', (req, res, next) => {
  var query = req.query
  query.pageNo = query.pageNo || 1
  query.pageSize = query.pageSize || 10
  const sql = `SELECT ROUND(6378.138*2*ASIN(SQRT(POW(SIN((${query.lat}*PI()/180-lat*PI()/180)/2),2)+
    COS(${query.lat}*PI()/180)*COS(lat*PI()/180)*POW(SIN((${query.lng}*PI()/180-lng*PI()/180)/2),2)))*1000) AS distance , a.*
    FROM MEMORY AS a HAVING distance <= 500 ORDER BY distance`
  connection.query(sql, (err, rows) => {
    tools.makeResponse(req, res, err, rows)
  })
  
})
module.exports = router
