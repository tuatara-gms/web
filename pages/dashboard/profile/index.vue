<template>
  <master>
    <div
      v-if = "user"
      class="">
      <coc-axios
        v-if = "avatarUrl"
        v-model = "deleteRetriever"
        :xdata = "{}"
        :url = "avatarUrl"
        prevent-on-mount
        method = "delete"
        @success = "handleDeleteSuccess"/>
      <div class="row">
        <div class = "col s12 coc-section">
          <div class = "col s12 l3">
            <coc-avatar
              :source = "avatar"
              :parent-class = "[
                'row',
                'house-keeper',
                'coc-inline-block'
              ]"
              :child-classes = "[
                'coc-primary-background-bg',
                'coc-border-border',
                'coc-border-1',
                'coc-primary-text'
              ]"
              :icon = "!avatar ? 'ivu-icon ivu-icon-ios-person' : null"
              scale = "150px"
              border-radius = "circle"/>
          </div>
          <div class = "col s12 l9">
            <div style = "margin-top: 40px">
              <p class = "coc-primary-text coc-text-heading">
                <Icon
                  type = "ios-person-outline"
                  class = "coc-primary-tint-3-text"/>
                {{ user.name | CocCapitalizeName }}
              </p>
              <p class = "coc-primary-text coc-text-heading">
                <Icon
                  :type = "getAuthTypeIcon(user.auth_type)"
                  class = "coc-primary-tint-3-text"/>
                <Tooltip :content = "user.email">
                  <a
                    v-if = "user.auth_type === 'facebook'"
                    :href="generateSocialUrl(user.auth_type)" 
                    target="_blank"
                    class = "email-wrapper">{{ user.email }}</a>
                  <span 
                    v-else 
                    class = "email-wrapper">{{ user.email }}</span>
                </Tooltip>
              </p>
            </div>
          </div>
        </div>
        <div class="col s12 coc-section">
          <coc-button
            v-if = "$utils.roles.dashboarder(user)"
            to = "/users">Manage Users</coc-button>
          <coc-button
            v-if = "$utils.roles.dashboarder(user)"
            to = "/app">App Configurations</coc-button>
          <Tabs v-model = "activeTab">
            <TabPane 
              label="My Info" 
              name="info">
              <div class="row coc-light-background-bg coc-border-border coc-border-1 coc-standard-border-radius coc-margin-x-5px">
                <coc-input
                  v-model = "input.name"
                  :scope = "['user-form']"
                  :rules = "{
                    HasValue: { active: true }
                  }"
                  placeholder = "Name.."
                  labeled/>
                <!-- <coc-input
                  v-model = "input.phone"
                  :rules = "{
                    MatchesRegex: { args: /(\+2|002)?(01)[0-9]{9}/, message: 'Invalid Phone Number' }
                  }"
                  :scope = "['user-form']"
                  placeholder = "Phone.."
                  labeled/>
                <coc-select
                  v-model = "input.gender"
                  :scope = "['user-form']"
                  :rules = "{
                    HasValue: { active: true }
                  }"
                  placeholder = "Gender.."
                  labeled>
                  <Option
                    label = "Male"
                    value = "male"/>
                  <Option
                    label = "Female"
                    value = "female"/>
                  <Option
                    label = "Other"
                    value = "other"/>
                </coc-select> -->
                <coc-button
                  :scope = "['user-form']"
                  :request = "{url: 'users/self/edit', method: 'put', xdata: formatUserForm()}"
                  placeholder = "Save"
                  size = "large"
                  class = "right"
                  icon = "ios-checkmark-circle-outline"
                  type = "default"
                  @coc-submit-accepted = "handleUserUpdate"/>
              </div>
            </TabPane>
            <TabPane 
              label="Avatar" 
              name="avatar">
              <div>
                <div class="col s12 l6 push-l3">
                  <div class="col l6 s12">
                    <Upload
                      id = "avatar-uploader"
                      ref = "upload"
                      :show-upload-list = "false"
                      :on-change="handleAvatarChange"
                      :before-upload="beforeAvatarUpload"
                      :auto-upload="false"
                      :format="['jpg','jpeg','png']"
                      action="#"
                      style="border-radius: 5px !important;"
                      class="avatar-uploader">
                      <img
                        v-if = "!imageUrl.length && avatar"
                        :src="avatar"
                        class="avatar">
                      <img
                        v-else-if = "imageUrl"
                        :src="imageUrl"
                        class="avatar">
                      <coc-avatar
                        v-else
                        :parent-class = "[
                          'row',
                          'house-keeper',
                          'coc-inline-block'
                        ]"
                        :child-classes = "[
                          'coc-primary-background-bg',
                          'coc-border-border',
                          'coc-border-1',
                          'coc-border-text'
                        ]"
                        icon = "ivu-icon ivu-icon-md-images"
                        scale = "178px"
                        border-radius = "standard"/>
                      <p class = "coc-content-text center coc-padding-top-5px coc-text-md-1">
                        <Icon
                          v-if = "imagesFiles && imagesFiles.length"
                          type = "md-create"/>
                        <Icon
                          v-else
                          type = "ios-add-circle-outline"/>
                        Click To 
                        <span
                          v-if = "imagesFiles && imagesFiles.length"
                          class = "animated fadeIn">Change</span>
                        <span
                          v-else
                          class = "animated fadeIn">Select</span>
                      </p>
                    </Upload>
                  </div>
                  <div class = "col l6 s12">

                    <Button
                      :loading = "uploadRetriever.loading"
                      :disabled = "!imagesFiles || !imagesFiles.length"
                      type = "success"
                      size = "large"
                      icon = "ios-cloud-upload-outline coc-text-md-2"
                      long
                      @click = "uploadAvatar">
                      <span class="coc-text-md-2">Upload</span>
                    </Button>
                    <Button
                      :loading = "deleteRetriever.loading"
                      :disabled = "!avatar"
                      type = "error"
                      size = "large"
                      icon = "ios-trash-outline coc-text-md-2"
                      class = "coc-margin-y-10px"
                      long
                      @click = "deleteAvatar">
                      <span class="coc-text-md-2">Remove</span>
                    </Button>
                    <Button
                      :loading = "deleteRetriever.loading"
                      :disabled = "!imagesFiles || !imagesFiles.length"
                      type = "warning"
                      size = "large"
                      icon = "ios-close-circle-outline coc-text-md-2"
                      long
                      @click = "cancelAvatarSelection">
                      <span class="coc-text-md-2">Cancel</span>
                    </Button>
                  </div>
                </div>
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </div>
    <div
      v-else
      class = "container">
      <div class="row">
        <div class = "col s12 coc-section">
          <p class = "coc-text-title coc-error-text center">
            <Icon type = "ios-alert-outline"/>
            You Are Not Logged In
          </p>
          <p class="center">
            <button-group>
              <Button
                type = "default"
                size = "large"
                shape = "circle"
                style = "width: 120px"
                to = "/">
                Go Home
              </Button>
              <Button
                type = "default"
                size = "large"
                shape = "circle"
                style = "width: 120px"
                @click = "askForLogin">
                Login
              </Button>
            </button-group>
          </p>
        </div>
      </div>
    </div>
  </master>
</template>

<script>
import config from '~/config'
import Master from '~/components/common/master'
export default {
  name: 'UserProfileIndex',
  components: {
    Master
  },
  head() {
    return {
      title: this.user ? this.user.name : 'Profile | Login First'
    }
  },
  data() {
    return {
      events: new this.$coc.Event({ api: this.$root }),
      input: {
        name: ''
        // phone: '',
        // gender: ''
      },
      upload: null,
      imageUrl: '',
      imagesFiles: null,
      uploadRetriever: { loading: false },
      deleteRetriever: { loading: false },
      uploadFD: null,
      activeTab: 'info',
      orders: null,
      orderTrial: false,
      orderStatus: [
        { label: 'Pennding', value: 'pennding', icon: 'ios-clock-outline' },
        {
          label: 'Approved',
          value: 'approved',
          icon: 'ios-checkmark-circle-outline',
          replace: true,
          fail: false
        },
        {
          label: 'Rejectetd',
          value: 'rejected',
          icon: 'ios-close-circle-outline',
          replace: true,
          fail: false
        },
        { label: 'On Delivery', value: 'on_delivery', icon: 'ios-bicycle' },
        { label: 'Delivered', value: 'delivered', icon: 'ios-home-outline' }
      ]
    }
  },
  computed: {
    user() {
      return this.$store.state.core.auth
    },
    avatarUrl() {
      if (this.user && this.user.avatar && this.user.auth_type !== 'local') {
        return this.user.avatar
      }
      return this.user && this.user.avatar
        ? `${config.baseURL}/users/${this.user._id}/avatar`
        : null
    },
    avatar() {
      if (this.user && this.user.avatar && this.user.auth_type !== 'local') {
        return this.user.avatar
      }
      return this.user && this.user.avatar
        ? `${config.baseURL}/users/${this.user._id}/avatar`
        : null
    }
  },
  watch: {
    // Watchers
    user: {
      deep: true,
      immediate: true,
      handler(val) {
        if (!val) {
          return
        }
        this.input.name = val.name
        this.input.phone = val.phone
        this.input.gender = val.gender
      }
    },
    activeTab(val) {
      if (val === 'orders' && !this.orderTrial) {
        this.getOrders()
      }
    }
  },
  async mounted() {
    // if (this.user && this.user.token) {
    //   try {
    //     const { data } = await this.$axios.get(`/users/${this.user._id}`)
    //     const user = { ...data, token: this.user.token }
    //     this.$cookies.set('auth', user, {
    //       path: '/',
    //       maxAge: 60 * 60 * 24 * 7
    //     })
    //     // this.$axios.defaults.headers.common['x-auth-token'] = data.token
    //     this.$store.dispatch('setAuth', user)
    //   } catch (err) {
    //     //
    //   }
    // }
    this.activeTab = this.$route.query.tab || 'info'
    this.input = this.$_.pick(this.user, ['name'])
  },
  methods: {
    formatUserForm() {
      let i
      const result = {}
      const keys = Object.keys(this.input)
      for (i = 0; i < keys.length; i += 1) {
        if (this.input[keys[i]]) result[keys[i]] = this.input[keys[i]]
      }
      return {
        ...result,
        ...this.$_.omit(this.user, [
          'avatar',
          'addresses',
          'token',
          'name',
          'phone',
          'gender'
        ])
      }
    },
    askForLogin() {
      this.events.Emit('askForLogin')
    },
    handleAvatarChange(res, file) {
      // console.log(file);
      this.imagesFiles = file
      this.imageUrl = URL.createObjectURL(file[0])
    },
    beforeAvatarUpload(file) {
      this.$refs.upload.clearFiles()
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isLt2M) {
        this.$Message.error('Avatar picture size can not exceed 2MB!')
        return
      }
      this.imagesFiles = [file]
      this.imageUrl = URL.createObjectURL(file)
      return isLt2M
    },
    uploadAvatar() {
      if (this.imagesFiles && this.imagesFiles.length) {
        this.uploadFD = new FormData()
        this.uploadFD.append('file', this.imagesFiles[0])
        this.uploadRetriever.loading = true
        setTimeout(() => {
          this.$axios({
            url: `users/${this.user._id}/avatar`,
            method: 'put',
            data: this.uploadFD
          })
            .then(res => {
              this.handleUploadSuccess({ response: res.data })
            })
            .catch(err => {
              this.$Message.error({
                content: error.response
              })
              this.uploadRetriever.loading = false
            })
        }, 500)
      } else {
        this.$Message.error({
          content: 'No Image Provided'
        })
      }
    },
    deleteAvatar() {
      this.deleteRetriever.retrieve()
    },
    handleUploadSuccess(e) {
      this.uploadRetriever.loading = true
      const data = e.response
      const tempData = this.$_.cloneDeep(data)
      tempData.avatar = null
      this.$store.dispatch('setAuth', tempData)
      setTimeout(() => {
        this.$Message.success({
          content: 'Hell Yeah'
        })
        this.$cookies.set('auth', data, {
          path: '/',
          maxAge: 60 * 60 * 24 * 7
        })
        this.$store.dispatch('setAuth', data)
        this.imageUrl = ''
        this.imagesFiles = null
        this.uploadRetriever.loading = false
      }, 1000)
    },
    cancelAvatarSelection() {
      this.imageUrl = ''
      this.imagesFiles = null
    },
    handleDeleteSuccess(e) {
      this.imageUrl = ''
      this.imagesFiles = null
      this.$Message.success({
        content: 'Hell Yeah'
      })
      this.$cookies.set('auth', e.response, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7
      })
      this.$store.dispatch('setAuth', e.response)
    },
    async getOrders() {
      try {
        this.orderTrial = true
        const { data } = await this.$axios.get('/orders/self/all')
        this.orders = data
      } catch (err) {
        this.orderTrial = false
      }
    },

    calculateOrderStatus({ status }) {
      if (status === 'rejected') {
        return this.orderStatus.filter(s => s.value !== 'approved')
      } else return this.orderStatus.filter(s => s.value !== 'rejected')
    },
    getOrderStepsStatus({ status }) {
      if (status === 'delivered') return 'finish'
      if (status === 'rejected') return 'error'
      if (status === 'pennding') return 'wait'
      return 'process'
    },
    handleUserUpdate({ meta: { response } }) {
      const tempUser = this.user
      tempUser.phone = response.phone
      tempUser.gender = response.gender
      tempUser.name = response.name
      this.$cookies.set('auth', tempUser, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7
      })
      this.$store.dispatch('setAuth', tempUser)
    },
    getAuthTypeIcon(authType) {
      if (!authType) return 'ios-mail'
      if (authType === 'google') return 'logo-google red-text'
      if (authType === 'facebook') return 'logo-facebook  blue-text'
      return 'ios-mail'
    },

    generateSocialUrl(authType) {
      if (!authType) return null
      if (authType === 'google') return 'logo-google red-text'
      if (authType === 'facebook')
        return `https://www.facebook.com/profile?id=${this.user.social.id}`
    }
  }
}
</script>

<style lang="css" scoped>
.avatar-uploader .Upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .Upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
    .email-wrapper{
  width: 100%;
  white-space: nowrap;
  overflow: hidden !important;
  text-overflow: ellipsis;
}
</style>
