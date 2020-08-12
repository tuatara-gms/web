<template>
  <div v-if = "init">
    <coc-input
      v-model = "userForm.name"
      :rules = "{ HasValue: { active: true } }"
      :scope = "['edit-users']"
      placeholder = "Name"
      size = "large"
      icon = "ios-person"
      light-model/>
    <coc-select
      v-model = "userForm.roles"
      :rules = "{ HasValue: { active: true } }"
      :scope = "['edit-users']"
      placeholder = "Roles"
      size = "large"
      icon = "ios-person"
      multiple
      light-model>
      <Option value = "admin">admin</Option>
      <Option value = "client">client</Option>
      <Option value = "stocks">stocks</Option>
      <Option value = "jobs">jobs</Option>
    </coc-select>
    <coc-input
      v-model = "userForm.email"
      :rules = "{ HasValue: { active: true } }"
      :scope = "['edit-users']"
      placeholder = "Email"
      size = "large"
      icon = "ios-mail"
      light-model/>
    <coc-input
      v-model = "userForm.phone"
      :rules = "{ HasValue: { active: false } }"
      :scope = "['edit-users']"
      placeholder = "Phone"
      size = "large"
      icon = "ios-phone-portrait"
      light-model/>
    <div class="row coc-margin-y-10px">
      <span class = "coc-text-bold coc-text-md-1">Account Blocked </span>
      <radio-group v-model = "userForm.blocked">
        <Radio 
          :true-value = "true" 
          label = "true">
          <span class = "coc-success-text">
            <Icon type = "md-checkmark-circle-outline"/>
            Blocked
          </span>
        </Radio>
        <Radio 
          :value = "false" 
          label = "false">
          <span class = "coc-error-text">
            <Icon type = "md-close"/>
            Not Blocked
          </span>
        </Radio>
      </radio-group>
    </div>
    <div class="row coc-margin-y-10px">
      <span class = "coc-text-bold coc-text-md-1">Account Verified </span>
      <radio-group v-model = "userForm.is_verified.verified">
        <Radio 
          :true-value = "true" 
          label = "true">
          <span class = "coc-success-text">
            <Icon type = "md-checkmark-circle-outline"/>
            Verified
          </span>
        </Radio>
        <Radio 
          :value = "false" 
          label = "false">
          <span class = "coc-error-text">
            <Icon type = "md-close"/>
            Not Verified
          </span>
        </Radio>
      </radio-group>
    </div>
    <div class="row coc-margin-y-10px">
      <span class = "coc-text-bold coc-text-md-1">Email Verified </span>
      <radio-group v-model = "userForm.is_verified.email">
        <Radio 
          :true-value = "true" 
          label = "true">
          <span class = "coc-success-text">
            <Icon type = "md-checkmark-circle-outline"/>
            Verified
          </span>
        </Radio>
        <Radio 
          :value = "false" 
          label = "false">
          <span class = "coc-error-text">
            <Icon type = "md-close"/>
            Not Verified
          </span>
        </Radio>
      </radio-group>
    </div>
    <div
      class="row coc-house-keeper">
      <coc-button
        v-if = "init"
        :scope = "['edit-users']"
        :request = "{
          method: 'put',
          xdata: $_.pick(userForm, ['name', 'phone', 'gender', 'points', 'whishlist', 'roles', '_id', 'email', 'is_verified', 'blocked']),
          url: `/users/${init._id}`
        }"
        size = "large"
        classes = "right"
        class = "row"
        placeholder = "Submit"
        @coc-submit-accepted = "$emit('success', $event)"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditUser',
  props: {
    init: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      user: null,
      userForm: { name: '', roles: [] }
    }
  },
  watch: {
    init: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val) {
          this.user = this.$_.cloneDeep(val)
          this.userForm = this.$_.cloneDeep(val)
          this.userForm.is_verified.email = this.userForm.is_verified.email.toString()
          this.userForm.is_verified.verified = this.userForm.is_verified.verified.toString()
          this.userForm.blocked = this.userForm.blocked.toString()
        }
      }
    }
  }
}
</script>
