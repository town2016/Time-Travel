export default {
  state: {
    positions: {}
  },
  getters: {
    positions: state => state.positions
  },
  mutations: {
    setCurPos (state, positions) {
      state.positions = positions
    }
  }
}
