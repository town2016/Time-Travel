const mysql = require('mysql')
let connection = mysql.createConnection({
  host: '112.74.39.234',
  user: 'root',
  database: 'town',
  password: 'Hd123456'
})

connection.connect((err) => {
  if (err) {
    console.log(JSON.stringify(err))
    return
  }
  console.log('数据库链接成功')
})

module.exports = connection
