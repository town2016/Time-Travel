const express = require('express')
const connection = require('../config')
const router = express.Router()
const tools = require('../utils/plugins')
const multer = require('multer')
var fs = require('fs')
var multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './static')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '_' + new Date().getTime())
  }
})

var uploads = multer({storage: multerStorage})

let response = {}
router.use((req, res, next) => {
  response = {
    code: 200,
    message: ''
  }
  next()
})

router.post('/fileUpload', uploads.single('avatar'),(req, res, next) => {
  fs.rename(req.file.path, './static/' + req.file.originalname, function(err) {
    if (err) throw err
    // 删除临时文件夹文件, 
    fs.unlink(req.file.path, function() {
       if (err) throw err;
       response.data = '/static/' + req.file.originalname
       res.json(response)
    })
  })
})

module.exports = router
