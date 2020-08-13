<template>
  <master ref = "master">
    <div class="row">
      <span class = "coc-text-bold coc-text-md-2">
        Jobs
        <span v-if = "jobs && jobs.length">({{ jobs.length }})</span>
      </span>
      <coc-button
        icon = "ios-funnel-outline"
        class = "right"
        @clicked = "config.drawer = true"/>
      <coc-button
        :loading = "isLoading"
        icon = "ios-refresh"
        class = "right coc-margin-x-5px"
        @clicked = "formatQuery"/>
      <coc-button
        :disabled = "list"
        icon = "ios-list"
        class = "right coc-margin-x-5px"
        @clicked = "list = true"/>
      <coc-button
        :disabled = "!list"
        icon = "ios-grid-outline"
        class = "right coc-margin-x-5px"
        @clicked = "list = false"/>
    </div>
    <Drawer 
      v-model="config.drawer" 
      width = "80%"
      closable>
      <p
        slot = "header">
        <span class="coc-content-text">Filters</span>
      </p>
      <div 
        v-if = "config.drawer" 
        class="row coc-house-keeper">
        <div class="row coc-section">
          <div class = "col s12  m12 coc-margin-0 coc-padding-x-5px">
            <div class="row coc-house-keeper">
              <div class = "col s12 l6">
                <p class = "coc-content-text coc-text-normal-2">Search By Number</p>
                <coc-input
                  slot = "title"
                  v-model = "input.job_no"
                  icon = "ios-grid-outline"
                  placeholder = "Search By Job Number.."
                  light-model/>
              </div>
              <div class = "col s12 l6">
                <p class = "coc-content-text coc-text-normal-2">Status</p>
                <coc-select
                  v-model = "input.status"
                  placeholder = "Status.."
                  light-model
                  clearable>
                  <template slot-scope = "{options}">
                    <Option
                      value = "running"
                      label = "Running"/>
                    <Option
                      value = "finished"
                      label = "Finished"/>
                    <Option
                      value = "postponed"
                      label = "Postponed"/>
                  </template>
                </coc-select>
              </div>
            </div>
            <div class="row coc-house-keeper">
              <div class = "col s12 l6">
                <p class = "coc-content-text coc-text-normal-2">Sort</p>
                <coc-select
                  v-model = "input.sort"
                  placeholder = "Sort By.."
                  light-model>
                  <template slot-scope = "{options}">
                    <Option
                      value = "job_no"
                      label = "Job Number"/>
                    <Option
                      value = "created_at"
                      label = "Date"/>
                    <Option
                      value = "status"
                      label = "Status"/>
                  </template>
                </coc-select>
              </div>
              <div class="col s12 l6">
                <p class = "coc-content-text coc-text-normal-2">Time Range</p>
                <DatePicker 
                  v-model = "input.date"
                  :start-date="$moment().toDate()" 
                  type="daterange" 
                  placement="bottom-end" 
                  placeholder="Select date" 
                  style="width: 100%"/>
              </div>
            </div>
            <div class="row coc-house-keeper">
              <div class = "col s12 l6">
                <p class = "coc-content-text coc-text-normal-2">Phone</p>
                <coc-input
                  v-model = "input.phone"
                  :autocomplete-remote = "model => ({ method: 'get', url: '/job', params: { phone: model.val, limit: 5 } } )"
                  :autocomplete-map-response = "(res) => $_.uniqBy(res.jobs, j => j.client.phone).map(j => j.client.phone)"
                  icon = "ios-search"
                  placeholder = "Search by Phone.."
                  class = "coc-house-keeper"
                  allow-autocomplete
                  clearable
                  light-model />
              </div>
              <div class = "col s12 l6">
                <p class = "coc-content-text coc-text-normal-2">Client Name</p>
                <coc-input
                  v-model = "input.name"
                  :autocomplete-remote = "model => ({ method: 'get', url: '/job', params: { name: model.val, limit: 5 } } )"
                  :autocomplete-map-response = "(res) => $_.uniqBy(res.jobs, j => j.client.name).map(j => j.client.name)"
                  icon = "ios-search"
                  placeholder = "Search by client name.."
                  class = "coc-house-keeper"
                  allow-autocomplete
                  clearable
                  light-model />
              </div>
            </div>
            <div class="row coc-house-keeper">
              <div class = "col s12 l6">
                <p class = "coc-content-text coc-text-normal-2">Car Brand</p>
                <coc-select
                  v-model = "input.brandmlt"
                  :autocomplete-remote = "model => ({ method: 'get', url: '/job', params: { brand: model.meta.query, limit: 5, select: 'car' } } )"
                  :autocomplete-map-response = "res => $_.uniq(res.jobs.map(r => r.car.brand))"
                  :data = "brands"
                  icon = "ios-search"
                  placeholder = "Search by Car Brand.."
                  class = "coc-house-keeper"
                  allow-autocomplete
                  clearable
                  filterable
                  allow-create
                  multiple
                  light-model />
              </div>
              <div class = "col s12 l6">
                <p class = "coc-content-text coc-text-normal-2">Car Model</p>
                <coc-input
                  v-model = "input.model"
                  :autocomplete-remote = "model => ({ method: 'get', url: '/job', params: { model: model.val, limit: 5 } } )"
                  :autocomplete-map-response = "(res) => $_.uniqBy(res.jobs, j => j.car.model).map(j => j.car.model)"
                  icon = "ios-search"
                  placeholder = "Search by car model.."
                  class = "coc-house-keeper"
                  allow-autocomplete
                  clearable
                  light-model />
              </div>
              <div class = "col s12 l6">
                <p class = "coc-content-text coc-text-normal-2">Job Requirements</p>
                <coc-select
                  v-model = "input.requirementsmlt"
                  :autocomplete-remote = "model => ({ method: 'get', url: '/job', params: { requirements: model.meta.query, limit: 5 } } )"
                  :autocomplete-map-response = "(res) => $_.uniqBy( $coc.CielChilds(res.jobs, r => r.requirements) , j => j.name).map(j => j.name)"
                  icon = "ios-search"
                  placeholder = "Search by Phone.."
                  class = "coc-house-keeper"
                  allow-autocomplete
                  filterable
                  multiple
                  clearable
                  light-model />
              </div>
              <div class="row">
                <div class = "col s12 l6">
                  <p class = "coc-content-text coc-text-normal-2">Price Range</p>
                  <Slider 
                    v-model="input.price"
                    :step = "config.price.step"
                    :max = "config.price.max" 
                    range 
                    show-stops/>
                </div>
                <div class = "col s12 l6 right">
                  <p class = "coc-content-text coc-text-normal-2">Arrangement</p>
                  <button-group
                    shape = "circle"
                    class = "coc-full-width"
                    long>
                    <coc-button
                      :type = "input.desc === 'no' ? 'info' : 'default'"
                      icon = "md-arrow-round-up"
                      style = "width:50%"
                      @clicked = "input.desc = 'no'"/>
                    <coc-button
                      :type = "input.desc === 'yes' ? 'info' : 'default'"
                      icon = "md-arrow-round-down"
                      style = "width:50%"
                      @clicked = "input.desc = 'yes'"/>
                  </button-group>
                </div>
              </div>
              <div class = "col s12">
                <coc-button 
                  type = "primary" 
                  icon = "ios-funnel-outline coc-text-lg"
                  long 
                  @clicked = "formatQuery()">
                  <span class="coc-text-lg">Filter Jobs</span>
                </coc-button>
              </div>
            </div>
          </div>
          <Divider orientation = "right">Search Settings</Divider>
          <p class = "coc-text-md-2">Price Range Maximum</p>
          <coc-number-input 
            v-model = "config.price.max" 
            placeholder = "Price Range Maximum" 
            size = "large"
            style = "width: 100%"
            light-model />
          <p class = "coc-text-md-2">Price Range Step</p>
          <coc-number-input 
            v-model = "config.price.step" 
            placeholder = "Price Range Step" 
            size = "large"
            style = "width: 100%"
            light-model />
    </div></div></Drawer>
    <div
      v-coc-loading = "isLoading"
      v-if = "list" 
      class="row animated fadeIn">
      <div class="col s12">
        <h3 class = "coc-info-text">All</h3>
        <div class = "div col s2 coc-info-border coc-border-3 coc-margin-bottom-1px" />
        <div class = "div col s2 coc-success-border coc-border-3 coc-margin-bottom-1px" />
        <div class = "div col s2 coc-warning-border coc-border-3 coc-margin-bottom-1px" />
        <CellGroup class = "coc-background-bg job-status-section coc-full-width">
          <Cell 
            v-for = "(job, j) in jobs" 
            :key = "j"
            :class = "[
              {'slideInUp coc-background-bg': flashers !== job._id && preflash !== job._id },
              {'pulse coc-info-tint-8-bg': flashers === job._id },
              { 'coc-info-border': job.status === 'running' },
              { 'coc-success-border': job.status === 'finished' },
              { 'coc-warning-border': job.status === 'postponed' },
            ]"
            class = "animated coc-primary-background-hover-shade-1-bg coc-primary-background-bg coc-border-left-3 coc-border-0 coc-margin-y-1px" >
            <div class = "row coc-house-keeper">
              <coc-avatar
                :source = "`/snaps/brands/png/${job.car.brand.split(' ').join('-').toLowerCase()}.png`"
                fallback-icon = "tcsc-car-icon"
                scale = "40px"
                class = "col"/>
              <nuxt-link
                :to = "`/jobs/${job.job_no}`"
                :class = "[
                  { 'coc-info-text': job.status === 'running' },
                  { 'coc-success-text': job.status === 'finished' },
                  { 'coc-warning-text': job.status === 'postponed' },
                ]"
                class="col coc-margin-top-5px coc-text-bold"
              >#{{ job.job_no }} {{ job.car.brand | CocCapitalizeName }} ({{ job.status | CocCapitalizeFirst }})</nuxt-link>
            </div>
            <div slot = "label">
              <br>
              <span>{{ job.car.model }}</span><br>
              <span>{{ job.client.name }} , Phone: {{ job.client.phone }} </span><br>
              <nuxt-link 
                :to = "`/jobs/${job.job_no}`" 
                class="coc-padding-top-3px coc-info-shade-3-text coc-clickable">
                Navigate
              </nuxt-link>
              <span
                class="coc-padding-top-3px coc-error-text coc-clickable"
                @click = "deleteJob(job)">Delete</span>
              <Tooltip
                v-if = "job.status !== 'running'"
                placement = "top"
                content = "Run Job">
                <span
                  class="coc-padding-top-3px coc-margin-left-10px coc-text-bold coc-info-text coc-clickable"
                  @click = "updateStatus(job, 'running')">Run</span>
              </Tooltip>
              <Tooltip
                v-if = "job.status !== 'finished'"
                placement = "top"
                content = "Finish Job">
                <span
                  class="coc-padding-top-3px coc-margin-left-10px coc-text-bold coc-success-text coc-clickable"
                  @click = "updateStatus(job, 'finished')">Finish</span>
              </Tooltip>
              <Tooltip
                v-if = "job.status !== 'postponed'"
                placement = "top"
                content = "Postpone Job">
                <span
                  class="coc-padding-top-3px coc-text-bold coc-margin-left-5px coc-warning-text coc-clickable"
                  @click = "updateStatus(job, 'postponed')">Postpone</span>
              </Tooltip>
            </div>
            <div slot = "extra">
              <dropdown
                placement = "left"
                class = "right">
                <Button
                  type="text"
                  size = "small"
                  class = "right"
                  icon = " right coc-margin-left-5px knocksapp-menu">
                  ({{ job.requirements.filter(j => j.done).length }}/{{ job.requirements.length }})
                </Button>
                <dropdown-menu slot="list">
                  <dropdown-item
                    v-for = "(req, r) in job.requirements"
                    :key = "r"
                    style = "min-width: 150px">
                    <nuxt-link
                      :to = "`/jobs/${job.job_no}?scroll=requirements`"
                      class = "coc-content-text">
                      {{ req.name }}
                      <icon 
                        v-if = "req.done"
                        type = "md-checkmark"
                        class = "coc-success-text right coc-text-md-2 coc-margin-top-5px coc-margin-x-5px" />
                      <icon 
                        v-if = "!req.done && !req.shifted"
                        type = "md-close"
                        class = "coc-error-text right coc-text-md-2 coc-margin-top-5px coc-margin-x-5px" />
                      <icon
                        v-if = "!req.done && req.shifted"
                        type = " knocks-arrow-right2"
                        class = "coc-warning-text right coc-text-md-2 coc-margin-top-5px coc-margin-x-5px" />
                    </nuxt-link>
                  </dropdown-item>
                  <dropdown-item
                    v-if = "!job.requirements.length"
                    style = "min-width: 150px">
                    <nuxt-link
                      :to = "`/jobs/${job.job_no}?scroll=requirements`"
                      class = "coc-content-text">
                      No Requirements To Show
                      <icon 
                        type = "ios-alert-outline"
                        class = "right coc-text-md-2 coc-margin-top-1px coc-margin-x-5px" />
                    </nuxt-link>
                  </dropdown-item>
                </dropdown-menu>
              </dropdown><br>
              <nuxt-link
                :to = "`/jobs/${job.job_no}`"
                class="right coc-content-text">
                <tooltip 
                  :content = "$moment(job.timein).format('D/M/YYYY')" 
                  placement = "left">
                  {{ $moment(job.timein).fromNow() }}
                </tooltip>
              </nuxt-link><br>
            </div>
          </Cell>
        </CellGroup>
        <div 
          v-if = "!jobs || !jobs.filter(j => j.status === 'running').length" 
          class = "coc-background-bg coc-content-text coc-padding-y-10px">
          <p class="center">
            <br>
            <Icon type = "ios-alert-outline" /><br>
            <span>No Jobs To Show</span>
            <br>
          </p>
        </div>
      </div>
    </div>
    <div
      v-coc-loading = "isLoading"
      v-if = "!list" 
      class="row">
      <div class="col s12 l4">
        <h3 class = "coc-info-text">Running</h3>
        <div class = "div col s6 coc-info-border coc-border-3 coc-margin-bottom-1px" />
        <CellGroup class = "coc-background-bg job-status-section coc-full-width">
          <Cell 
            v-for = "(job, j) in jobs.filter(j => j.status === 'running')" 
            :key = "j"
            :class = "[
              {'slideInUp coc-background-bg': flashers !== job._id && preflash !== job._id },
              {'pulse coc-info-tint-8-bg': flashers === job._id }
            ]"
            class = "animated coc-border-left-3 coc-border-0 coc-primary-background-hover-shade-1-bg coc-primary-background-bg coc-info-border coc-margin-y-1px" >
            <div class = "row  coc-house-keeper">
              <coc-avatar
                :source = "`/snaps/brands/png/${job.car.brand.split(' ').join('-').toLowerCase()}.png`"
                fallback-icon = "tcsc-car-icon"
                scale = "40px"
                class = "col"/>
              <nuxt-link
                :to = "`/jobs/${job.job_no}`"
                class="col coc-margin-top-5px coc-text-bold coc-content-text">#{{ job.job_no }} {{ job.car.brand | CocCapitalizeName }}</nuxt-link>
            </div>
            <div slot = "label">
              <br>
              <span>{{ job.car.model }}</span><br>
              <span>{{ job.client.name }} , Phone: {{ job.client.phone }} </span><br>
              <nuxt-link 
                :to = "`/jobs/${job.job_no}`" 
                class="coc-padding-top-3px coc-info-shade-3-text coc-clickable">
                Navigate
              </nuxt-link>
              <span
                class="coc-padding-top-3px coc-error-text coc-clickable"
                @click = "deleteJob(job)">Delete</span>
              <Tooltip
                placement = "top"
                content = "Finish Job">
                <span
                  class="coc-padding-top-3px coc-margin-left-10px coc-text-bold coc-success-text coc-clickable"
                  @click = "updateStatus(job, 'finished')">Finish</span>
              </Tooltip>
              <Tooltip
                placement = "top"
                content = "Postpone Job">
                <span
                  class="coc-padding-top-3px coc-text-bold coc-margin-left-5px coc-warning-text coc-clickable"
                  @click = "updateStatus(job, 'postponed')">Postpone</span>
              </Tooltip>
            </div>
            <div slot = "extra">
              <dropdown
                placement = "left"
                class = "right">
                <Button
                  type="text"
                  size = "small"
                  class = "right"
                  icon = " right coc-margin-left-5px knocksapp-menu">
                  ({{ job.requirements.filter(j => j.done).length }}/{{ job.requirements.length }})
                </Button>
                <dropdown-menu slot="list">
                  <dropdown-item
                    v-for = "(req, r) in job.requirements"
                    :key = "r"
                    style = "min-width: 150px">
                    <nuxt-link
                      :to = "`/jobs/${job.job_no}?scroll=requirements`"
                      class = "coc-content-text">
                      {{ req.name }}
                      <icon 
                        v-if = "req.done"
                        type = "md-checkmark"
                        class = "coc-success-text right coc-text-md-2 coc-margin-top-5px coc-margin-x-5px" />
                      <icon 
                        v-if = "!req.done && !req.shifted"
                        type = "md-close"
                        class = "coc-error-text right coc-text-md-2 coc-margin-top-5px coc-margin-x-5px" />
                      <icon
                        v-if = "!req.done && req.shifted"
                        type = " knocks-arrow-right2"
                        class = "coc-warning-text right coc-text-md-2 coc-margin-top-5px coc-margin-x-5px" />
                    </nuxt-link>
                  </dropdown-item>
                  <dropdown-item
                    v-if = "!job.requirements.length"
                    style = "min-width: 150px">
                    <nuxt-link
                      :to = "`/jobs/${job.job_no}?scroll=requirements`"
                      class = "coc-content-text">
                      No Requirements To Show
                      <icon 
                        type = "ios-alert-outline"
                        class = "right coc-text-md-2 coc-margin-top-1px coc-margin-x-5px" />
                    </nuxt-link>
                  </dropdown-item>
                </dropdown-menu>
              </dropdown><br>
              <nuxt-link
                :to = "`/jobs/${job.job_no}`"
                class="right coc-content-text">
                <tooltip 
                  :content = "$moment(job.timein).format('D/M/YYYY')" 
                  placement = "left">
                  {{ $moment(job.timein).fromNow() }}
                </tooltip>
              </nuxt-link><br>
            </div>
          </Cell>
        </CellGroup>
        <div 
          v-if = "!jobs || !jobs.filter(j => j.status === 'running').length" 
          class = "coc-background-bg coc-content-text coc-padding-y-10px">
          <p class="center">
            <br>
            <Icon type = "ios-alert-outline" /><br>
            <span>No Jobs To Show</span>
            <br>
          </p>
        </div>
      </div>
      <div class="col s12 l4 ">
        <h3 class = "coc-success-text">Finished</h3>
        <div class = "div col s6 coc-success-border coc-border-3 coc-margin-bottom-1px" />
        <CellGroup class = "coc-background-bg job-status-section coc-full-width">
          <Cell 
            v-for = "(job, j) in jobs.filter(j => j.status === 'finished')" 
            :key = "j"
            :class = "[
              {'slideInUp coc-background-bg': flashers !== job._id && preflash !== job._id },
              {'pulse coc-info-tint-8-bg': flashers === job._id}
            ]"
            class = "animated coc-border-left-3 coc-border-0 coc-primary-background-hover-shade-1-bg coc-primary-background-bg coc-success-border coc-margin-y-1px" >
            <div class = "row coc-house-keeper">
              <coc-avatar
                :source = "`/snaps/brands/png/${job.car.brand.split(' ').join('-').toLowerCase()}.png`"
                fallback-icon = "tcsc-car-icon"
                scale = "40px"
                class = "col"/>
              <nuxt-link
                :to = "`/jobs/${job.job_no}`"
                class="col coc-margin-top-5px coc-text-bold coc-content-text">#{{ job.job_no }} {{ job.car.brand | CocCapitalizeName }}</nuxt-link>
            </div>
            <div slot = "label">
              <br>
              <span>{{ job.car.model }}</span><br>
              <span>{{ job.client.name }} , Phone: {{ job.client.phone }} </span><br>
              <nuxt-link 
                :to = "`/jobs/${job.job_no}`" 
                class="coc-padding-top-3px coc-info-shade-3-text coc-clickable">
                Navigate
              </nuxt-link>
              <span
                class="coc-padding-top-3px coc-error-text coc-clickable"
                @click = "deleteJob(job)">Delete</span>
              <Tooltip
                placement = "top"
                content = "Run Job">
                <span
                  class="coc-padding-top-3px coc-margin-left-10px coc-text-bold coc-info-text coc-clickable"
                  @click = "updateStatus(job, 'running')">Run</span>
              </Tooltip>
              <Tooltip
                placement = "top"
                content = "Postpone Job">
                <span
                  class="coc-padding-top-3px coc-text-bold coc-margin-left-5px coc-warning-text coc-clickable"
                  @click = "updateStatus(job, 'postponed')">Postpone</span>
              </Tooltip>
            </div>
            <div slot = "extra">
              <dropdown
                placement = "left"
                class = "right">
                <Button
                  type="text"
                  size = "small"
                  class = "right"
                  icon = " right coc-margin-left-5px knocksapp-menu">
                  ({{ job.requirements.filter(j => j.done).length }}/{{ job.requirements.length }})
                </Button>
                <dropdown-menu slot="list">
                  <dropdown-item
                    v-for = "(req, r) in job.requirements"
                    :key = "r"
                    style = "min-width: 150px">
                    <nuxt-link
                      :to = "`/jobs/${job.job_no}?scroll=requirements`"
                      class = "coc-content-text">
                      {{ req.name }}
                      <icon 
                        v-if = "req.done"
                        type = "md-checkmark"
                        class = "coc-success-text right coc-text-md-2 coc-margin-top-5px coc-margin-x-5px" />
                      <icon 
                        v-if = "!req.done && !req.shifted"
                        type = "md-close"
                        class = "coc-error-text right coc-text-md-2 coc-margin-top-5px coc-margin-x-5px" />
                      <icon
                        v-if = "!req.done && req.shifted"
                        type = " knocks-arrow-right2"
                        class = "coc-warning-text right coc-text-md-2 coc-margin-top-5px coc-margin-x-5px" />
                    </nuxt-link>
                  </dropdown-item>
                  <dropdown-item
                    v-if = "!job.requirements.length"
                    style = "min-width: 150px">
                    <nuxt-link
                      :to = "`/jobs/${job.job_no}?scroll=requirements`"
                      class = "coc-content-text">
                      No Requirements To Show
                      <icon 
                        type = "ios-alert-outline"
                        class = "right coc-text-md-2 coc-margin-top-1px coc-margin-x-5px" />
                    </nuxt-link>
                  </dropdown-item>
                </dropdown-menu>
              </dropdown><br>
              <nuxt-link
                :to = "`/jobs/${job.job_no}`"
                class="right coc-content-text">
                <tooltip 
                  :content = "$moment(job.timein).format('D/M/YYYY')" 
                  placement = "left">
                  {{ $moment(job.timein).fromNow() }}
                </tooltip>
              </nuxt-link><br>
            </div>
          </Cell>
        </CellGroup>
        <div 
          v-if = "!jobs || !jobs.filter( j => j.status === 'finished').length" 
          class = "coc-background-bg coc-content-text coc-padding-y-10px">
          <p class="center">
            <br>
            <Icon type = "ios-alert-outline" /><br>
            <span>No Jobs To Show</span>
            <br>
          </p>
        </div>
      </div>
      <div class="col s12 l4">
        <h3 class = "coc-warning-text">Postponed</h3>
        <div class = "div col s6 coc-warning-text coc-border-3 coc-margin-bottom-1px" />
        <CellGroup class = "coc-background-bg job-status-section coc-full-width">
          <Cell 
            v-for = "(job, j) in jobs.filter(j => j.status === 'postponed')" 
            :key = "j"
            :class = "[
              {'slideInUp coc-background-bg': flashers !== job._id && preflash !== job._id },
              {'pulse coc-info-tint-8-bg': flashers === job._id}
            ]"
            class = "animated coc-border-left-3 coc-border-0 coc-primary-background-hover-shade-1-bg coc-primary-background-bg coc-warning-border coc-margin-y-1px" >
            <div class = "row coc-house-keeper">
              <coc-avatar
                :source = "`/snaps/brands/png/${job.car.brand.split(' ').join('-').toLowerCase()}.png`"
                fallback-icon = "tcsc-car-icon"
                scale = "40px"
                class = "col"/>
              <nuxt-link
                :to = "`/jobs/${job.job_no}`"
                class="col coc-margin-top-5px coc-text-bold coc-content-text">#{{ job.job_no }} {{ job.car.brand | CocCapitalizeName }}</nuxt-link>
            </div>
            <div slot = "label">
              <br>
              <span>{{ job.car.model }}</span><br>
              <span>{{ job.client.name }} , Phone: {{ job.client.phone }} </span><br>
              <nuxt-link 
                :to = "`/jobs/${job.job_no}`" 
                class="coc-padding-top-3px coc-info-shade-3-text coc-clickable">
                Navigate
              </nuxt-link>
              <span
                class="coc-padding-top-3px coc-error-text coc-clickable"
                @click = "deleteJob(job)">Delete</span>
              <Tooltip
                placement = "top"
                content = "Run Job">
                <span
                  class="coc-padding-top-3px coc-margin-left-10px coc-text-bold coc-info-text coc-clickable"
                  @click = "updateStatus(job, 'running')">Run</span>
              </Tooltip>
              <Tooltip
                placement = "top"
                content = "Finish Job">
                <span
                  class="coc-padding-top-3px coc-text-bold coc-margin-left-5px coc-success-text coc-clickable"
                  @click = "updateStatus(job, 'finished')">Finish</span>
              </Tooltip>
            </div>
            <div slot = "extra">
              <dropdown
                placement = "left"
                class = "right">
                <Button
                  type="text"
                  size = "small"
                  class = "right"
                  icon = " right coc-margin-left-5px knocksapp-menu">
                  ({{ job.requirements.filter(j => j.done).length }}/{{ job.requirements.length }})
                </Button>
                <dropdown-menu slot="list">
                  <dropdown-item
                    v-for = "(req, r) in job.requirements"
                    :key = "r"
                    style = "min-width: 150px">
                    <nuxt-link
                      :to = "`/jobs/${job.job_no}?scroll=requirements`"
                      class = "coc-content-text">
                      {{ req.name }}
                      <icon 
                        v-if = "req.done"
                        type = "md-checkmark"
                        class = "coc-success-text right coc-text-md-2 coc-margin-top-5px coc-margin-x-5px" />
                      <icon 
                        v-if = "!req.done && !req.shifted"
                        type = "md-close"
                        class = "coc-error-text right coc-text-md-2 coc-margin-top-5px coc-margin-x-5px" />
                      <icon
                        v-if = "!req.done && req.shifted"
                        type = " knocks-arrow-right2"
                        class = "coc-warning-text right coc-text-md-2 coc-margin-top-5px coc-margin-x-5px" />
                    </nuxt-link>
                  </dropdown-item>
                  <dropdown-item
                    v-if = "!job.requirements.length"
                    style = "min-width: 150px">
                    <nuxt-link
                      :to = "`/jobs/${job.job_no}?scroll=requirements`"
                      class = "coc-content-text">
                      No Requirements To Show
                      <icon 
                        type = "ios-alert-outline"
                        class = "right coc-text-md-2 coc-margin-top-1px coc-margin-x-5px" />
                    </nuxt-link>
                  </dropdown-item>
                </dropdown-menu>
              </dropdown><br>
              <nuxt-link
                :to = "`/jobs/${job.job_no}`"
                class="right coc-content-text">
                <tooltip 
                  :content = "$moment(job.timein).format('D/M/YYYY')" 
                  placement = "left">
                  {{ $moment(job.timein).fromNow() }}
                </tooltip>
              </nuxt-link><br>
            </div>
          </Cell>
        </CellGroup>
        <div 
          v-if = "!jobs || !jobs.filter(j => j.status === 'postponed').length" 
          class = "coc-background-bg coc-content-text coc-padding-y-10px">
          <p class="center">
            <br>
            <Icon type = "ios-alert-outline" /><br>
            <span>No Jobs To Show</span>
            <br>
          </p>
        </div>
      </div>
    </div>
    <div 
      v-if = "pagination && jobs && jobs.length && input.page >= 0"
      style = " padding-top: 10px !important; margin-top: 5px; margin-bottom: 10px;" 
      class="col s12 ">
      <Page
        :total="pagination.pages"
        :page-size = "1"
        :current="pagination.page + 1"
        :styles = "{margin: 'auto', display: 'block', width: 'fit-content'}"
        @on-change = "changePage"/>
    </div>
  </master>
</template>

<script>
import Master from '~/components/common/master'
import brands from '~/plugins/brands'
export default {
  name: 'AllJobsIndex',
  components: {
    Master
  },
  head() {
    return {
      title: this.$store.state.core.app
        ? `${this.$store.state.core.app.title} | Jobs`
        : 'Jobs'
    }
  },
  data() {
    return {
      brands,
      list: false,
      loaders: {},
      flashers: null,
      preflash: null,
      isLoading: false,
      formattedQuery: {},
      pagination: null,
      jobs: [],
      config: {
        drawer: false,
        price: {
          step: 500,
          max: 40000
        }
      },
      input: {
        job_no: '',
        status: null,
        date: null,
        price: [0, 39000],
        phone: '',
        products: [],
        sort: 'job_no',
        desc: 'yes',
        page: 0,
        limit: 10
      }
    }
  },
  watch: {
    list(val) {
      if (val && this.input.limit === 10) {
        this.input.limit = 15
      } else if (!val && this.input.limit === 15) {
        this.input.limit = 10
      }
      this.formatQuery()
    }
  },
  mounted() {
    this.formatQuery()
    setTimeout(() => {
      if (
        this.$refs.master &&
        this.$refs.master.win &&
        this.$refs.master.win.isSmall
      )
        this.list = true
    }, 1000)
  },
  methods: {
    getJobs(cb = null) {
      this.isLoading = true
      this.$axios({
        method: 'get',
        url: '/job',
        params: { ...this.formattedQuery }
      })
        .then(({ data }) => {
          this.jobs = data.jobs
          this.config.drawer = false
          this.isLoading = false
          this.pagination = this.$_.omit(data, ['jobs'])
          this.loaders = {}
          this.jobs.forEach(j => {
            this.loaders[j._id] = false
          })
          if (cb) {
            cb.handler(cb.args)
          }
        })
        .catch(res => {
          this.isLoading = false
        })
    },
    encodedQuery(input = this.input) {
      const final = this.$_.cloneDeep(input)
      if (final.page > 0) {
        final.page = final.page - 1
      }
      if (final.date) {
        final.date = final.date.join(',')
      }
      if (final.price) {
        final.price = final.price.join(',')
      }
      if (final.requirementsmlt) {
        final.requirementsmlt = final.requirementsmlt.join(',')
      }
      if (final.brandmlt) {
        final.brandmlt = final.brandmlt.join(',')
      }
      return final
    },
    formatQuery(cb = null) {
      this.formattedQuery = this.encodedQuery()
      this.getJobs(cb)
      this.$router.push('/jobs', { query: this.formattedQuery })
    },
    changePage(e) {
      this.input.page = e
      this.formatQuery()
    },
    updateStatus(job, status) {
      if (job.status === status) return
      this.loaders[job._id] = true
      this.$axios({
        url: `/job/${job._id}`,
        method: 'put',
        data: {
          ...this.$_.pick(job, [
            'car',
            'client',
            'requirements',
            'reciptionist',
            'complain',
            'notes',
            'status',
            'operations'
          ]),
          status
        }
      })
        .then(() => {
          this.loaders[job._id] = false
          this.formatQuery({
            handler: this.flash,
            args: { job: job._id, time: 1000 }
          })
          if (status === 'running' || job.status === 'running')
            this.$root.$emit('updateRunningJobs')
        })
        .catch(() => {
          this.loaders[job._id] = false
        })
    },
    flash(args) {
      setTimeout(() => {
        this.flashers = args.job
        setTimeout(() => {
          this.preflash = args.job
          this.flashers = null
        }, args.time || 1000)
      }, 700)
    },
    deleteJob(job) {
      this.loaders[job._id] = true
      this.$axios({ url: `/job/${job._id}`, method: 'delete' })
        .then(() => {
          this.loaders[job._id] = false
          this.formatQuery()
        })
        .catch(() => {
          this.loaders[job._id] = false
        })
    }
  }
}
</script>

<style lang="css" scoped>
.job-status-section {
  max-height: 70vh;
  overflow-y: auto
}
</style>
