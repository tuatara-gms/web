export default {
  state() {
    return {
      auth: null,
      app: null,
      gMapsApiKey: 'AIzaSyDd422q-XZZhcyNU8Iyo63ebrUCQnLtDuA'
    }
  },
  mutations: {
    SET_AUTH(state, value) {
      state.auth = value
    },
    SET_APP(state, value) {
      state.app = value
    }
  },
  actions: {
    nuxtServerInit({ commit }, { store, app }) {},
    setAuth({ commit }, value) {
      commit('SET_AUTH', value)
    },
    setApp({ commit }, value) {
      commit('SET_APP', value)
    }
  }
}
