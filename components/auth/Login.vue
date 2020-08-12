<template>
  <div class = "row house-keeper">
    <div 
      ref="loginFormInput" 
      :model="loginFormInput" 
      :rules="ruleInline" 
      class = "house-keeper row"
      inline>
      <div
        prop="email"
        class = "col s12 coc-margin-x-0 coc-padding-0 coc-margin-y-10px">
        <coc-input 
          v-model="loginFormInput.email"
          :rules = "{ HasValue: true, IsEmail: true }"
          :scope = "['login-form']"
          type="text" 
          placeholder="Email"
          size = "large"
          icon = "ios-person-outline"
          @on-enter = "handleSubmit('loginFormInput')" />
      </div>
      <div
        class = "col s12 coc-margin-x-0 coc-padding-0 coc-margin-y-10px"
        prop="password">
        <coc-input 
          v-model="loginFormInput.password" 
          :rules = "{ HasValue: true, MinLength: 8 }"
          :scope = "['login-form']"
          type="password" 
          placeholder="Password"
          icon = "ios-lock-outline"
          size = "large"
          @on-enter = "handleSubmit('loginFormInput')" />
      </div>
      <div class = "col s12 coc-margin-x-0 coc-padding-0 coc-margin-top-10px">
        <coc-button 
          :loading = "isLoading"
          :scope = "['login-form']"
          type="primary"
          size = "large"
          class = "right coc-standard-border-radius"
          long
          @coc-validation-passed ="handleSubmit('loginFormInput')">Login</coc-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      unrevisedOrders: 0,
      unrevisedOrdersDrawer: false,
      loginFormInput: {
        email: '',
        password: ''
      },
      isLoading: false,
      ruleInline: {
        email: [
          {
            required: true,
            message: 'Please fill in the email name',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: 'Please fill in the password.',
            trigger: 'blur'
          },
          {
            type: 'string',
            min: 6,
            message: 'The password length cannot be less than 6 bits',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    handleEmail(email) {
      return email
        .split(' ')
        .join('')
        .toLowerCase()
    },
    async handleSubmit(name) {
      this.isLoading = true
      // this.$refs[name].validate(valid => {
      // if (valid) {
      // Send Req
      this.$axios({
        method: 'post',
        url: '/auth',
        data: {
          ...this.loginFormInput,
          email: this.handleEmail(this.loginFormInput.email)
        }
      })
        .then(async res => {
          this.$Message.success(
            `Welcome, ${this.$coc.Filters.CapitalizeName(res.data.name)}!`
          )
          this.$cookies.set('auth', res.data, {
            path: '/',
            maxAge: 60 * 60 * 24 * 7
          })
          this.$root.$emit('LoggedIn', res.data)
          this.$axios.defaults.headers.common['Authorization'] = res.data.token
          this.$store.dispatch('setAuth', res.data)
          this.$emit('success')
          this.isLoading = false
          // if (this.$utils.roles.dashboarder(res.data)) {
          //   this.$router.push('/dashboard')
          // }
        })
        .catch(err => {
          this.$Message.error('Login Failed')
          this.isLoading = false
          console.log(err)
        })
      //   } else {
      //     this.isLoading = false
      //     this.$Message.error('Failed')
      //   }
      // })
    }
  }
}
</script>

<style lang="css" scoped>
.loader-6 span::before,
.loader-6 span::after {
  content: "";
  display: block;
  position: absolute;
  top: 0; left: 0;
  bottom: 0; right: 0;
  margin: auto;
  height: 32px;
  width: 32px;
  border: 2px solid #FFF;
  border-radius: 50%;
  opacity: 0;
  -webkit-animation: loader-6-1 1.5s cubic-bezier(0.075, 0.820, 0.165, 1.000) infinite;
          animation: loader-6-1 1.5s cubic-bezier(0.075, 0.820, 0.165, 1.000) infinite;
}
@-webkit-keyframes loader-6-1 {
  0%   { -webkit-transform: translate3d(0, 0, 0) scale(0); opacity: 1; }
  100% { -webkit-transform: translate3d(0, 0, 0) scale(1.5); opacity: 0; }
}
@keyframes loader-6-1 {
  0%   { transform: translate3d(0, 0, 0) scale(0); opacity: 1; }
  100% { transform: translate3d(0, 0, 0) scale(1.5); opacity: 0; }
}
.loader-6 span::after {
  -webkit-animation: loader-6-2 1.5s cubic-bezier(0.075, 0.820, 0.165, 1.000) .25s infinite;
          animation: loader-6-2 1.5s cubic-bezier(0.075, 0.820, 0.165, 1.000) .25s infinite;
}
@-webkit-keyframes loader-6-2 {
  0%   { -webkit-transform: translate3d(0, 0, 0) scale(0); opacity: 1; }
  100% { -webkit-transform: translate3d(0, 0, 0) scale(1); opacity: 0; }
}
@keyframes loader-6-2 {
  0%   { transform: translate3d(0, 0, 0) scale(0); opacity: 1; }
  100% { transform: translate3d(0, 0, 0) scale(1); opacity: 0; }
}

</style>
