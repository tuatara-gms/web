<template>
  <Card 
    v-if = "user"
    id = "jobs-history"
    class = "coc-margin-y-5px">
    <p 
      slot = "title">
      <icon type = " tcsc-checklist-icon coc-text-md-2 coc-content-text"/>
      <span class="coc-content-text">Client History</span>
    </p>
    <div class="row">
      <div class="col l4 m6 s12">
        <coc-input
          ref = "phone"
          :disabled = "!($utils.roles.hasRole('jobs', $store.state.core.auth))"
          v-model = "input.client.phone"
          :scope = "['search-for-jobs']"
          :rules = "{ PreConditions: { args: [ (val)=> (input.client.phone.length || input.client.name.length) ? true : 'You must enter client phone or the name.' ], message: '|*args*|'} }"
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
          ref = "name"
          :disabled = "!($utils.roles.hasRole('jobs', $store.state.core.auth))"
          v-model = "input.client.name"
          :rules = "{ PreConditions: { args: [ (val)=> (input.client.phone.length || input.client.name.length) ? true : 'You must enter client phone or the name.' ], message: '|*args*|'} }"
          :scope = "['search-for-jobs']"
          :autocomplete-remote = "model => ({ method: 'get', url: '/job', params: { name: model.val, limit: 5 }})"
          :autocomplete-map-response = "res => $_.uniqBy(res.jobs, j => j.client.name).map(o => o.client.name)"
          labeled
          placeholder = "Client Name"
          icon = "ios-person"
          size = "large"
          light-model
          clearable
          allow-autocomplete
          @coc-enter = "handleAutocompleteSelect($event, 'name')"
          @coc-select = "handleAutocompleteSelect($event, 'name')" />
      </div>
      <div class="col l4 m6 s12">
        <coc-input
          v-if = "brands && brands.length && isMounted"
          :disabled = "!($utils.roles.hasRole('jobs', $store.state.core.auth))"
          v-model = "input.car.brand"
          :scope = "['search-for-jobs']"
          :data = "brands"
          :icon = "input.car.brand && input.car.brand.length ? null : 'ios-color-filter'"
          :style = "input.car.brand && input.car.brand.length ? 'width: calc( 100% - 40px )' : 'width: 100%'"
          labeled
          placeholder = "Car Brand"
          size = "large"
          class = "col"
          light-model
          clearable
          allow-autocomplete />
        <coc-avatar
          v-if = "input.car.brand && input.car.brand.length"
          slot = "suffix"
          :disabled = "!($utils.roles.hasRole('jobs', $store.state.core.auth))"
          :source = "`/snaps/brands/png/${input.car.brand.split(' ').join('-').toLowerCase()}.png`"
          scale = "30px"
          class = "col coc-margin-left-4px coc-margin-top-25px"/>
      </div>
      <div class="col l4 m6 s12">
        <coc-input
          :disabled = "!($utils.roles.hasRole('jobs', user))"
          v-model = "input.car.model"
          :scope = "['search-for-jobs']"
          :rules = "{ HasValue: true }"
          :autocomplete-remote = "model => ({ method: 'get', url: '/job', params: { brand: input && input.car && input.car.brand ? input.car.brand : '' ,model: model.val, limit: 5 }})"
          :autocomplete-map-response = "res => $_.uniqBy(res.jobs, j => j.car.model).map(o => o.car.model)"
          labeled
          placeholder = "Car Model"
          icon = "ios-car"
          size = "large"
          light-model
          clearable
          allow-autocomplete />
      </div>
      <div class="col l4 m6 s12">
        <coc-select
          :disabled = "!($utils.roles.hasRole('jobs', $store.state.core.auth))"
          v-model = "input.car.release"
          :scope = "['search-for-jobs']"
          :data = "generateYears()"
          labeled
          placeholder = "Release Year"
          icon = "ios-calendar"
          size = "large"
          filterable
          clearable
          light-model />
      </div>
      <div class="col l4 m6 s12 right">
        <button-group class = "right">
          <Button
            v-if = "pullable"
            :scope = "['search-for-jobs']"
            icon = "ios-add-circle"
            type = "primary"
            class = " coc-margin-top-25px"
            size = "large"
            reset
            local
            @click = "createJob">Create Job</Button>
          <Button
            :scope = "['search-for-jobs']"
            icon = "ios-time right coc-margin-x-5px"
            type = "success"
            class = " coc-margin-top-25px"
            size = "large"
            reset
            local
            @click = "getJobs">Pull</Button>
        </button-group>
      </div>
      <div
        v-if = "jobs.length"
        class="col s12">
        <div class="col l8 animated slideInLeft">
          <p class="coc-text-bold coc-text-subtitle">Jobs ({{ jobs.length }})</p>
          <cell-group class = "coc-background-bg job-status-section coc-border-border coc-border-1 coc-standard-border-radius coc-full-width">
            <cell 
              v-for = "(job, j) in jobs" 
              :key = "j" 
              :to = "`/jobs/${job.job_no}`"
              class = "animated slideInUp" >
              <div class = "row coc-house-keeper">
                <coc-avatar
                  :disabled = "!($utils.roles.hasRole('jobs', $store.state.core.auth))"
                  :source = "`/snaps/brands/png/${job.car.brand.split(' ').join('-').toLowerCase()}.png`"
                  scale = "40px"
                  class = "col"/>
                <span class="col coc-margin-top-5px">#{{ job.job_no }} {{ job.car.brand | CocCapitalizeName }}</span>
              </div>
              <div slot = "label">
                <br>
                <span>
                  {{ job.car.model }}
                  <small class="coc-text-bold coc-text-md-1">({{ job.requirements.filter(j => j.done).length }}/{{ job.requirements.length }})</small>
                  <Tag
                    :color = "getStatusColor(job.status.toLowerCase())"
                    class="coc-text-bold coc-text-md-1">{{ job.status | CocCapitalizeName }}</Tag>
              
                </span>
                <br>
                <small>{{ job.client.name }} , Phone: {{ job.client.phone }} </small>
              </div>
              <div slot = "extra">
                <tooltip :content = "$moment(job.timein).format('D/M/YYYY')">
                  <small class="right">{{ $moment(job.timein).fromNow() }}</small>
                </tooltip>
              </div>
            </cell>
          </cell-group>
        </div>
        <div class="col l4 animated slideInRight">
          <p class="coc-text-bold coc-text-subtitle">Requirements ({{ jobs[ jobs.length - 1 ].requirements.filter(r => r.done).length }}/{{ jobs[ jobs.length - 1 ].requirements.length }})</p>
          <cell-group class = "coc-background-bg job-status-section coc-border-border coc-padding-y-5px coc-border-1 coc-standard-border-radius coc-full-width">
            <cell
              v-for = "(req, r) in jobs[ jobs.length - 1 ].requirements"
              :to = "`/jobs/${ jobs[ jobs.length - 1 ].job_no}?scroll=requirements`"
              :key = "r">
              <div class = "row coc-house-keeper">
                <coc-avatar
                  :disabled = "!($utils.roles.hasRole('jobs', $store.state.core.auth))"
                  :icon = "req.done ? 'tcsc-car-check-icon' : 'tcsc-traffic-light-icon'"
                  scale = "30px"
                  class = "col"/>
                <span class="col coc-margin-top-5px">{{ req.name | CocCapitalizeName }}</span>
              </div>
              <div slot = "extra">
                <tooltip
                  :content = "$moment(req.created_at).format('D/M/YYYY')"
                  placement = "left">
                  <small class="right">{{ $moment(req.created_at).fromNow() }}</small>
                </tooltip>
                <icon 
                  v-if = "req.done"
                  type = "md-checkmark"
                  class = "coc-success-text right coc-text-md-2 coc-margin-top-5px coc-margin-x-5px" />
                <icon 
                  v-if = "!req.done"
                  type = "md-close"
                  class = "coc-error-text right coc-text-md-2 coc-margin-top-5px coc-margin-x-5px" />
              </div>
            </cell>
            <cell
              v-if = "!jobs[ jobs.length - 1 ].requirements.length">
              <div class = "row coc-house-keeper">
                <coc-avatar
                  :disabled = "!($utils.roles.hasRole('jobs', $store.state.core.auth))"
                  icon = "tcsc-fix-icon"
                  scale = "30px"
                  class = "col"/>
                <span class="col coc-margin-top-5px">No Requirements To Show</span>
              </div>
            </cell>
          </cell-group>
        </div>
      </div>
    </div>
  </Card>
</template>

<script>
import brands from '~/plugins/brands'
export default {
  name: 'History',

  data() {
    return {
      pullable: false,
      isMounted: false,
      jobs: [],
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
    this.$root.$off(['getHistory'])
  },
  mounted() {
    setTimeout(() => {
      this.isMounted = true
    }, 1000)
    this.$root.$on('getHistory', p => {
      setTimeout(() => {
        this.input = this.$_.cloneDeep(p)
        this.getJobs()
        this.pullable = true
        setTimeout(() => {
          const eTarget = document.getElementById('jobs-history')
          if (eTarget) {
            eTarget.scrollIntoView()
          }
        }, 500)
      }, 500)
    })
  },
  methods: {
    getJobs() {
      if (!this.input.client.phone.length && !this.input.client.name.length) {
        this.$Message.error('Client Data is empty!')
        this.jobs = []
        return
      }
      this.$axios({
        method: 'get',
        url: '/job/',
        params: {
          name: this.input.client.name,
          phone: this.input.client.phone,
          brand: this.input.car.brand,
          model: this.input.car.model,
          stats: 'yes'
        }
      }).then(res => {
        this.jobs = res.data.jobs
      })
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
    createJob() {
      this.$root.$emit('createJob', this.input)
    },
    getStatusColor(status) {
      if (status.toLowerCase() === 'finished') return 'success'
      if (status.toLowerCase() === 'postponed') return 'warning'
      return 'primary'
    },
    handleAutocompleteSelect(e, ref = 'phone') {
      this.pullable = false
      if (!e || !e.length) return
      const response = this.$refs[
        ref
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
.job-status-section {
  max-height: 50vh;
  overflow-y: scroll
}
</style>
