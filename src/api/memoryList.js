export function getUserMemorys (params) {
  return fetch.get('/memory/getUserMemorys', params)
}
export function deleteUserMemory (params) {
  return fetch.get('/memory/deleteUserMemory', params)
}
