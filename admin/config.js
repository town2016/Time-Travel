const mysql = require('mysql')
let connection = mysql.createConnection({
  host: '127.0.0.1',
  user: '数据库用户名',
  database: '数据库名',
  password: '数据库登录密码'
})

connection.connect((err) => {
  if (err) {
    console.log(JSON.stringify(err))
    return
  }
  console.log('数据库链接成功')
})

module.exports = connection
