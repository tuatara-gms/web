<template>
  <master 
    v-coc-loading = "onRender || drawing"
    :on-print = "onPrint"
    coc-loader-bg = "rgba(255,255,255,0.9)"
    coc-loader-text = "Rendering..."
    @collapse = "boundLogos(1000)">
    <div 
      v-if = "user"
      :style = "{ width: onPrint ? '600px' : '100%' }">
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
          icon = "ios-refresh"
          class = "right coc-margin-x-5px"
          @clicked = "formatQuery"/>
          <!--         <coc-button   
          :type = "onPrint ? 'primary' : 'default'"         
          icon = "ios-print-outline"
          class = "right coc-margin-x-5px"
          @clicked = "print" /> -->
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
      </Drawer>
      <div
        v-if = "jobs && jobs.length"
        class="row">
        <div 
          id = "status" 
          class = "row">
          <p class = "coc-text-title coc-text-bold">Jobs Status</p>
          <divider />
          <div
            v-coc-mouse-leave = "'jello'"
            v-coc-mouse-over = "'pulse'"
            class="col l4 s12 animated pulse">
            <i-circle
              :percent="jobs.filter(j => j.status.toLowerCase() === 'running').length * 100 / jobs.length"
              :size = "200"
              class = "centerized ">
              <div 
                class="demo-Circle-inner coc-text-md-1" 
                style="">
                <span class = "coc-info-text coc-text-bold coc-padding-bottom-5px">Running</span>
                <p class = "coc-padding-top-5px">Count: {{ jobs.filter(j => j.status.toLowerCase() === 'running').length | CocMigaNumber }}</p>
                <p class = "coc-padding-top-5px coc-text-bold">{{ jobs.filter(j => j.status.toLowerCase() === 'running').length * 100 / jobs.length | CocToFixedOne }}%</p>
              </div>
            </i-circle>
          </div>
          <div
            v-coc-mouse-leave = "'jello'"
            v-coc-mouse-over = "'pulse'"
            class="col l4 s12 animated pulse">
            <i-circle
              :percent="jobs.filter(j => j.status.toLowerCase() === 'finished').length * 100 / jobs.length"
              :size="200"
              stroke-color = "#19be6b"
              class = "centerized">
              <div
                class="demo-Circle-inner coc-text-md-1" 
                style="">
                <span class = "coc-success-text coc-text-bold coc-border-0 coc-border-bottom-1 coc-text-md-2">Finished</span><br>
                <p class = "coc-padding-top-5px">Count: {{ jobs.filter(j => j.status.toLowerCase() === 'finished').length | CocMigaNumber }}</p>
                <p class = "coc-padding-top-5px coc-text-bold">{{ jobs.filter(j => j.status.toLowerCase() === 'finished').length * 100 / jobs.length | CocToFixedOne }}%</p>
              </div>
            </i-circle>
          </div>
          <div
            v-coc-mouse-leave = "'jello'"
            v-coc-mouse-over = "'pulse'"
            class="col l4 s12 animated pulse">
            <i-circle 
              :percent="jobs.filter(j => j.status.toLowerCase() === 'postponed').length * 100 / jobs.length"
              :size = "200"
              stroke-color = "#ff9900"
              class = "centerized">
              <div 
                class="demo-Circle-inner coc-text-md-1" 
                style="">
                <span class = "coc-warning-text coc-text-bold coc-padding-bottom-5px">Postponed</span>
                <p class = "coc-padding-top-5px">Count: {{ jobs.filter(j => j.status.toLowerCase() === 'postponed').length | CocMigaNumber }}</p>
                <p class = "coc-padding-top-5px coc-text-bold">{{ jobs.filter(j => j.status.toLowerCase() === 'postponed').length * 100 / jobs.length | CocToFixedOne }}%</p>
              </div>
            </i-circle>
          </div>
        </div>
        <divider class = "coc-margin-y-10px" />
        <div 
          id = "daily-count" 
          class="row">
          <p class = "coc-text-title coc-text-bold">Daily Income</p>
          <divider />
          <div id="general-jobs" />
        </div>
        <div 
          id = "monthly-count" 
          class="row">
          <p class = "coc-text-title coc-text-bold">Monthly Income</p>
          <divider />
          <div id="monthly-jobs" />
        </div>
        <div 
          id = "annualy-count" 
          class="row">
          <p class = "coc-text-title coc-text-bold">Annualy Income</p>
          <divider />
          <div id="annualy-jobs" />
        </div>
        <div 
          id = "requirements-analytics" 
          class="row">
          <p class = "coc-text-title coc-text-bold">Requirements Status</p>
          <divider />
          <div id="requirements-jobs" />
          <br>
          <div id="requirements-radar" />
        </div>
        <div 
          id = "requirements-analytics" 
          class="row">
          <p class = "coc-text-title coc-text-bold">Requirements Time Consumption</p>
          <divider />
          <div id="requirements-time" />
          <br>
          <div id="requirements-time-bar" />
        </div>
        <divider class = "coc-margin-y-10px" />
      </div>
    </div>
    <Card v-else>
      <p class = "coc-text-title coc-error-text center">
        <Icon type = "ios-alert-outline"/>
        You Are Not Logged In
      </p>
      <br>
      <p class="center">
        <button-group>
          <coc-button
            type = "default"
            size = "large"
            shape = "circle"
            style = "width: 120px"
            @clicked = "askForLogin">
            Login
          </coc-button>
        </button-group>
      </p>
    </Card>
  </master>
</template>

<script>
import Master from '~/components/common/master'
import JobsStatsCharts from '~/components/jobs/JobsStatsCharts'
import brands from '~/plugins/brands'
export default {
  name: 'JobsAnalyticsJobs',
  components: {
    Master,
    JobsStatsCharts
  },
  head() {
    return {
      title: this.$store.state.core.app
        ? `${this.$store.state.core.app.title} | Jobs Analytics`
        : 'Jobs Analytics'
    }
  },
  data() {
    return {
      brands,
      onPrint: false,
      apx: null,
      list: false,
      loaders: {},
      flashers: null,
      preflash: null,
      isLoading: false,
      formattedQuery: {},
      pagination: null,
      onRender: false,
      drawing: false,
      renders: 0,
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
  computed: {
    user() {
      return this.$store.state.core.auth
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
    if (window) {
      const vm = this
      window.onfocus = () => {
        vm.onPrint = false
      }
    }
    setTimeout(() => {
      this.formatQuery()
      if (process.client) {
        this.apx = require('apexcharts')
      }
      document.onresize = this.boundLogos
    }, 1000)
  },
  methods: {
    askForLogin() {
      this.$root.$emit('askForLogin')
    },
    getJobs(cb = null) {
      this.isLoading = true
      this.$axios({
        method: 'get',
        url: '/job',
        params: { ...this.formattedQuery, stats: 'yes' }
      })
        .then(({ data }) => {
          this.jobs = data.jobs
          this.config.drawer = false
          this.isLoading = false
          this.pagination = this.$_.omit(data, ['jobs'])
          this.loaders = {}
          // pull logos
          this.boundLogos()
          this.renderAllCharts()
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
    boundLogos(time = 500) {
      // setTimeout(() => {
      //   if (document) {
      //     const logos = document.getElementsByClassName('bg-blur')
      //     let i
      //     for (i = 0; i < logos.length; i += 1) {
      //       logos[i].style.left = `${logos[i].parentElement.offsetWidth / 2 -
      //         85}px`
      //     }
      //   }
      // }, time)
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
      if (final.brandmlt) {
        final.brandmlt = final.brandmlt.join(',')
      }
      if (final.requirementsmlt) {
        final.requirementsmlt = final.requirementsmlt.join(',')
      }
      return final
    },
    formatQuery(cb = null) {
      this.formattedQuery = this.encodedQuery()
      this.getJobs(cb)
      // this.$router.push('/analytics/jobs', { query: this.formattedQuery })
    },
    createPricesChart(args) {
      var options = {
        chart: {
          height: 350,
          type: args.type || 'area'
        },
        title: {
          text: args.title || 'Fundamental Analysis of Jobs',
          align: 'left'
        },
        subtitle: {
          text: args.subtitle || 'Jobs Income',
          align: 'left'
        },
        labels: args.labels || {
          enabled: false
        },
        dataLabel: args.dataLabel,
        dataLabels: args.dataLabels || {},
        stroke: args.stroke || {
          curve: 'smooth'
        },
        markers: args.markers || {},
        yaxis: args.yaxis || {
          opposite: true
        },
        legend: {
          horizontalAlign: 'left'
        },
        series: args.series,

        xaxis: args.xaxis,
        tooltip: {
          x: {
            format: 'dd/MM/yy HH:mm'
          }
        }
      }

      const chart = new this.apx.default(
        document.querySelector(args.id),
        options
      )
      chart.render()
    },
    renderAllCharts() {
      this.onRender = true
      setTimeout(() => {
        this.drawing = true
        this.onRender = false
        const jobsDays = this.$_.uniq(
          this.jobs.map(j => this.$moment(j.timein).format('YYYY-MM-DD'))
        )
        const jobsMonths = this.$_.uniq(
          this.jobs.map(j => this.$moment(j.timein).format('YYYY-MM'))
        )
        const jobsYears = this.$_.uniq(
          this.jobs.map(j => this.$moment(j.timein).format('YYYY'))
        )
        const allRequirements = this.$coc.CielChilds(
          this.jobs,
          j => j.requirements
        )
        const requirementsNames = this.$_.uniqBy(allRequirements, j =>
          j.name.toLowerCase()
        ).map(r => r.name.toLowerCase())
        const requirementsDone = []
        const requirementsRunning = []
        const requirementsTimeConsumption = []
        const daylyJobsPrices = []
        const monthlyJobsPrices = []
        const annualyJobsPrices = []
        let i
        let j
        let sum = {}
        // Requirements
        for (i = 0; i < requirementsNames.length; i += 1) {
          sum = {
            finished: 0,
            running: 0,
            time: 0
          }
          for (j = 0; j < allRequirements.length; j += 1) {
            if (
              requirementsNames[i] === allRequirements[j].name.toLowerCase()
            ) {
              sum.finished += allRequirements[j].done ? 1 : 0
              sum.running += allRequirements[j].done ? 0 : 1
              sum.time += allRequirements[j].updated_at
                ? this.$moment(allRequirements[j].updated_at).diff(
                    this.$moment(allRequirements[j].created_at),
                    'minutes'
                  )
                : 0
            }
          }
          requirementsDone.push(sum.finished)
          requirementsRunning.push(sum.running)
          requirementsTimeConsumption.push(sum.time)
        }
        // Days
        for (i = 0; i < jobsDays.length; i += 1) {
          daylyJobsPrices.push(
            this.$_.sumBy(
              this.jobs.filter(
                j => jobsDays[i] === this.$moment(j.timein).format('YYYY-MM-DD')
              ),
              j => j.price
            )
          )
        }

        // Months
        for (i = 0; i < jobsMonths.length; i += 1) {
          monthlyJobsPrices.push(
            this.$_.sumBy(
              this.jobs.filter(
                j => jobsMonths[i] === this.$moment(j.timein).format('YYYY-MM')
              ),
              j => j.price
            )
          )
        }

        // Years
        for (i = 0; i < jobsYears.length; i += 1) {
          annualyJobsPrices.push(
            this.$_.sumBy(
              this.jobs.filter(
                j => jobsYears[i] === this.$moment(j.timein).format('YYYY')
              ),
              j => j.price
            )
          )
        }

        setTimeout(() => {
          // Days
          this.createPricesChart({
            id: '#general-jobs',
            xaxis: {
              type: 'datetime'
            },
            labels: jobsDays,
            series: [
              {
                name: 'Prices',
                data: daylyJobsPrices
              }
            ]
          })

          // Months
          this.createPricesChart({
            id: '#monthly-jobs',
            xaxis: {
              type: 'datetime'
            },
            labels: jobsMonths,
            series: [
              {
                name: 'Prices',
                data: monthlyJobsPrices
              }
            ]
          })

          // Years
          this.createPricesChart({
            id: '#annualy-jobs',
            xaxis: {
              type: 'datetime'
            },
            labels: jobsYears,
            series: [
              {
                name: 'Prices',
                data: annualyJobsPrices
              }
            ]
          })

          this.createPricesChart({
            id: '#requirements-jobs',
            subtitle: 'Jobs Requirements Count (Running / Finished)',
            labels: requirementsNames,
            type: 'line',

            stroke: {
              width: [5, 7, 5],
              curve: 'smooth',
              dashArray: [0, 0]
            },
            markers: {
              discrete: [
                {
                  seriesIndex: 0,
                  dataPointIndex: 7,
                  fillColor: '#e3e3e3',
                  strokeColor: '#fff',
                  size: 5
                },
                {
                  seriesIndex: 2,
                  dataPointIndex: 11,
                  fillColor: '#f7f4f3',
                  strokeColor: '#eee',
                  size: 4
                }
              ]
            },
            series: [
              {
                name: 'Running Requirements',
                data: requirementsRunning,
                type: 'line'
              },
              {
                name: 'Finished Requirements',
                data: requirementsDone
              }
            ]
          })
          this.createPricesChart({
            id: '#requirements-radar',
            subtitle: 'Jobs Requirements',
            labels: requirementsNames,
            type: 'radar',
            series: [
              {
                name: 'Running Requirements',
                data: requirementsRunning
              },
              {
                name: 'Finished Requirements',
                data: requirementsDone
              }
            ]
          })
          const vm = this
          this.createPricesChart({
            id: '#requirements-time',
            subtitle: 'Jobs Time Consumption in Hours',
            labels: requirementsNames,
            type: 'pie',
            series: requirementsTimeConsumption
          })
          this.createPricesChart({
            id: '#requirements-time-bar',
            subtitle: 'Jobs Time Consumption in Hours',
            labels: requirementsNames,
            type: 'line',
            series: [
              {
                data: requirementsTimeConsumption,
                name: 'all',
                type: 'column'
              }
              // { data: requirementsTimeConsumption, name: 'all', type: 'line' }
            ]
          })
          this.renders += 1
          this.drawing = false
          if (this.$route.query.scroll) {
            setTimeout(() => {
              const eTarget = document.getElementById(this.$route.query.scroll)
              if (eTarget) {
                eTarget.scrollIntoView()
                // this.$router.push(`/analytics/automobiles/`)
              }
            }, 500)
          }
        }, 1000)
      }, 500)
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
    getSortedCars(jobs) {
      return this.$_.reverse(
        this.$_.sortBy(
          this.$_.uniqBy(jobs, j => j.car.brand).map(j => ({
            ...j,
            count: jobs.filter(i => i.car.brand === j.car.brand).length
          })),
          ['count', o => o.car.brand]
        )
      ).map(mp => mp.car.brand)
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
    print() {
      if (this.onPrint) {
        this.onPrint = false
        return
      }
      this.onPrint = true
      setTimeout(() => {
        this.boundLogos()
        this.renderAllCharts()
        setTimeout(() => {
          window.print()
        }, 3000)
      }, 1000)
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
  overflow-y: scroll
}
.bg-blur{
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 170px;
  width: 170px;
  position: absolute;
  border-radius: 50%;
  transition: left linear 0.4s;
  margin-top: 15px;
}
</style>
