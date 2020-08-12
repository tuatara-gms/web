export default {
  dashboardRoles: ['admin', 'designer'],
  hasRole(roles, user) {
    if (!user || typeof user !== 'object' || !user.roles) {
      return false
    }
    if (!roles) {
      return true
    }
    if (this.isAdmin(user)) {
      return true
    }
    if (typeof roles === 'string') {
      return user.roles.indexOf(roles) !== -1
    }
    if (typeof roles === 'object' && Array.isArray(roles)) {
      let i
      for (i = 0; i < roles.length; i += 1) {
        if (user.roles.indexOf(roles[i]) === -1) {
          return false
        }
      }
      return true
    }
    return false
  },
  isAdmin({ roles }) {
    return roles.indexOf('admin') !== -1
  },
  dashboarder(user) {
    if (!user || typeof user !== 'object' || !user.roles) {
      return false
    }
    let i
    for (i = 0; i < this.dashboardRoles.length; i += 1)
      if (this.hasRole(this.dashboardRoles[i], user)) return true
    return false
  }
}
