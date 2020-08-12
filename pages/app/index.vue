
<template>
  <master :on-print = "onPrintDemo">
    <div
      class="container">
      Try Print Layout
      <i-switch v-model = "onPrintDemo" />
      <div
        v-if = "init"
        class = "col s12 coc-section">
        <h3 class = "coc-content-text coc-text-heading">App Data</h3>
        <coc-input
          v-model = "appForm.title"
          :rules = "{ HasValue: true }"
          :scope = "['app-form']"
          placeholder = "Title"
          size = "large"
          icon = "ios-card"
          light-model
          labeled/>
        <coc-input
          v-model = "appForm.subtitle"
          :rules = "{ HasValue: true }"
          :scope = "['app-form']"
          placeholder = "Subtitle"
          size = "large"
          icon = "ios-card-outline"
          light-model
          labeled/>
        <coc-input
          v-model = "appForm.address"
          :rules = "{ HasValue: true }"
          :scope = "['app-form']"
          placeholder = "Address"
          size = "large"
          icon = "ios-navigate"
          light-model
          labeled/>
        <coc-input
          :rules = "{ HasValue: true, IsNumericString: true, NumberGreaterThanOrEqual: 0 }"
          :scope = "['app-form', 'vat']"
          filters = "ToFloat"
          placeholder = "Vat"
          size = "large"
          icon = " knocks-percent"
          light-model
          labeled
          @filter = "appForm.vat = $event"/>
        <coc-input
          v-model = "appForm.currency"
          :rules = "{ HasValue: true }"
          :scope = "['app-form']"
          placeholder = "Currency"
          size = "large"
          icon = "ios-cash"
          light-model
          labeled/>
        <coc-input
          :rules = "{ 
            HasValue: true,
            IsNumericString: true,
            NumberGreaterThanOrEqual: {
              args: app.jobs_count,
              message: 'Jobs Count can not go backward |*args*|, this will override old jobs'
            }
          }"
          :scope = "['app-form', 'jobs_count']"
          filters = "ToInt"
          placeholder = "Jobs Count"
          size = "large"
          icon = " tcsc-motor-2-icon"
          light-model
          labeled
          @filter = "appForm.jobs_count = $event"/>
        <label class = "coc-warning-text">
          <icon type = " knocks-warning" />
          This is the Serial Number offset of jobs, becareful while editing this field.
        </label>
      </div>
      <!-- <div
        v-if = "init"
        class = "col s12 coc-section">
        <h3 class = "coc-content-text coc-text-heading">Home Banner</h3>
        <coc-input
          v-model = "appForm.background_redirect.url"
          :rules = "{ HasValue: { active: false } }"
          :scope = "['app-form']"
          placeholder = "Redirect URL.."
          size = "large"
          icon = "ios-link"
          light-model/>
        <coc-input
          v-model = "appForm.background_redirect.placeholder"
          :rules = "{ HasValue: { active: false } }"
          :scope = "['app-form']"
          placeholder = "Redirect Placeholder.."
          size = "large"
          icon = "md-create"
          light-model/>
        <coc-input
          v-model = "appForm.background_redirect.caption"
          :rules = "{ HasValue: { active: false } }"
          :scope = "['app-form']"
          type = "textarea"
          placeholder = "Upper Caption.."
          size = "large"
          light-model/>
        <coc-input
          v-model = "appForm.background_redirect.btn_style"
          :scope = "['app-form']"
          type = "textarea"
          placeholder = "Button Style.."
          size = "large"
          light-model/>
      </div> -->
      <!-- <div class="row">
        <div
          v-if = "init"
          class = "col s12 coc-section">
          <h3 class = "coc-content-text coc-text-heading">Social Media</h3>
          <coc-input
            v-model = "appForm.facebook"
            :rules = "{ HasValue: { active: true } }"
            :scope = "['app-form']"
            placeholder = "Facebook"
            size = "large"
            icon = "logo-facebook blue-text text-darken-2"
            light-model
            labeled/>
          <coc-input
            v-model = "appForm.twitter"
            :rules = "{ HasValue: { active: true } }"
            :scope = "['app-form']"
            placeholder = "Twitter"
            size = "large"
            icon = "logo-twitter blue-text"
            light-model
            labeled/>
          <coc-input
            v-model = "appForm.instagram"
            :rules = "{ HasValue: { active: true } }"
            :scope = "['app-form']"
            placeholder = "Instagram"
            size = "large"
            icon = "logo-instagram"
            light-model
            labeled/>
        </div>
      </div> -->
      <div>
        <div
          v-if = "init"
          class = "row coc-section">
          <h3 class = "coc-content-text coc-text-heading">
            Phone Numbers
            ({{ appForm.phones.length }})
          </h3>
          <cell-group>
            <cell
              v-for = "(phone, p) in appForm.phones"
              :key = "p"
              class = "coc-border-tint-5-bg coc-border-0 coc-border-bottom-1 coc-border-border">
              <span class="coc-text-bold">{{ phone }}</span>
              <i-button
                slot = "extra"
                icon = "md-trash coc-error-text"
                type = "text"
                @click = "appForm.phones.splice(p, 1)"/>
            </cell>
          </cell-group>
          <coc-input
            v-model = "phoneInput"
            :rules = "{ HasValue: true }"
            :scope = "['add-phone']"
            placeholder = "Phone"
            icon = "ios-phone"
            size = "large"
            light-model
            labeled>
            <coc-button
              slot = "append"
              :scope = "['add-phone']"
              classes = "coc-content-text coc-border-0"
              type = "text"
              style = "width: 70px"
              icon = "ios-add-circle-outline coc-content-text"
              local
              reset
              @coc-validation-passed = "appForm.phones.push(phoneInput)" />
          </coc-input>
        </div>
        <div
          v-if = "init"
          class = "row coc-section">
          <h3 class = "coc-content-text coc-text-heading">
            Promotions
            ({{ appForm.promotions.length }})
          </h3>
          <cell-group>
            <cell
              v-for = "(promotion, p) in appForm.promotions"
              :key = "p"
              class = "coc-border-tint-5-bg coc-border-0 coc-border-bottom-1 coc-border-border">
              <span class="coc-text-bold">
                {{ promotion.name | CocCapitalizeName }}
              </span>
              <span slot = "label">
                {{ promotion.amount }} {{ promotion.type === 'percentage' ? '%' : appForm.currency }}
              </span>
              <i-button
                slot = "extra"
                icon = "md-trash coc-error-text"
                type = "text"
                @click = "appForm.promotions.splice(p, 1)"/>
            </cell>
          </cell-group>
          <div class="col l4 s12">
            <coc-input
              v-model = "promotionForm.name"
              :scope = "['promotion-form']"
              :rules = "{ HasValue: true }"
              placeholder = "Name"
              size = "large"
              light-model
              labeled/>
          </div>
          <div class="col l4 s12">
            <coc-input
              :scope = "['promotion-form']"
              :rules = "{ HasValue: true, IsNumericString: true, NumberGreaterThan: 0 }"
              filters = "ToFloat"
              placeholder = "Amount"
              size = "large"
              light-model
              labeled
              @filter = "promotionForm.amount = $event"/>
          </div>
          <div class="col l4 s12">
            <coc-select
              v-model = "promotionForm.type"
              :scope = "['promotion-form']"
              :rules = "{ HasValue: true }"
              placeholder = "Type"
              size = "large"
              light-model
              labeled>
              <Option
                label = "Fixed Amount"
                value = "fixed" />
              <Option
                label = "Percentage"
                value = "percentage" />
            </coc-select>
          </div>
          <div class="col s12">
            <coc-button
              :scope = "['promotion-form']"
              placeholder = "Add Promotion"
              type = "default"
              icon = "ios-add-circle"
              class = "right"
              local
              labeled
              @coc-validation-passed = "appForm.promotions.push($_.clone(promotionForm))" />
          </div>
        </div>
      </div>
      <div
        v-if = "init"
        class = "row coc-section">
        <coc-button
          v-if = "init"
          :scope = "['app-form']"
          :request = "{
            method: 'put',
            xdata: $_.omit(appForm, ['_id', '__v']),
            url: `/app`
          }"
          size = "large"
          classes = "right"
          class = "row coc-house-keeper"
          placeholder = "Save"
          icon = "md-checkmark"
          long
          @coc-submit-accepted = "handleUpdateSuccess"
          @coc-validation-refused = "handleValidationRefused"/>
      </div>
      <div class="row">
        <div
          v-if = "init"
          class = "col s12 coc-section">
          <h3 class = "coc-content-text coc-text-heading">Background</h3>
          <div
            v-if = "user"
            class="container">
            <coc-axios
              v-model = "deleteRetriever"
              :xdata = "{}"
              :url = "avatarUrl"
              prevent-on-mount
              method = "delete"
              @success = "handleDeleteSuccess"/>
            <div class="row">
              <div class="col s12 coc-section">
                <div class="col s12 l6 push-l3">
                  <div class="col s6">
                    <Upload
                      id = "avatar-uploader"
                      ref = "upload"
                      :show-upload-list = "false"
                      :on-change="handleAvatarChange"
                      :before-upload="beforeAvatarUpload"
                      :auto-upload="false"
                      :format="['jpg','jpeg','png']"
                      accept = "image/*"
                      action="#"
                      style="border-radius: 5px !important;"
                      class="avatar-uploader">
                      <img
                        v-if = "!imageUrl.length && avatar"
                        :src="avatar"
                        class="full-width">
                      <img
                        v-else-if = "imageUrl"
                        :src="imageUrl"
                        class="full-width">
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
                  <div class = "col s6">

                    <Button
                      :loading = "uploadRetriever.loading"
                      :disabled = "!imagesFiles || !imagesFiles.length"
                      type = "success"
                      size = "large"
                      class = "coc-padding-x-10px coc-margin-bottom-10px"
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
                      class = "coc-padding-x-10px coc-margin-bottom-10px"
                      icon = "md-trash coc-text-md-2"
                      long
                      @click = "deleteAvatar">
                      <span class="coc-text-md-2">Remove</span>
                    </Button>
                    <Button
                      :loading = "deleteRetriever.loading"
                      :disabled = "!imagesFiles || !imagesFiles.length"
                      type = "warning"
                      size = "large"
                      class = "coc-padding-x-10px"
                      icon = "ios-close-circle-outline coc-text-md-2"
                      long
                      @click = "cancelAvatarSelection">
                      <span class="coc-text-md-2">Cancel</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </master>
</template>

<script>
import config from '~/config'
import Master from '~/components/common/master'
export default {
  name: 'AppIndex',
  head: {
    title: 'Dashboard | Manage App data'
  },
  components: {
    Master
  },
  data() {
    return {
      phoneInput: '',
      source: null,
      onPrintDemo: false,
      promotionForm: {
        name: '',
        type: '',
        amount: ''
      },
      app: null,
      appForm: { name: '', roles: [] },
      // appForm.background_redirect: { url: '', placeholder: '' },
      upload: null,
      imageUrl: '',
      imagesFiles: null,
      uploadRetriever: { loading: false },
      deleteRetriever: { loading: false },
      uploadFD: null
    }
  },
  computed: {
    init() {
      return this.$store.state.core.app
    },
    auth() {
      return this.$store.state.core.auth
    },
    user() {
      return this.$store.state.core.auth
    },
    avatarUrl() {
      return this.user ? `${config.baseURL}/app/background` : null
    },
    avatar() {
      return this.init && this.init.background
        ? `${config.baseURL}/app/background`
        : null
    }
  },
  watch: {
    init: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val) {
          this.app = this.$_.cloneDeep(val)
          this.appForm = this.$_.cloneDeep(val)
          // this.appForm.background_redirect = this.$_.cloneDeep(val.background_redirect)
        }
      }
    }
  },
  mounted() {
    setTimeout(() => {
      if (this.appForm) {
        this.$root.$emit('COCFormController', {
          scope: ['vat'],
          type: 'input',
          controller: 'update',
          credentials: this.appForm.vat.toString()
        })
        this.$root.$emit('COCFormController', {
          scope: ['jobs_count'],
          type: 'input',
          controller: 'update',
          credentials: this.appForm.jobs_count.toString()
        })
      }
    }, 1000)
  },
  methods: {
    handleUpdateSuccess({ meta: { response } }) {
      this.$store.dispatch('setApp', response)
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
      }
      this.imagesFiles = [file]
      this.imageUrl = URL.createObjectURL(file)
      return isLt2M
    },
    uploadAvatar() {
      if (this.imagesFiles && this.imagesFiles.length) {
        this.uploadFD = new FormData()
        this.uploadFD.append('avatar', this.imagesFiles[0])
        this.uploadRetriever.loading = true
        setTimeout(() => {
          this.$axios({
            url: this.avatarUrl,
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
      this.$store.dispatch('setApp', tempData)
      setTimeout(() => {
        this.$Message.success({
          content: 'Done'
        })
        this.$store.dispatch('setApp', data)
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
      this.$store.dispatch('app', e.response)
    },
    handleValidationRefused(e) {
      console.log(e)
    }
  }
}
</script>

<style lang="css" scoped>
.home-background-cover{
  background-size: cover !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
}
.coc-browser-container{
  border : 3px solid #546e7a;
  border-radius : 25px;
  min-height : 200px;
  padding: 10px 20px 0px 20px;
  background-color : #FBF9F5;
}
.coc-browser-screen{
  border : 3px solid #455a64;
  border-radius : 5px;
  min-height : 200px;
  padding : 0px;
  margin : 0px;
  background-color : #FFF;
}
#coc-browser-main-screen{
  max-height : 600px;
  overflow-y : auto
}
.coc-browser-dot-small{
  height : 20px;
  width : 20px;
  border-radius : 50%;
}
.ui.button {
  font-weight : 400; 
  font-family : titillium
}
.coc-eventbrite:before{
  color : #fff;
}
.demo-box-container{
  width: 98vw;
  position: absolute;
  left: 1vw;
  z-index: 100;
}
</style>
