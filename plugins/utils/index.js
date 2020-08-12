import roles from './roles'
import auth from './auth'
export default ({}, inject) => {
  inject('utils', {
    auth,
    roles
  })
}
