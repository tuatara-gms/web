export default {
  handleError(error, app) {
    if (error.response.status === 401) {
      logout(app)
    }
  },
  logout(app) {
    app.$cookies.set('auth', null, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    })
    app.$axios.defaults.headers.common['Authorization'] = null
    app.$store.dispatch('setAuth', null)
  }
}
