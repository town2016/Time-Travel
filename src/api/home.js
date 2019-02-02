export function getMemoryList (params) {
  return fetch.get('/memory/getMemoeyWithTerm', params)
}
