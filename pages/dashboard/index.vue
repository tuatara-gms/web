<template>
  <master>
    <div class="row">
      <Card 
        v-if = "user"
        id = "jobs-create">
        <p 
          slot = "title">
          <icon type = " tcsc-transportation-icon coc-text-md-2 coc-content-text"/>
          <span class="coc-content-text">Create Job</span>
        </p>
        <div class="row">
          <div class="col l4 m6 s12">
            <coc-input
              :disabled = "!($utils.roles.hasRole('jobs', user))"
              :ref = "`${_uid}-phone`"
              v-model = "input.client.phone"
              :scope = "['create-job']"
              :rules = "{ HasValue: { active: true } }"
              :autocomplete-remote = "model => ({ method: 'get', url: '/job', params: { phone: model.val, limit: 5 }})"
              :autocomplete-map-response = "res => $_.uniqBy(res.jobs, j => j.client.phone).map(o => o.client.phone)"
              labeled
              placeholder = "Client Phone"
              icon = "ios-phone-portrait"
              size = "large"
              light-model
              allow-autocomplete
              clearable
              @coc-enter = "handleAutocompleteSelect($event, 'phone')"
              @coc-select = "handleAutocompleteSelect($event, 'phone')" />
          </div>
          <div class="col l4 m6 s12">
            <coc-input
              :disabled = "!($utils.roles.hasRole('jobs', user))"
              :ref = "`${_uid}-name`"
              v-model = "input.client.name"
              :scope = "['create-job']"
              :rules = "{ HasValue: { active: true } }"
              :autocomplete-remote = "model => ({ method: 'get', url: '/job', params: { name: model.val, limit: 5 }})"
              :autocomplete-map-response = "res => $_.uniqBy(res.jobs, j => j.client.name).map(o => o.client.name)"
              labeled
              placeholder = "Client Name"
              icon = "ios-person"
              size = "large"
              light-model
              allow-autocomplete
              clearable
              @coc-enter = "handleAutocompleteSelect($event, 'name')"
              @coc-select = "handleAutocompleteSelect($event, 'name')" />
          </div>
          <div class="col l4 m6 s12">
            <coc-input
              v-if = "brands && brands.length && isMounted"
              :disabled = "!($utils.roles.hasRole('jobs', user))"
              v-model = "input.car.brand"
              :scope = "['create-job']"
              :rules = "{ HasValue: true }"
              :data = "brands"
              :icon = "input.car.brand && input.car.brand.length ? null : 'ios-color-filter'"
              :style = "input.car.brand && input.car.brand.length ? 'width: calc( 100% - 40px )' : 'width: 100%'"
              labeled
              placeholder = "Car Brand"
              size = "large"
              class = "col"
              light-model
              allow-autocomplete
              clearable />
            <coc-avatar
              v-if = "input.car.brand && input.car.brand.length"
              slot = "suffix"
              :disabled = "!($utils.roles.hasRole('jobs', user))"
              :source = "`/snaps/brands/png/${input.car.brand.split(' ').join('-').toLowerCase()}.png`"
              scale = "30px"
              class = "col coc-margin-left-4px coc-margin-top-25px"/>
          </div>
          <div class="col l4 m6 s12">
            <coc-input
              :disabled = "!($utils.roles.hasRole('jobs', user))"
              v-model = "input.car.model"
              :scope = "['create-job']"
              :rules = "{ HasValue: true }"
              :autocomplete-remote = "model => ({ method: 'get', url: '/job', params: { brand: input && input.car && input.car.brand ? input.car.brand : '' ,model: model.val, limit: 5 }})"
              :autocomplete-map-response = "res => $_.uniqBy(res.jobs, j => j.car.model).map(o => o.car.model)"
              labeled
              placeholder = "Car Model"
              icon = "ios-car"
              size = "large"
              light-model
              allow-autocomplete
              clearable />
          </div>
          <div class="col l4 m6 s12">
            <coc-select
              :disabled = "!($utils.roles.hasRole('jobs', user))"
              v-model = "input.car.release"
              :scope = "['create-job']"
              :rules = "{ HasValue: true }"
              :data = "generateYears()"
              labeled
              placeholder = "Release Year"
              icon = "ios-calendar"
              size = "large"
              filterable
              clearable
              light-model />
          </div>
          <div class="col l4 m6 s12">
            <coc-input
              :disabled = "!($utils.roles.hasRole('jobs', user))"
              v-model = "input.car.kilometers"
              :scope = "['create-job']"
              :rules = "{ HasValue: true, IsNumericString: true, NumberGreaterThan: 0 }"
              labeled
              placeholder = "Kilometers"
              icon = "ios-speedometer"
              size = "large"
              light-model
              clearable />
          </div>
          <!-- <div class="col l4 m6 s12">
            <coc-input
              :disabled = "!($utils.roles.hasRole('jobs', user))"
              v-model = "input.car.chase"
              :scope = "['create-job']"
              :rules = "{ HasValue: true }"
              labeled
              placeholder = "Chase Number"
              icon = "ios-barcode"
              size = "large"
              light-model />
          </div> -->
          <div class="col l4 m6 s12">
            <coc-input
              :disabled = "!($utils.roles.hasRole('jobs', user))"
              v-model = "input.reciptionist"
              :scope = "['create-job']"
              :rules = "{ HasValue: true }"
              labeled
              placeholder = "Reciptionist"
              icon = "ios-ionitron"
              size = "large"
              light-model
              clearable />
          </div>
          <div class="col l4 m6 s12 right">
            <button-group class = "coc-margin-top-25px right">
              <Button
                v-if = "pullable"
                type = "success"
                icon = "ios-time"
                size = "large"
                @click = "getHistory">Pull History</Button>
              <coc-button
                :disabled = "!($utils.roles.hasRole('jobs', user))"
                v-model = "btnModel"
                :scope = "['create-job']"
                :request = "{ xdata: input, url: '/job' }"
                :resolve-success-message = "res => `Job #${res.job_no} Created Successfully`"
                :type = "btnModel && btnModel.meta && btnModel.meta.retriever && btnModel.meta.retriever.errors && btnModel.meta.retriever.errors.response.status === 400 && btnModel.meta.retriever.errors.response.data.includes('#') ? 'error': 'primary'"
                placeholder = "Create"
                icon = "ios-add-circle right coc-margin-x-5px"
                size = "large"
                reset
                clearable
                @coc-submit-accepted = "handleResult"/>
            </button-group>
          </div>
          <div 
            v-if = "btnModel && btnModel.meta && btnModel.meta.retriever && btnModel.meta.retriever.errors && btnModel.meta.retriever.errors.response.status === 400 && btnModel.meta.retriever.errors.response.data.includes('#')"
            class = "right coc-house-keeper" >
            <i-button 
              :to = "`/dashboard/jobs/${btnModel.meta.retriever.errors.response.data.match(/[1-9]/g).join('')}`"
              type = "text"
              class = "coc-error-text  ">
              {{ btnModel.meta.retriever.errors.response.data }}
            </i-button>
          </div>
        </div>
      </Card>
      <jobs-history />
      <Card v-if = "!user">
        <p class = "coc-text-title coc-error-text center">
          <Icon type = "ios-alert-outline"/>
          You Are Not Logged In
        </p>
        <br>
        <p class="center">
          <button-group>
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
      </Card>
    </div>
  </master>
</template>

<script>
import Master from '~/components/common/master'
import JobsHistory from '~/components/jobs/history.vue'
import brands from '~/plugins/brands'
export default {
  name: 'HomeIndex',
  components: {
    Master,
    JobsHistory
  },
  head() {
    return {
      title: this.$store.state.core.app
        ? `${this.$store.state.core.app.title} | Home`
        : 'Home'
    }
  },
  data() {
    return {
      pullable: false,
      btnModel: null,
      isMounted: false,
      brands,
      input: {
        reciptionist: '',
        car: {
          brand: '',
          model: '',
          release: '',
          chase: '--',
          kilometers: ''
        },
        client: {
          name: '',
          phone: ''
        }
      }
    }
  },
  computed: {
    user() {
      return this.$store.state.core.auth
    }
  },
  beforeDestroy() {
    this.$root.$off(['createJob', 'LoggedIn'])
  },
  mounted() {
    setTimeout(() => {
      this.isMounted = true
    }, 1000)
    setTimeout(() => {
      if (this.user) {
        this.input.reciptionist = this.user.name
      }
    }, 500)
    this.$root.$on('LoggedIn', p => {
      setTimeout(() => {
        if (this.user) {
          this.input.reciptionist = p.name
        }
      }, 500)
    })
    this.$root.$on('createJob', p => {
      setTimeout(() => {
        this.input = this.$_.cloneDeep(p)
        this.input.reciptionist = this.user.name
        setTimeout(() => {
          if (this.btnModel) {
            this.btnModel.control.click()
            setTimeout(() => {
              const eTarget = document.getElementById('jobs-create')
              if (eTarget) {
                eTarget.scrollIntoView()
              }
            }, 500)
          }
        }, 1500)
      }, 500)
    })
  },
  methods: {
    askForLogin() {
      this.$root.$emit('askForLogin')
    },
    handleResult(e) {
      this.$store.dispatch('setRunningJobs', [
        ...this.$store.state.jobs.running,
        e.meta.response
      ])
      setTimeout(() => {
        this.input.reciptionist = this.user.name
      }, 900)
    },
    generateYears() {
      let i
      let result = []
      const year = parseInt(this.$moment().format('YYYY'), 10) + 1
      for (i = 0; i < 100; i += 1) {
        result.push((year - i).toString())
      }
      return result
    },
    getHistory() {
      this.$root.$emit('getHistory', this.input)
    },
    handleAutocompleteSelect(e, ref = 'phone') {
      this.pullable = false
      if (!e || !e.length) return
      const response = this.$refs[
        `${this._uid}-${ref}`
      ].autocompleteRetriever.response.jobs.filter(c => c.client[ref] === e)
      if (response.length) {
        this.input.client = response[response.length - 1].client
        this.input.car = response[response.length - 1].car
        this.pullable = true
      }
    }
  }
}
</script>

<style lang="css" scoped>
</style>
