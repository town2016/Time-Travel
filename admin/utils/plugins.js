// 整理返回的数据
function makeResponse (req, res, err, rows) {
  var response = {
    code: 200,
    message: ''
  }
  if (err) {
    response.code = 500
    response.message = JSON.stringify(err)
  } else {
    response.message = '操作成功'
    response.data = rows
  }
  res.json(response)
}

// 整理查询条件
function makeQueryTerms (query) {
  let queryStr = ''
  if (Object.keys(query).length > 0) {
    for (var k in query) {
      if (query[k]) {
        if (typeof query[k] === 'number') {
          queryStr += `${k}=${query[k]} AND `
        } else {
          queryStr += `${k}='${query[k]}' AND `
        }
      }
    }
  }
  queryStr = queryStr.substring(0, queryStr.length - 4)
  return queryStr
}

// 整理插入sql的插入数据
function makeInserts (params) {
  let insertStr = '', insertField= [], insertValuse = []
  if (Object.keys(params).length > 0) {
    for (var k in params) {
      if (params[k]) {
        insertField.push(k)
        insertValuse.push(`'${params[k]}'`)
      }
    }
  }
  if (insertField.length > 0) {
    insertStr = `(${insertField.join(',')}) VALUES (${insertValuse.join(',')})`
  }
  return insertStr
}

// 经纬度计算
function calculatLngLat (lng, lat) {
  var earthR = 6371, distance = 0.5
  var dlng = 2*Math.asin(Math.sin(distance/(2*earthR))/Math.cos(lat*Math.PI/180))
  dlng = dlng*180/Math.PI;//角度转为弧度  
  var dlat = distance/earthR;  
  dlat = dlat*180/Math.PI;
  console.log(dlng, dlat)
  return {
    lng: (lng * 1 + dlng),
    lat: (lat * 1 + dlat)
  }
}

module.exports = {
  makeQueryTerms,
  makeResponse,
  makeInserts,
  calculatLngLat
}
