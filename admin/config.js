const mysql = require('mysql')

function connectDB() {
  let connection = mysql.createConnection({
    host: '112.74.39.234',
    user: 'root',
    database: 'town',
    password: 'Hd123456'
  })
  connection.connect((err) => {
  if (err) {
      console.log(JSON.stringify(err))
      setTimeout (() => {
        connectDB()
      }, 1000)
      return
    }
    console.log('数据库链接成功')
  })
}

connectDB()

connection.on('error', function (err) {
  if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      connectDB();                       // lost due to either server restart, or a
  }else{
      throw err;
  }
})

module.exports = connection
