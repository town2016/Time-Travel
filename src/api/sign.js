// 注册
export function signUp (params) {
  return fetch.post('/user/signup', params)
}
// 登录
export function signIn (params) {
  return fetch.post('/user/signin', params)
}
// 退出
export function signout () {
  return fetch.get('/user/signout')
}
