<template>
  <div :class="['layout', { print: onPrint }]">
    <coc-watch-my-window v-model = "win" />
    <drawer
      v-model = "addStockModal"
      width = "90%"
      class = "coc-background-bg coc-padding-0"
      footer-hide>
      <add-stock
        v-bind = "stockData"
        class = "coc-margin-top-25px coc-background-bg"
        @success = "handleAddSuccess" />
    </drawer>
    <Modal
      v-model = "authModal"
      class = "coc-background-bg"
      footer-hide>
      <div class = "coc-margin-top-30px coc-margin-bottom-0">
        <h3 class="text-title coc-primary-text center">
          {{ authMode === 'login' ? 'Login' : 'Register' }}
        </h3>
        <transition
          enter-active-class = "animated zoomIn"
          leave-active-class = "animated zoomOut">
          <login
            v-if = "authMode === 'login'"
            @success = "authModal = false"/>
        </transition>
        <transition
          enter-active-class = "animated zoomIn"
          leave-active-class = "animated zoomOut">
          <register
            v-if = "authMode === 'register'"
            class = "coc-margin-bottom-20px"
            @success = "authModal = false"/>
        </transition>
        <div class="row">
          <a
            class = "coc-padding-left-0 no-outline right"
            @click = "authMode = authMode === 'login' ? 'register' : 'login'">
            {{ authMode === 'login' ? 'Create an account' : 'Already have an account? Login' }}
          </a>
        </div>
      </div>
    </Modal>
    <Layout>
      <Layout>
        <Sider 
          ref="side1" 
          v-model="isCollapsed"
          :collapsed-width="78" 
          :class = "[{hidden: onPrint}, { 'responsivesider animated slideInLeft': win && win.isSmall && !isCollapsed }, { hidden: win && win.isSmall && isCollapsed }]"
          class = "coc-background-bg coc-border-0 coc-border-right-1 coc-border-border"
          hide-trigger 
          collapsible>
          <div
            v-if = "win && win.isSmall && !isCollapsed"
            class = "coc-primary-text coc-padding-y-10px coc-padding-x-5px"
            @click = "isCollapsed = !isCollapsed">
            <i
              class="ivu-icon ivu-icon-ios-menu" />
            <span>Hide Menu</span>
          </div>
          <Menu 
            :class="menuitemClasses"
            active-name="jobs" 
            theme="light" 
            width="auto"
            class = "coc-background-bg coc-content-text" 
            @on-select = "handleSidebarSelect">
            <menu-item
              v-if = "$utils.roles.hasRole('jobs',user)"
              name="jobs"
              class = "sidebar-menu-item">
              <i class="tcsc-transportation-icon" />
              <span>Running</span>
            </menu-item>
            <menu-item
              v-if = "$utils.roles.hasRole('stocks',user)"
              name="stock"
              class = "sidebar-menu-item">
              <i class="tcsc-inventory-1-icon" />
              <span>Add Stock</span>
            </menu-item>
            <menu-item
              v-if = "$utils.roles.hasRole('stocks',user)"
              name="moves"
              class = "sidebar-menu-item">
              <i class="tcsc-stock-icon" />
              <span>Moves</span>
            </menu-item>
          </Menu>
          <div 
            v-if = "!isCollapsed && sidebarActive === 'jobs' && user && $utils.roles.hasRole('jobs',user)" 
            class = "row coc-margin-top-30px">
            <Card 
              :padding="0" 
              class = "coc-background-bg coc-content-text"
              shadow 
              style="width: 100%;">
              <p
                slot = "title"
                class = "coc-content-text">
                <icon type = " coc-content-text tcsc-transportation-icon" />
                <span class = "coc-content-text">Running Jobs</span>
              </p>
              <div class="row  coc-margin-y-0 coc-padding-y-3px coc-border-border">
                <div class="col s12 coc-padding-x-5px">
                  <coc-input
                    v-model = "input.job.search"
                    placeholder = "Search.."
                    icon = "ios-search"
                    light-model />
                </div>
              </div>
              <CellGroup
                v-coc-loading = "loaders.jobs"
                v-if = "jobs.length"
                class = "side-jobs">
                <Cell 
                  v-for = "(job, j) in jobs" 
                  :key = "j" 
                  :label="job.car.model" 
                  :to = "$route.path == `/jobs/${job.job_no}` ? null : `/jobs/${job.job_no}`"
                  :selected = "$route.path == `/jobs/${job.job_no}`"
                  :extra = "$route.path == `/jobs/${job.job_no}` ? null : `#${job.job_no}`"
                  class = "animated slideInLeft">
                  <div class = "row coc-house-keeper">
                    <coc-avatar
                      :source = "`/snaps/brands/png/${job.car.brand.split(' ').join('-').toLowerCase()}.png`"
                      scale = "25px"
                      class = "col coc-padding-x-2px"/>
                    <span class="col coc-margin-x-0px show-item-name">
                      {{ job.car.brand | CocCapitalizeName }}
                    </span>
                  </div>
                </Cell>
              </CellGroup>
              <CellGroup
                v-coc-loading = "loaders.jobs"
                v-if = "!jobs.length"
                class = "side-jobs">
                <Cell title = "No Matching Jobs Found"/>
              </CellGroup>
            </Card>
          </div>
        </Sider>
        <Layout>
          <Header :class = "[{hidden: onPrint}, 'master-header']">
            <Menu 
              mode="horizontal" 
              theme="dark" 
              active-name="1">
              <div class="layout-logo">
                <div
                  :class = "[{'left-menu-on-small': win && win.isSmall}]"
                  class="row">
                  <Icon 
                    :class="rotateIcon" 
                    class = "coc-secondary-text col" 
                    type="ios-menu" 
                    size="33" 
                    @click.native="collapsedSider"/>
                  <nuxt-link to = "/">
                    <coc-avatar
                      v-coc-mouse-over="'pulse'"
                      v-coc-mouse-leave="'jello'"
                      :source="$coc.App.logo.primary"
                      scale = "40px"
                      class="logo col coc-padding-0 animated"/>
                  </nuxt-link>
                </div>
              </div>
              <div class="layout-nav">
                <menu-item
                  v-if = "$utils.roles.hasRole('jobs',user)"
                  class = "hide-on-small-only"
                  name="1">
                  <nuxt-link
                    to = "/jobs"
                    class = "coc-secondary-text">
                    <Icon type="ios-build" />
                    Jobs
                  </nuxt-link>
                </menu-item>
                <menu-item
                  v-if = "$utils.roles.hasRole('stocks',user)"
                  class = "hide-on-small-only"
                  name="2">
                  <nuxt-link
                    to = "/stock"
                    class = "coc-secondary-text">
                    <Icon type="ios-archive" />
                    Stock
                  </nuxt-link>
                </menu-item>
                <menu-item
                  v-if = "$utils.roles.dashboarder(user)"
                  class = "hide-on-small-only"
                  name="3">
                  <nuxt-link
                    to = "/analytics"
                    class = "coc-secondary-text">
                    <Icon type="ios-analytics" />
                    Analytics
                  </nuxt-link>
                </menu-item>
                <menu-item
                  :class = "[{'avatar-item-on-small': win && win.isSmall}]"
                  name="4">
                  <span 
                    v-if = "!user" 
                    class = " coc-text-normal-1 ivu-icon ivu-icon-ios-log-in hide-on-med-and-up" 
                    @click = "activateAuthModal" />
                  <span 
                    v-if = "!user" 
                    class = " coc-text-normal-1 hide-on-med-and-down" 
                    @click = "activateAuthModal"> Login </span>
                  <Dropdown v-else>
                    <Button
                      type="text" 
                      size = "large"
                      class="client-navbar-action coc-primary-hover-tint-9-bg coc-padding-x-10px">
                      <span class="coc-primary-text coc-text-normal-1"/>
                      <Avatar 
                        :icon="!user.avatar ? 'ios-person' : null"
                        :src="avatar" 
                        size="large"
                        class = "coc-primary-tint-9-bg coc-primary-tint-7-text coc-margin-y-0" />
                    </Button>
                    <DropdownMenu slot="list">
                      <DropdownItem
                        class = "coc-border-0 coc-border-bottom-1 coc-border-border"
                        style = "min-width: 150px">
                        <nuxt-link
                          class = "coc-primary-shade-2-text coc-primary-hover-shade-4-text coc-text-normal-1 text coc-text-hover-normal-2 coc-smooth-font-size full-width block"
                          to = "/profile">
                          <icon type = " knocks-user2" />
                          Profile
                        </nuxt-link>
                      </DropdownItem>
                      <DropdownItem
                        v-if = "$utils.roles.hasRole('jobs',user)"
                        class = "hide-on-med-and-up coc-border-0 coc-border-bottom-1 coc-border-border">
                        <nuxt-link
                          to = "/jobs"
                          class = "coc-primary-shade-2-text coc-primary-hover-shade-4-text coc-text-normal-1 text coc-text-hover-normal-2 coc-smooth-font-size full-width block">
                          <Icon type="ios-build" />
                          Jobs
                        </nuxt-link>
                      </DropdownItem>
                      <DropdownItem
                        v-if = "$utils.roles.hasRole('stocks',user)"
                        class = "hide-on-med-and-up coc-border-0 coc-border-bottom-1 coc-border-border">
                        <nuxt-link
                          to = "/stock"
                          class = "coc-primary-shade-2-text coc-primary-hover-shade-4-text coc-text-normal-1 text coc-text-hover-normal-2 coc-smooth-font-size full-width block">
                          <Icon type="ios-archive" />
                          Stock
                        </nuxt-link>
                      </DropdownItem>
                      <DropdownItem
                        v-if = "$utils.roles.dashboarder(user)"
                        class = "coc-border-0 coc-border-bottom-1 coc-border-border hide-on-med-and-up">
                        <nuxt-link
                          to = "/analytics"
                          class = "coc-primary-shade-2-text coc-primary-hover-shade-4-text coc-text-normal-1 text coc-text-hover-normal-2 coc-smooth-font-size full-width block">
                          <Icon type="ios-analytics" />
                          Analytics
                        </nuxt-link>
                      </DropdownItem>
                      <DropdownItem
                        v-if = "$utils.roles.dashboarder(user)"
                        class = "coc-border-0 coc-border-bottom-1 coc-border-border">
                        <nuxt-link
                          class = "coc-primary-shade-2-text coc-primary-hover-shade-4-text coc-text-normal-1 text coc-text-hover-normal-2 coc-smooth-font-size  full-width block"
                          to = "/users">
                          <icon type = " knocks-users" />
                          Manage Users
                        </nuxt-link>
                      </DropdownItem>
                      <DropdownItem
                        v-if = "$utils.roles.dashboarder(user)"
                        class = "coc-border-0 coc-border-bottom-1 coc-border-border">
                        <nuxt-link
                          class = "coc-primary-shade-2-text coc-primary-hover-shade-4-text coc-text-normal-1 text coc-text-hover-normal-2 coc-smooth-font-size  full-width block"
                          to = "/app">
                          <icon 
                            type = " knocks-cogs" />
                          App Configurations
                        </nuxt-link>
                      </DropdownItem>
                      <DropdownItem style = "min-width: 150px">
                        <a
                          class = "coc-primary-shade-2-text coc-primary-hover-shade-4-text coc-text-normal-1 text coc-text-hover-normal-2 coc-smooth-font-size  full-width block"
                          @click = "logout">
                          <icon type = " knocks-log-out" />
                          Logout
                        </a>
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </menu-item>
              </div>
            </Menu>
          </Header>
          <Content
            :style="{padding: '0 2vw'}"
            :class = "[ { 'white content-print': onPrint }, { 'black-text': onPrint } ]"
            class = "coc-primary-background-bg coc-content-text">
            <Breadcrumb
              v-if = "!onPrint"
              :style="{margin: '20px 0'}">
              <BreadcrumbItem 
                v-for = "(crumb, c) in analysisBreadcrump()" 
                :key = "c"
                :to = "`/${ analysisBreadcrump(false).splice( 0, c ).join('/') }`"
                class = "coc-content-text">
                <span class="coc-content-text">{{ crumb | CocCapitalizeName }}</span>
              </BreadcrumbItem>
            </Breadcrumb>
            <Card 
              v-else 
              class = "row coc-margin-top-5px animated fadeIn coc-border-0 coc-border-bottom-2 white black-text coc-none-border-radius">
              <p
                v-if = "$store.state.core.app"
                class="coc-text-lg-1 coc-text-bold coc-margin-y-0 coc-padding-y-0">
                <coc-avatar
                  :source = "$coc.App.logo.primary"
                  scale = "50px"
                  class = "col coc-margin-right-10px coc-margin-y-0 coc-padding-y-0"/>
                {{ $store.state.core.app.title }}
                <small 
                  v-if = "$store.state.core.app.subtitle" 
                  class = "coc-text-thin">{{ $store.state.core.app.subtitle }}</small>
                <small class="right coc-text-body"> {{ $moment().format('D/M/YYYY h:m A') }} </small>
              </p>
              <p
                v-if = "$store.state.core.app"
                class="left">
                <span
                  v-for = "(phone, p) in $store.state.core.app.phones"
                  :key = "p">
                  <span class="coc-text-md-2"><Icon type= "ios-call"/> {{ phone }}</span><br>
                </span>
                <span class="coc-text-md-1"><Icon type= "ios-navigate"/>{{ $store.state.core.app.address }}</span>
              </p>
            </Card>
            <Card :class = "[ { white: onPrint }, { 'black-text coc-border-0': onPrint } ]">
              <div style="min-height: 70vh;">
                <slot />
              </div>
            </Card>
          </Content>
          <Footer
            v-if = "!onPrint"
            :class = "[ { white: onPrint }, { 'black-text': onPrint } ]"
            class="layout-footer-center coc-primary-background-bg">
            <span 
              class = "">
              <b style="font-family: jura; font-weight: bold; font-size: 120%">TUATARA</b> <b style="font-family: jura;" >GMS</b> 2019&copy;
              <br>by
              <a 
                href = "https://twitter.com/CocDevs" 
                target="_blank">
                <icon 
                  type = "logo-twitter" 
                  class = "blue-text" />
                <b>@CocDevs</b>
              </a>
            </span>
            <br><b style="" >V{{ $coc.App.version }}</b>
          </Footer>
          <Footer
            v-else
            :class = "[ { white: onPrint }, { 'black-text': onPrint } ]"
            class="layout-footer-center coc-primary-background-bg print-footer">
            <span 
              style = "font-size: 90%; color: grey">
              <b style="font-family: jura; font-weight: bold; font-size: 107%">TUATARA</b>
              <b style="font-family: jura;" > GMS V1.4 </b> 
              by
              <icon 
                type = "logo-twitter" 
                class = "blue-text" />
              <b style="">@CocDevs</b>
              2019 &copy;
            </span>
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  </div>
</template>
<script>
import config from '~/config'
import Login from '../auth/Login.vue'
import Register from '../auth/Register.vue'
import AddStock from '~/components/stock/add.vue'
export default {
  name: 'Master',
  components: {
    Login,
    Register,
    AddStock
  },
  props: {
    crumbs: {
      type: Array,
      default: null
    },
    onPrint: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      stockData: {
        mode: 'post',
        init: null
      },
      win: {
        isSmall: false
      },
      loaders: { jobs: false },
      events: new this.$coc.Event({ api: this.$root }),
      authMode: 'login',
      authModal: false,
      addStockModal: false,
      isCollapsed: false,
      sidebarActive: 'jobs',
      input: {
        job: {
          search: ''
        }
      }
    }
  },
  computed: {
    jobs() {
      return this.$store.state.jobs.running.filter(
        j =>
          j.job_no.toString().includes(this.input.job.search) ||
          j.car.brand
            .toLowerCase()
            .includes(this.input.job.search.toLowerCase()) ||
          j.car.model
            .toLowerCase()
            .includes(this.input.job.search.toLowerCase()) ||
          j.client.name
            .toLowerCase()
            .includes(this.input.job.search.toLowerCase()) ||
          j.client.phone
            .toLowerCase()
            .includes(this.input.job.search.toLowerCase())
      )
    },
    user() {
      return this.$store.state.core.auth
    },
    avatar() {
      if (this.user && this.user.avatar && this.user.auth_type !== 'local') {
        return this.user.avatar
      }
      return this.user && this.user.avatar
        ? `${config.baseURL}/users/${this.user._id}/avatar`
        : null
    },
    rotateIcon() {
      return ['menu-icon', this.isCollapsed ? 'rotate-icon' : '']
    },
    menuitemClasses() {
      return ['menu-item', this.isCollapsed ? 'collapsed-menu' : '']
    }
  },
  watch: {
    isCollapsed(e) {
      this.$emit('collapse', e)
      this.$emit(e ? 'sider-on' : 'sider-off')
    },
    onPrint(v) {
      if (process.browser) {
        const body = document.body
        if (v) {
          if (!body.classList.contains('white')) {
            body.classList.add('white')
          }
        } else if (body.classList.contains('white'))
          body.classList.remove('white')
      }
    }
  },
  mounted() {
    const vm = this
    this.getJobs()
    this.events.OnMap({
      askForLogin(e) {
        if (e && e.mode && e.mode === 'register') {
          vm.authMode = 'register'
        } else {
          vm.authMode = 'login'
        }
        vm.authModal = true
      },
      updateRunningJobs() {
        vm.getJobs()
      },
      LoggedIn() {
        setTimeout(() => {
          vm.getJobs()
        }, 3000)
      },
      addStock(e) {
        if (e) {
          vm.stockData = e
        } else vm.stockData = null
        vm.addStockModal = true
      }
    })
    if (this.win && this.win.isSmall) this.isCollapsed = true
  },
  methods: {
    getJobs() {
      this.loaders.jobs = true
      this.$axios({
        method: 'get',
        url: '/job',
        params: { status: 'running', stats: 'yes' }
      })
        .then(({ data: { jobs } }) => {
          this.loaders.jobs = false
          this.$store.dispatch('setRunningJobs', jobs)
        })
        .catch(() => {
          this.loaders.jobs = false
        })
    },
    handleSidebarSelect(e) {
      this.sidebarActive = e
      this.isCollapsed = false
      if (e === 'jobs') {
        this.getJobs()
      } else if (e === 'stock') {
        this.stockData = {
          mode: 'post',
          init: null
        }
        this.addStockModal = true
      } else if (e === 'moves') {
        this.$router.push('/moves')
      }
    },
    collapsedSider() {
      this.$refs.side1.toggleCollapse()
    },
    activateAuthModal() {
      this.authModal = true
    },
    handleName(name) {
      if (!name) return ''
      return name.length > 11 ? name.split(' ')[0] : name
    },
    logout() {
      this.$cookies.set('auth', null, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7
      })
      this.$axios.defaults.headers.common['Authorization'] = null
      this.$store.dispatch('setAuth', null)
    },
    handleAddSuccess(e) {
      this.stockData = {
        mode: 'post',
        init: null
      }
      this.addStockModal = false
      this.$root.$emit('addStockSuccess', e)
    },
    analysisBreadcrump(appendDashboard = true) {
      const psudoAppend = []
      if (appendDashboard) psudoAppend.push('Dashboard')
      {
        const parts =
          this.crumbs ||
          this.$route.path.split('/').filter(c => c !== '/' && c.length)
        return [...psudoAppend, ...parts]
      }
    }
  }
}
</script>
<style scoped>
@font-face {
  font-family: 'jura';
  src: url('/fonts/Jura/Jura-Regular.ttf');
  font-weight: 250;
  font-style: normal;
}
@font-face {
  font-family: 'jura';
  src: url('/fonts/Jura/Jura-Bold.ttf');
  font-weight: bold;
  font-style: normal;
}
.layout {
  position: relative;
  overflow: hidden;
}
.layout.print {
  background-color: white !important;
  min-height: 100vh;
  margin: 0 !important;
  border-radius: 0 !important;
  border: 0px solid #fff !important;
}
.layout-header-bar {
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}
.layout-logo-left {
  width: 90%;
  height: 30px;
  border-radius: 3px;
  margin: 15px auto;
}
.menu-icon {
  transition: all 0.3s;
}
.rotate-icon {
  transform: rotate(-90deg);
}
.menu-item span {
  display: inline-block;
  overflow: hidden;
  width: 69px;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  transition: width 0.2s ease 0.2s;
}
.menu-item i {
  transform: translateX(0px);
  transition: font-size 0.2s ease, transform 0.2s ease;
  vertical-align: middle;
  font-size: 23px;
}
.collapsed-menu span {
  width: 0px;
  transition: width 0.2s ease;
}
.collapsed-menu i {
  transform: translateX(5px);
  transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
  vertical-align: middle;
  font-size: 22px;
}
.layout-logo {
  width: 100px;
  height: 30px;
  background: transparent;
  border-radius: 3px;
  float: left;
  position: relative;
  top: 15px;
  left: 20px;
}
.layout-nav {
  width: 420px;
  margin: 0 auto;
  margin-right: 20px;
}
.layout-footer-center {
  text-align: center;
}
.side-jobs {
  min-height: 50vh;
  max-height: 70vh;
  overflow-y: auto;
}
.show-item-name {
  width: 100px;
  white-space: nowrap;
  overflow: hidden !important;
  text-overflow: ellipsis;
}
.ivu-layout-header,
.ivu-menu-dark {
  background-color: #007aff;
}
.responsivesider {
  position: fixed;
  z-index: 999;
  min-height: 100vh;
}
.print-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px;
}
.content-print {
  padding-bottom: 103px !important;
}
.sidebar-menu-item {
  height: 64px;
  border-radius: 0 !important;
}
.avatar-item-on-small {
  margin-right: 3rem;
  float: right;
}
.left-menu-on-small {
  padding-left: 0 !important;
  margin-left: -3rem !important;
}
</style>
