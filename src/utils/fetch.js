import axios from 'axios'
import Cookie from 'js-cookie'
import router from '@/router/index'
import {getDataType} from '@/utils/common'
// import qs from 'qs'
const ERROK = 200
const SERVERURL = '/apis'
const noAuthUrl = ['/user/signup', '/user/signin']
let instance = axios.create({
  baseURL: SERVERURL,
  withCredentials: true
})

instance.interceptors.request.use(config => {
  if (noAuthUrl.indexOf(config.url) > 0) {
    if (!Cookie.get('sessionId') && !Cookie.get('user')) {
      router.replace({name: 'signin'})
    }
  }
  config.headers['Content-Type'] = 'application/json;charset=utf-8'
  return config
})

instance.interceptors.response.use(function (res) {
  return res
}, (error) => {
  let response = error.response
  if (response.data.code === 401) {
    router.replace({name: 'signin'})
  } else if (response.data.code === 403) {
    console.log(response.data)
  }
  return Promise.reject(error)
})

global.fetch = {
  get: (url, params, config) => {
    if (params) {
      if (getDataType(params) === 'Object') {
        url += (url.indexOf('?') < 0 ? '?' : '&') + setparams(params)
      } else if (getDataType(params) === 'Array') {
        url += params.join('/')
      }
    }
    return new Promise((resolve, reject) => {
      instance.get(url).then((res) => {
        if (res.data.code === ERROK || res.data.status === ERROK) {
          resolve(res.data)
        } else {
          reject(res.data)
        }
      }).catch((e) => {
        console.log(JSON.stringify(e))
        reject(e)
      })
    })
  },
  post: (url, params, config) => {
    return new Promise((resolve, reject) => {
      instance.post(url, params).then((res) => {
        if (res.data.code === ERROK || res.data.status === ERROK) {
          resolve(res.data)
        } else {
          reject(res.data)
        }
      }).catch((e) => {
        console.log(e)
        reject(e)
      })
    })
  },
  put: (url, params, config) => {
    return new Promise((resolve, reject) => {
      instance.put(url, params).then((res) => {
        if (res.data.code === ERROK || res.data.status === ERROK) {
          resolve(res.data)
        } else {
          reject(res.data)
        }
      }).catch((e) => {
        console.log(e)
      })
    })
  },
  deletes: (url, params, config) => {
    if (params) {
      if (getDataType(params) === 'Object') {
        url += (url.indexOf('?') < 0 ? '?' : '&') + setparams(params)
      } else if (getDataType(params) === 'Array') {
        url += params.join('/')
      }
    }
    return new Promise((resolve, reject) => {
      instance.delete(url).then((res) => {
        if (res.data.code === ERROK || res.data.status === ERROK) {
          resolve(res.data)
        } else {
          reject(res.data)
        }
      }).catch((e) => {
        console.log(JSON.stringify(e))
      })
    })
  }
}

/**
 * @param {Object} data
 */
function setparams (data) {
  let paramStr = ''
  for (var k in data) {
    var value = data[k] !== undefined ? data[k] : ''
    paramStr += `&${k}=${encodeURIComponent(value)}` // encodeURIComponent   把字符串作为 URI 组件进行编码。
  };
  return paramStr ? paramStr.substring(1) : ''
}
