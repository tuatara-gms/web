<template>
  <master
    v-coc-loading = "onRender || drawing"
    coc-loader-bg = "rgba(255,255,255,0.9)"
    coc-loader-text = "Rendering..."
    @collapse = "boundLogos(1000)">
    <div
      v-coc-loading = "isLoading"
      v-if = "user">
      <div class="row">
        <coc-button
          icon = "ios-funnel-outline"
          class = "right"
          @clicked = "config.drawer = true"/>
        <coc-button
          icon = "ios-refresh"
          class = "right coc-margin-x-5px"
          @clicked = "formatQuery"/>
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
        v-if = "jobs && jobs.length && !onRender"
        class="row">
        <p class = "coc-text-title coc-text-bold">
          <icon type = " knocks-money" />
          Daily Income
        </p>
        <divider />
        <div class="col l6 s12">
          <div id="general-makes" />
        </div>
        <div class="col l6 s12">
          <div id="general-makes-radar" />
        </div>
        <div
          id = "daily-count"
          class="col s12">
          <p class = "coc-text-title coc-text-bold">
            <icon type = " knocks-calendar4" />
            Daily Count
          </p>
          <divider />
          <div class="row coc-house-keeper">
            <tooltip
              content = "Linear And Radar Charts View"
              class = "right"
              theme = "light">
              <button-group
                size = "small"
                class = "right">
                <coc-button
                  :disabled = "timePresentation.days === 'line'"
                  icon = " knocks-chart-line"
                  @clicked = "$route.query.scroll = 'daily-count'; timePresentation.days = 'line'" />
                <coc-button
                  :disabled = "timePresentation.days === 'radar'"
                  icon = " knocks-point2"
                  @clicked = "$route.query.scroll = 'daily-count'; timePresentation.days = 'radar'" />
              </button-group>
            </tooltip>
          </div>
          <div id="general-daily-radar" />
        </div>
        <div
          id = "monthly-count"
          class="col s12">
          <p class = "coc-text-title coc-text-bold">
            <icon type = " knocks-calendar7" />
            Monthly Count
          </p>
          <divider />
          <div class="row coc-house-keeper">
            <tooltip
              content = "Linear And Radar Charts View"
              class = "right"
              theme = "light">
              <button-group
                size = "small"
                class = "right">
                <coc-button
                  :disabled = "timePresentation.months === 'line'"
                  icon = " knocks-chart-line"
                  @clicked = "$route.query.scroll = 'monthly-count'; timePresentation.months = 'line'" />
                <coc-button
                  :disabled = "timePresentation.months === 'radar'"
                  icon = " knocks-point2"
                  @clicked = "$route.query.scroll = 'monthly-count'; timePresentation.months = 'radar'" />
              </button-group>
            </tooltip>
          </div>
          <div id="general-monthly-radar" />
        </div>
        <div
          id = "annual-count"
          class="col s12">
          <p class = "coc-text-title coc-text-bold">
            <icon type = " knocks-calendar10" />
            Annualy Count
          </p>
          <divider />
          <div class="row coc-house-keeper">
            <tooltip
              content = "Linear And Radar Charts View"
              class = "right"
              theme = "light">
              <button-group
                size = "small"
                class = "right">
                <coc-button
                  :disabled = "timePresentation.years === 'line'"
                  icon = " knocks-chart-line"
                  @clicked = "$route.query.scroll = 'annual-count'; timePresentation.years = 'line'" />
                <coc-button
                  :disabled = "timePresentation.years === 'radar'"
                  icon = " knocks-point2"
                  @clicked = "$route.query.scroll = 'annual-count'; timePresentation.years = 'radar'" />
              </button-group>
            </tooltip>
          </div>
          <div id="general-annualy-radar" />
        </div>
        <divider class = "coc-margin-y-10px" />
        <div
          id = "car-makes"
          class="row">
          <p class = "coc-text-title coc-text-bold">
            <icon type = " tcsc-car-icon" />
            Car Makes
          </p>
          <divider />
          <div
            v-for = "(make, m) in getSortedCars(jobs)"
            :key = "m"
            class="col l4 s12 animated pulse coc-padding-y-10px">
            <div
              :style = "`background: url(/snaps/brands/png/${make.split(' ').join('-').toLowerCase()}.png); background-size: cover`"
              class = "bg-blur" />
            <i-circle 
              :percent="jobs.filter(j => j.car.brand === make).length * 100 / jobs.length"
              :size = "250"
              :style = "`background:rgba(0,0,0,0.85); border-radius: 50%;`"
              class = "centerized"
              stroke-color = "#ed4014">
              <div
                class="demo-Circle-inner coc-text-md-1 coc-secondary-text" 
                style="">
                <span class = "coc-error-text coc-text-bold coc-padding-bottom-5px">{{ make | CocCapitalizeName }}</span>
                <p class = "coc-padding-top-5px">
                  <icon type = "ios-albums-outline" />
                  Count: {{ jobs.filter(j => j.car.brand === make).length | CocMigaNumber }}
                </p>
                <p class = "coc-padding-top-5px">
                  <icon type = "ios-pie-outline" />
                  {{ jobs.filter(j => j.car.brand === make).length * 100 / jobs.length | CocToFixedOne }}%
                </p>
                <p class = "coc-padding-top-5px">
                  <tooltip content = "Total Income">
                    <icon type = "ios-cash-outline" />
                  </tooltip>
                  {{ $_.sumBy(jobs.filter(j => j.car.brand === make), o => o.price) | CocMigaNumber }} LE
                </p>
                <p class = "coc-padding-top-5px">
                  <tooltip content = "Total Time Consumption">
                    <icon type = "ios-clock-outline" />
                  </tooltip>
                  {{ ($_.sumBy(jobs.filter(j => j.car.brand === make && j.timeleave), o => $moment(o.timeleave).diff($moment(o.timein),'hours'))) | CocMigaNumber }} H
                </p>
                <p class = "coc-padding-top-5px">
                  <tooltip content = "Time Consumption Average">
                    <icon type = "ios-stopwatch-outline" />
                  </tooltip>
                  ~
                  {{ 
                    (
                      ($_.sumBy(jobs.filter(j => j.car.brand === make && j.timeleave), o => $moment(o.timeleave).diff($moment(o.timein),'hours')))
                      / 
                      jobs.filter(j => j.car.brand === make).length
                    ).toFixed(2)
                  }} H
                </p>
                <p class = "coc-padding-top-5px">
                  <tooltip content = "Hour Rate">
                    <icon type = "ios-timer-outline" />
                  </tooltip>
                  {{ 
                    ($_.sumBy(jobs.filter(j => j.car.brand === make), o => o.price)
                      / 
                      Math.max($_.sumBy(jobs.filter(j => j.car.brand === make && j.timeleave), o => $moment(o.timeleave).diff($moment(o.timein),'hours')),1)).toFixed(2)
                  }} LE/H
                </p>
              </div>
            </i-circle>
          </div>
        </div>
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
export default {
  name: 'JobsAnalyticsAutomobiles',
  components: {
    Master,
    JobsStatsCharts
  },
  head() {
    return {
      title: this.$store.state.core.app
        ? `${this.$store.state.core.app.title} | Automobiles Analytics`
        : 'Automobiles Analytics'
    }
  },
  data() {
    return {
      apx: null,
      timePresentation: {
        days: 'radar',
        months: 'radar',
        years: 'radar'
      },
      drawing: false,
      onRender: false,
      list: false,
      loaders: {},
      flashers: null,
      preflash: null,
      isLoading: false,
      formattedQuery: {},
      pagination: null,
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
        brandmlt: [],
        price: [0, 39900],
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
    },
    timePresentation: {
      deep: true,
      handler(val) {
        this.renderAllCharts()
        this.boundLogos()
      }
    }
  },
  mounted() {
    this.$axios({
      url: 'http://128.14.5.91:8800/',
      method: 'get'
    })
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
          this.renderAllCharts()
          this.boundLogos()
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
    boundLogos(time = 700) {
      setTimeout(() => {
        if (document) {
          const logos = document.getElementsByClassName('bg-blur')
          let i
          for (i = 0; i < logos.length; i += 1) {
            logos[i].style.left = `${logos[i].parentElement.offsetWidth / 2 -
              110}px`
          }
        }
      }, time)
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
      return final
    },
    formatQuery(cb = null) {
      this.formattedQuery = this.encodedQuery()
      this.getJobs(cb)
      // this.$router.push('/analytics/automobiles', {
      //   query: { ...this.$route.query, ...this.formattedQuery }
      // })
    },
    createPricesChart(args) {
      var options = {
        chart: {
          height: 350,
          type: args.type || 'radar'
        },
        dataLabels: args.dataLabels || {
          name: {
            show: true
          },
          value: {
            show: true,
            formatter: val => (typeof val === 'number' ? val.toFixed(2) : val)
          }
        },
        title: {
          text: args.title || 'Fundamental Analysis of Jobs',
          align: 'left'
        },
        subtitle: {
          text: args.subtitle || 'Cars Percentage',
          align: 'left'
        },
        labels: args.labels || {
          enabled: false
        },
        stroke: {
          curve: 'smooth'
        },
        yaxis: args.yaxis || {
          opposite: true
        },
        legend: {
          horizontalAlign: 'left'
        },
        series: args.series,
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: 'bottom'
              }
            }
          }
        ]
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
        const carBrands = this.$_.uniq(this.jobs.map(j => j.car.brand))
        const jobsDays = this.$_.uniq(
          this.jobs.map(j => this.$moment(j.timein).format('YYYY-MM-DD'))
        )
        const jobsMonths = this.$_.uniq(
          this.jobs.map(j => this.$moment(j.timein).format('YYYY-MM'))
        )
        const jobsYears = this.$_.uniq(
          this.jobs.map(j => this.$moment(j.timein).format('YYYY'))
        )
        const brandsCount = []
        const daylyJobsMakes = []
        const monthlyJobsMakes = []
        const annualyJobsMakes = []
        let i
        let k
        let tempSeries = []

        carBrands.forEach(i => {
          brandsCount.push(this.jobs.filter(j => j.car.brand === i).length)
        })
        // Days
        for (k = 0; k < carBrands.length; k += 1) {
          tempSeries = []
          for (i = 0; i < jobsDays.length; i += 1) {
            tempSeries.push(
              this.jobs.filter(
                j =>
                  carBrands[k] === j.car.brand &&
                  jobsDays[i] === this.$moment(j.timein).format('YYYY-MM-DD')
              ).length
            )
          }
          daylyJobsMakes.push({
            name: carBrands[k],
            data: tempSeries,
            formatter: value => value.toFixed(2)
          })
        }

        // Months
        for (k = 0; k < carBrands.length; k += 1) {
          tempSeries = []
          for (i = 0; i < jobsMonths.length; i += 1) {
            tempSeries.push(
              this.jobs.filter(
                j =>
                  carBrands[k] === j.car.brand &&
                  jobsMonths[i] === this.$moment(j.timein).format('YYYY-MM')
              ).length
            )
          }
          monthlyJobsMakes.push({
            name: carBrands[k],
            data: tempSeries
          })
        }

        // Days
        for (k = 0; k < carBrands.length; k += 1) {
          tempSeries = []
          for (i = 0; i < jobsYears.length; i += 1) {
            tempSeries.push(
              this.jobs.filter(
                j =>
                  carBrands[k] === j.car.brand &&
                  jobsYears[i] === this.$moment(j.timein).format('YYYY')
              ).length
            )
          }
          annualyJobsMakes.push({
            name: carBrands[k],
            data: tempSeries
          })
        }
        setTimeout(() => {
          // All
          this.createPricesChart({
            id: '#general-makes-radar',
            title: 'Car Makes / Jobs Count',
            labels: carBrands,
            series: [
              {
                name: 'Car Makes',
                data: brandsCount
              }
            ]
          })
          this.createPricesChart({
            id: '#general-makes',
            labels: carBrands,
            type: 'pie',
            series: brandsCount
          })

          this.createPricesChart({
            title: 'Car Makes / Daily Count',
            type:
              daylyJobsMakes.length > 2 &&
              this.timePresentation.days === 'radar'
                ? 'radar'
                : 'line',
            id: '#general-daily-radar',
            dataLabels: {
              formatter: val => this.$moment(val).format('D MMM YY')
            },
            labels: jobsDays,
            series: daylyJobsMakes
          })

          this.createPricesChart({
            title: 'Car Makes / Monthly Count',
            type:
              daylyJobsMakes.length > 2 &&
              this.timePresentation.months === 'radar'
                ? 'radar'
                : 'line',
            id: '#general-monthly-radar',
            dataLabels: {
              formatter: val => this.$moment(val).format('MMMM YY')
            },
            labels: jobsMonths,
            series: monthlyJobsMakes
          })
          this.createPricesChart({
            title: 'Car Makes / Annualy Count',
            type:
              daylyJobsMakes.length > 2 &&
              this.timePresentation.years === 'radar'
                ? 'radar'
                : 'line',
            id: '#general-annualy-radar',
            labels: jobsYears,
            type: jobsYears > 2 ? 'radar' : 'line',
            series: annualyJobsMakes
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
  height:220px;
  width: 220px;
  position: absolute;
  border-radius: 50%;
  transition: left linear 0.4s;
  margin-top: 15px;
}
</style>
