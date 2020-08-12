<template>
  <div>
    <coc-input
      v-model = "input.name"
      :scope = "['register']"
      :rules = "rules.name"
      icon = "ios-person-outline"
      size = "large"
      placeholder = "Full Name"/>
    <coc-input
      v-model = "input.email"
      :scope = "['register']"
      :rules = "rules.email"
      size = "large"
      icon = "ios-mail-outline"
      placeholder = "Username"/>
    <coc-input
      v-model = "input.password"
      :scope = "['register']"
      :rules = "{
        HasValue: { active: true },
        MinLength: { args: 8 }
      }"
      size = "large"
      icon = "ios-lock-outline"
      type = "password"
      placeholder = "Password"/>
    <Progress 
      v-bind = "passwordStrength"
      :stroke-width = "20"
      class = "coc-margin-top-10px coc-margin-y-20px"
      hide-info />
    <coc-button
      v-model = "button"
      :scope = "['register']"
      :request = "{ url : '/users', xdata: {
        email: handleEmail(input.email),
        name: input.name,
        password: input.password,
      }}"
      :resolve-success-message = "() => 'Welcome on board!'"
      placeholder = "Register"
      size = "large"
      long
      @coc-submit-accepted = "handleRegister"/>
  </div>
</template>

<script>
export default {
  name: 'Register',

  data() {
    return {
      input: {
        name: '',
        email: '',
        password: ''
      },
      rules: {
        name: {
          HasValue: { active: true },
          MinLength: { args: 3 },
          MaxLength: { args: 20 }
        },
        email: model => {
          return {
            IsEmail: { active: true }
            // Remote: {
            //   args: {
            //     options: {
            //       url: '/users/email/available',
            //       method: 'get',
            //       params: { email: model },
            //       agent: this.$axios
            //     }
            //   },
            //   message: {
            //     message: 'This email is already taken.',
            //     icon: 'ivu-icon ivu-icon-ios-person'
            //   }
            // }
          }
        }
      },
      button: { meta: { errorStack: [] } }
    }
  },
  computed: {
    passwordStrength() {
      let percent = 1
      let status = 'wrong'
      if (!this.input.password || !this.input.password) {
        percent = 1
        status = 'wrong'
      } else if (
        this.input.password.meta &&
        this.input.password.meta.validationData.code === 17
      ) {
        percent = 33
        status = null
      } else if (
        this.input.password.meta &&
        this.input.password.meta.validationData.code === 23
      ) {
        percent = 66
        status = null
      } else if (this.input.password.meta && this.input.password.meta.valid) {
        percent = 100
        status = null
      }
      return {
        percent,
        status
      }
    }
  },
  methods: {
    nameExists() {
      // return (
      //   (this.input.name && this.input.name.meta.valid) ||
      //   'You must complete your Full Name First'
      // )
      return true
    },
    handleEmail(email) {
      if (!email || !email.length) return ''
      return email
        .split(' ')
        .join('')
        .toLowerCase()
    },
    includesName(val) {
      if (!val || !val.length) return ''
      return (
        (this.input.name &&
          this.input.name.length &&
          !val.toLowerCase().includes(
            this.input.name.val
              .toLowerCase()
              .split(' ')
              .join('')
          )) ||
        'Your password cant include your name.'
      )
    },
    handleRegister({ meta: { response } }) {
      this.$cookies.set('auth', response, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7
      })
      this.$axios.defaults.headers.common['Authorization'] = response.token
      this.$store.dispatch('setAuth', response)
      this.$emit('success')
    }
  }
}
</script>

<style lang="css" scoped>
</style>
