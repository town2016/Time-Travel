const mysql = require('mysql')
let connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  database: 'dbname',
  password: 'pwd'
})

connection.connect((err) => {
  if (err) {
    console.log(JSON.stringify(err))
    return
  }
  console.log('数据库链接成功')
})

module.exports = connection
