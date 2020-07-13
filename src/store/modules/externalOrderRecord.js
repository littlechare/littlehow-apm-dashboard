export default {
  namespaced: true,
  state: {
    params: {}
  },
  mutations: {
    updateParams (state, params) {
      state.params = params
    }
  }
}
