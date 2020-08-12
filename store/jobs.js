export default {
  state() {
    return {
      all: [],
      running: [],
      current: null
    }
  },
  mutations: {
    SET_JOBS(state, value) {
      state.all = value
    },
    SET_RUNNING_JOBS(state, value) {
      state.running = value
    },
    SET_CURRENT_JOB(state, value) {
      state.current = value
    }
  },
  actions: {
    setJobs({ commit }, value) {
      commit('SET_JOBS', value)
    },
    setRunningJobs({ commit }, value) {
      commit('SET_RUNNING_JOBS', value)
    },
    setCurrentJob({ commit }, value) {
      commit('SET_CURRENT_JOB', value)
    }
  }
}
