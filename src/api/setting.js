export function updateUser (params) {
  return fetch.post('/user/updateUser', params)
}
export function fileUpload (params) {
  return fetch.post('/tools/fileUpload', params)
}
