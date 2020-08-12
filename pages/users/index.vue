ff<template>
  <master>
    <div
      v-if = "auth"
      class = "coc-padding-x-3perc coc-padding-y-1perc">
      <div class = "row">
        <Modal
          v-model = "aboutUserModal"
          title = "About"
          footer-hide>
          <Tabs v-model = "userInfoTabs">
            <TabPane
              label = "Info"
              name = "info">
              <div
                v-if = "userInfo"
                class = "row coc-section">
                <div class = "col s12 l3">
                  <coc-avatar
                    :source = "getAvatarUrl(userInfo)"
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
                    :icon = "!getAvatarUrl(userInfo) ? 'ivu-icon ivu-icon-ios-person' : null"
                    scale = "100px"
                    border-radius = "circle"/>
                </div>
                <div class = "col s12 l9">
                  <div style = "">
                    <p class = "coc-primary-text coc-text-heading">
                      <Icon
                        type = "ios-person-outline"
                        class = "coc-primary-tint-3-text"/>
                      {{ userInfo.name | CocCapitalizeName }}
                    </p>
                    <p class = "coc-primary-text coc-text-heading email-wrapper">
                      <Icon
                        :type = "getAuthTypeIcon(userInfo.auth_type)"
                        class = "coc-primary-tint-3-text"/>
                      <Tooltip :content = "userInfo.email">
                        <a
                          v-if = "userInfo.auth_type === 'facebook'"
                          :href="generateSocialUrl(userInfo.auth_type)" 
                          target="_blank"
                          class = "email-wrapper">{{ userInfo.email }}</a>
                        <span 
                          v-else 
                          class = "email-wrapper">{{ userInfo.email }}</span>
                      </Tooltip>
                    </p>
                  </div>
                </div>
              </div>
            </TabPane>
          </Tabs>
        </Modal>
        <Modal
          v-model = "editUserModal"
          title = "Edit User"
          footer-hide>
          <p
            v-if = "userOnEdit"
            class = "coc-primary-text coc-text-normal-2">
            <Avatar
              :src = "getAvatarUrl(userOnEdit)"
              :icon = "getAvatarUrl(userOnEdit) ? null : 'ios-person'"/>
            {{ userOnEdit.name }}
          </p>
          <edit-user
            :init = "userOnEdit"
            class = "coc-margin-top-20px"
            @success = "handleUserUpdate"/>
        </Modal>
        <div class="col s12 l3 coc-padding-y-5px">
          <Input
            v-model = "searchInput.name"
            placeholder = "Search name"
            size = "large"
            icon = "ios-search"></Input> <!-- eslint-disable-line -->
        </div>
        <div class="col s12 l3 coc-padding-y-5px">
          <Input
            v-model = "searchInput.email"
            placeholder = "Search Email"
            size = "large"
            icon = "ios-search"></Input> <!-- eslint-disable-line -->
        </div>
        <div class="col s12 l3 coc-padding-y-5px">
          <Select
            v-model = "searchInput.roles"
            placeholder = "Roles"
            size = "large"
            icon = "ios-search"
            multiple>
            <Option value = "admin">Admin</Option>
            <Option value = "client">Client</Option>
            <Option value = "stocks">Stocks</Option>
            <Option value = "jobs">Jobs</Option>
          </Select>
        </div>
        <div class="col s12 l3 coc-padding-y-5px">
          <Button
            type = "primary"
            icon = "ios-search"
            long
            @click = "research">Search</Button>
        </div>
      </div>
      <div class = "row">
        <div
          v-coc-mouse-over = "'coc-text-md-2 coc-primary-text'"
          v-for = "(user, index) in users"
          :key = "index"
          class="col s12 coc-padding-y-0 coc-smooth-font-size coc-margin-y-5px coc-padding-x-0 coc-border-hover-tint-6-bg coc-bounced-border-radius">
          <Avatar
            :src = "getAvatarUrl(user)"
            :icon = "getAvatarUrl(user) ? null : 'ios-person'"/>
          {{ user.name }} <span v-if = "user._id === auth._id">(You)</span>
          <tag 
            v-for = "(role, r) in user.roles" 
            :key = "r"> {{ role | CocCapitalizeName }} </tag>
          <Tooltip
            class = "right"
            placement= "top">
            <span slot = "content">Edit</span>
            <Button
              icon = "md-create"
              type = "default"
              shape = "circle"
              @click = "editUser(user)"/>
          </Tooltip>
          <Tooltip
            class = "right"
            placement= "left">
            <span slot = "content">Info</span>
            <Button
              icon = "md-information"
              type = "info"
              shape = "circle"
              class = "coc-margin-x-5px"
              @click = "getUserinfo(user)"/>
          </Tooltip>
        </div>
      </div>
      <div
        v-if = "users && pagination"
        class="row">
        <Page 
          :total="pagination.pages * pagination.limit"
          :page-size = "pagination.limit"
          :current = "currentPage + 1"
          show-total
          show-elevator
          @on-change = "handlePageChange" />
      </div>
    </div>
  </master>
</template>

<script>
import config from '~/config'
import Master from '~/components/common/master'
import EditUser from '~/components/users/EditUsers'
export default {
  name: 'MangeUsersIndex',
  components: {
    Master,
    EditUser
  },
  head: {
    title: 'Dashboard | Manage Users'
  },
  data() {
    return {
      users: [],
      searchInput: {
        name: '',
        email: '',
        roles: [],
        action: '',
        tab: ''
      },
      ordersModel: null,
      isMounted: false,
      editUserModal: false,
      aboutUserModal: false,
      userOnEdit: null,
      userInfo: null,
      userInfoTabs: 'info',
      userOrdersResolver: null,
      pagination: null,
      currentPage: 0
    }
  },
  computed: {
    searchQuery() {
      const query = this.$_.cloneDeep(this.searchInput)
      query.roles = query.roles.join(',')
      return query
    },
    auth() {
      return this.$store.state.core.auth
    }
  },
  mounted() {
    setTimeout(() => {
      if (!this.auth || !this.$utils.roles.dashboarder(this.auth)) {
        this.$router.push('/')
      }
      if (this.$route.query.name) {
        this.searchInput.name = this.$route.query.name
      }
      if (this.$route.query.action) {
        this.searchInput.action = this.$route.query.action
      }
      if (this.$route.query.tab) {
        this.searchInput.tab = this.$route.query.tab
      }
      if (this.$route.query.email) {
        this.searchInput.email = this.$route.query.email
      }
      if (this.$route.query.roles) {
        this.searchInput.roles = this.$route.query.roles.split(',')
      }
      if (this.$route.query.page) {
        const parsed = parseInt(this.$route.query.page, 10)
        this.currentPage = parsed !== NaN ? parsed - 1 : 0
      }
      this.search()
    }, 1000)
  },
  methods: {
    research() {
      this.currentPage = 0
      this.search()
    },
    search() {
      this.$axios({
        url: '/users/search',
        method: 'get',
        params: {
          ...this.searchQuery,
          page: this.currentPage
        }
      }).then(res => {
        this.users = res.data.users
        this.pagination = this.$_.pick(res.data, ['page', 'pages', 'limit'])
        this.$router.push({
          query: {
            ...this.searchQuery,
            page: this.currentPage + 1
          }
        })
        if (
          !this.isMounted &&
          this.$route.query.action === 'info' &&
          res.data.users.length
        ) {
          this.isMounted = true
          if (this.$route.query.tab) this.userInfoTabs = this.$route.query.tab
          this.getUserinfo(res.data.users[0])
        }
      })
    },
    getAvatarUrl(user) {
      if (user && user.avatar && user.auth_type !== 'local') {
        return user.avatar
      }
      return user && user.avatar
        ? `${config.baseURL}/users/${user._id}/avatar`
        : null
    },
    editUser(user) {
      this.userOnEdit = user
      this.editUserModal = true
    },
    getUserinfo(user) {
      this.userInfo = user
      this.userOrdersResolver = {
        route: `/orders/user/all/${user._id}`,
        extract: data => data
      }
      this.aboutUserModal = true
    },
    handleUserUpdate({ meta: { response } }) {
      this.users[
        this.users.findIndex(i => i._id === this.userOnEdit._id)
      ] = response
      this.editUserModal = false
    },
    handlePageChange(e) {
      this.currentPage = e - 1
      this.$router.push({ query: { page: this.currentPage + 1 } })
      this.search()
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
        return `https://www.facebook.com/profile?id=${this.userInfo.social.id}`
    }
  }
}
</script>

<style lang="css" scoped>
.email-wrapper{
  width: 100%;
  white-space: nowrap;
  overflow: hidden !important;
  text-overflow: ellipsis;
}
</style>
