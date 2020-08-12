import Vuex from 'vuex'

// Modules
import core from './core'
import jobs from './jobs'
const vuexStore = () =>
  new Vuex.Store({
    modules: {
      core,
      jobs
    }
  })

export default vuexStore
