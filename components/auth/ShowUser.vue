<template>
  <div 
    v-coc-mouse-over = "'coc-text-md-2 coc-secondary-text'"
    v-if = "userInfo"
    class="col s12 coc-padding-y-0 coc-smooth-font-size coc-margin-y-5px coc-padding-x-0 "
    @click = "goToUser">
    <Avatar
      :src = "getAvatarUrl(userInfo)"
      :icon = "getAvatarUrl(userInfo) ? null : 'ios-person'"/>
    {{ userInfo.name }}
  </div>
</template>

<script>
import config from '~/config'
export default {
  name: 'ShowUser',
  props: {
    userId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      userInfo: null
    }
  },
  watch: {
    userId: {
      handler() {
        this.getUser()
      }
    }
  },
  mounted() {
    this.getUser()
  },
  methods: {
    async getUser() {
      try {
        const { data } = await this.$axios.get(`users/${this.userId}`)
        this.userInfo = data
      } catch (err) {
        this.userInfo = null
        console.log(err)
      }
    },
    getAvatarUrl(user) {
      if (user && user.avatar && user.auth_type !== 'local') {
        return user.avatar
      }
      return user && user.avatar
        ? `${config.baseURL}/users/${user._id}/avatar`
        : null
    },
    generateSocialUrl(authType) {
      if (!authType) return null
      if (authType === 'google') return 'logo-google red-text'
      if (authType === 'facebook')
        return `https://www.facebook.com/profile?id=${this.userInfo.social.id}`
    },
    getAuthTypeIcon(authType) {
      if (!authType) return 'ios-mail'
      if (authType === 'google') return 'logo-google red-text'
      if (authType === 'facebook') return 'logo-facebook  blue-text'
      return 'ios-mail'
    },
    goToUser() {
      this.$router.push({
        path: '/dashboard/users',
        query: {
          email: this.userInfo.email,
          action: 'info',
          tab: 'info'
        }
      })
    }
  }
}
</script>

<style lang="css" scoped>
</style>
