
<template>
  <master 
    v-coc-loading = "onRender || drawing"
    coc-loader-bg = "rgba(255,255,255,0.9)"
    coc-loader-text = "Rendering...">
    <div v-if = "user">
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
                <Divider 
                  class = "coc-margin-y-0" 
                  orientation = "left"><span class = "coc-text-bold coc-info-shade-4-text coc-text-sm">Item Data</span> </Divider>
                <div class = "col s12 l6">
                  <coc-input
                    v-model = "input.part"
                    :scope = "['get-stock']"
                    :autocomplete-remote = "model => ({ method: 'get', url: '/stock', params: { part: model.val, limit: 5 } } )"
                    :autocomplete-map-response = "(res) => $_.uniqBy(res.stock.filter(s => !!s.name), j => j.name).map(j => j.name)"
                    labeled
                    icon = "ios-search"
                    placeholder = "Search by Part Name.."
                    class = "coc-house-keeper"
                    allow-autocomplete
                    clearable
                    light-model />
                </div>
                <div class = "col s12 l6">
                  <coc-select
                    v-model = "input.category"
                    :scope = "['get-stock']"
                    :autocomplete-remote = "model => ({ method: 'get', url: '/stock', params: { categoryac: model.meta.query, limit: 5 } } )"
                    :autocomplete-map-response = "(res) => $_.uniqBy(res.stock.filter(s => !!s.category), j => j.category).map(j => j.category)"
                    placeholder = "Category.."
                    labeled
                    filterable
                    light-model
                    multiple
                    allow-autocomplete
                    clearable />
                </div>
                <div class="col s12 l6">
                  <p class = "coc-content-text coc-text-small">Entery Time</p>
                  <DatePicker 
                    v-model = "input.date"
                    :start-date="$moment().toDate()"
                    labeled 
                    type="daterange" 
                    placement="bottom-end" 
                    placeholder="Select date" 
                    style="width: 100%"/>
                </div>
              </div>
              <div class="row coc-house-keeper">
                <div class = "col s12 l6">
                  <Slider 
                    v-model="input.price"
                    :step = "config.price.step"
                    :max = "config.price.max"
                    labeled 
                    range 
                    show-stops/>
                </div>
                <div class = "col s12 l6">
                  <div class="right">
                    <i-switch 
                      v-model = "input.external"
                      :disabled = "input.ignore_external" 
                      light-model
                      class = "right coc-margin-top-10px"/>   
                    <span class="coc-padding-x-5px right">
                      <span>External Resources</span><br>
                      <small class="right">(salaries, taxs, etc..)</small>
                    </span>
                  </div>
                  <div class="coc-padding-x-20px">
                    <i-switch 
                      v-model = "input.ignore_external" 
                      light-model
                      class = "right coc-margin-top-10px"/>   
                    <span class="coc-padding-x-5px right">
                      <span>Select All</span><br>
                      <small class="right">(select all externals and not externals)</small>
                    </span>
                  </div>
                </div>
              </div>
              <Divider 
                class = "coc-margin-y-0" 
                orientation = "left"><span class = "coc-text-bold coc-info-shade-4-text coc-text-sm">Vendor Data</span> </Divider>
              <div class="row coc-house-keeper">
                <div class = "col s12 l6">
                  <coc-input
                    v-model = "input.phone"
                    :scope = "['get-stock']"
                    :autocomplete-remote = "model => ({ method: 'get', url: '/stock', params: { phone: model.val, limit: 5 } } )"
                    :autocomplete-map-response = "(res) => $_.uniqBy(res.stock.filter(s => !!s.vendor), j => j.vendor.phone).map(j => j.vendor.phone)"
                    labeled
                    icon = "ios-search"
                    placeholder = "Search by Phone.."
                    class = "coc-house-keeper"
                    allow-autocomplete
                    clearable
                    light-model />
                </div>
                <div class = "col s12 l6">
                  <coc-input
                    v-model = "input.name"
                    :scope = "['get-stock']"
                    :autocomplete-remote = "model => ({ method: 'get', url: '/stock', params: { name: model.val, limit: 5 } } )"
                    :autocomplete-map-response = "(res) => $_.uniqBy(res.stock.filter(s => !!s.vendor), j => j.vendor.name).map(j => j.vendor.name)"
                    labeled
                    icon = "ios-search"
                    placeholder = "Search by vendor name.."
                    class = "coc-house-keeper"
                    allow-autocomplete
                    clearable
                    light-model />
                </div>
              </div>
              <Divider 
                class = "coc-margin-y-0" 
                orientation = "left"><span class = "coc-text-bold coc-info-shade-4-text coc-text-sm">Car Compatibility</span> </Divider>
              <div class="row coc-house-keeper">
                <div class = "col s12 l6">
                  <coc-select
                    v-model = "input.brand"
                    :scope = "['get-stock']"
                    :autocomplete-remote = "model => ({ method: 'get', url: '/job', params: { brandac: model.val, limit: 5 } } )"
                    :autocomplete-map-response = "(res) => $_.uniqBy(res.stocks, j => j.car.brand).map(j => j.car.brand)"
                    :data = "brands"
                    labeled
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
                  <coc-input
                    v-model = "input.modelac"
                    :scope = "['get-stock']"
                    labeled
                    icon = "ios-search"
                    placeholder = "Search by car model.."
                    class = "coc-house-keeper"
                    clearable
                    filterable
                    multiple
                    light-model />
                </div>
                <div class="col s12 l6">
                  <coc-select
                    v-model = "input.release"
                    :scope = "['get-stock']"
                    :data = "generateYears()"
                    labeled
                    placeholder = "Release Year"
                    icon = "ios-calendar"
                    filterable
                    clearable
                    multiple
                    light-model />
                </div>
              </div>
              <Divider 
                class = "coc-margin-y-0" 
                orientation = "left"><span class = "coc-text-bold coc-info-shade-4-text coc-text-sm">Sorting</span> </Divider>
              <div class="row">
                <div class = "col s12 l6">
                  <coc-select
                    v-model = "input.sort"
                    :scope = "['get-stock']"
                    labeled
                    placeholder = "Sort By.."
                    light-model>
                    <template slot-scope = "{options}">
                      <Option
                        value = "created_at"
                        label = "Date"/>
                      <Option
                        value = "price"
                        label = "Price"/>
                      <Option
                        value = "status"
                        label = "Status"/>
                    </template>
                  </coc-select>
                </div>
                <div class = "col s12 l6 right coc-margin-top-20px">
                  <button-group
                    labeled
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
                  :scope = "['get-stock']"
                  type = "primary" 
                  icon = "ios-funnel-outline coc-text-lg"
                  placeholder = "Filter"
                  long 
                  local
                  @coc-validation-passed = "formatQuery()" />
              </div>
            </div>
          </div>
        </div>
        <Divider 
          class = "coc-margin-y-0" 
          orientation = "right">Search Settings</Divider>
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
        v-if = "isMounted && stock && stock.stock.length" 
        class="row coc-house-keeper">
        <p class = "coc-text-title coc-text-bold">
          <icon type = " tcsc-stock-icon" />
          All Stock
        </p>
        <divider />
        <div
          v-for = "(stock, s) in stock.stock" 
          v-if = "s >= ((pagination.page - 1) * pagination.limit) && s < ((pagination.page) * pagination.limit)"
          :key = "s"
          class = "col s12 l3 coc-margin-y-5px">
          <card class = "coc-primary-bg animated zoomIn">
            <p 
              class = "alpha-textarea coc-tiny-border-radius coc-padding-x-5px coc-padding-y-3px coc-text-bold coc-margin-bottom-4px">
              {{ stock.name | CocToUpperCase }}
              <Tooltip
                v-if = "stock.quick_add"
                content = "Added on the fly while editing a job"
                class = "right">
                <span class = "knocksapp-fly3 coc-padding-5px coc-content-bg coc-warning-text coc-circle-border-radius"/>
              </Tooltip>
              <Tooltip
                v-else
                content = "Healthy added from Add Stock Form"
                class = "right">
                <span class = "knocksapp-live3 coc-padding-5px coc-content-bg coc-success-text coc-circle-border-radius"/>
              </Tooltip>
            </p>
            <div class="row coc-margin-bottom-4px coc-margin-top-0 coc-padding-0 coc-margin-x-0">
              <span class = "alpha-textarea coc-tiny-border-radius coc-padding-x-5px coc-padding-y-3px flex">
                <b>Count:</b>
                {{ stock.count }}
              </span>
            </div>
            <div class="row coc-margin-bottom-4px coc-margin-top-0 coc-padding-0 coc-margin-x-0">
              <span class = "alpha-textarea coc-tiny-border-radius coc-padding-x-5px coc-padding-y-3px flex">
                <b>Import Price:</b>
                {{ stock.import_price }} LE
              </span>
            </div>
            <div class="row coc-margin-bottom-4px coc-margin-top-0 coc-padding-0 coc-margin-x-0">
              <span class = "alpha-textarea coc-tiny-border-radius coc-padding-x-5px coc-padding-y-3px flex">
                <b>Export Price:</b>
                {{ stock.price }} LE
              </span>
            </div>
            <div class="row coc-margin-bottom-4px coc-margin-top-0 coc-padding-0 coc-margin-x-0">
              <span class = "alpha-textarea coc-tiny-border-radius coc-padding-x-5px coc-padding-y-3px flex">
                <b>Price Margin:</b>
                {{ stock.price - stock.import_price }} LE
              </span>
            </div>
            <div class="row coc-margin-bottom-4px coc-margin-top-0 coc-padding-0 coc-margin-x-0">
              <span class = "alpha-textarea coc-tiny-border-radius coc-padding-x-5px coc-padding-y-3px flex">
                <b>Date:</b>
                {{ $moment(stock.created_at).format('D/M/YYYY H:m A') }}
              </span>
            </div>
            <div class="row coc-margin-bottom-4px coc-margin-top-0 coc-padding-0 coc-margin-x-0">
              <span class = "alpha-textarea coc-tiny-border-radius coc-padding-x-5px coc-padding-y-3px flex">
                <b>Imports Count:</b>
                {{ stock.imports }}
              </span>
            </div>
            <div class="row coc-margin-bottom-4px coc-margin-top-0 coc-padding-0 coc-margin-x-0">
              <span class = "alpha-textarea coc-tiny-border-radius coc-padding-x-5px coc-padding-y-3px flex">
                <b>Exports Count:</b>
                {{ stock.exports }}
              </span>
            </div>
            <div class="row coc-margin-bottom-4px coc-margin-top-0 coc-padding-0 coc-margin-x-0">
              <nuxt-link 
                :to = "`/stock?part=${stock.name}`" 
                class = "right coc-padding-x-3px">
                <span class = "alpha-textarea coc-tiny-border-radius coc-padding-x-5px coc-padding-y-3px flex">Visit</span>
              </nuxt-link>
            </div>
          </card>
        </div>
        <div 
          v-if = "stock && stock.stock.length"
          style = " padding-top: 10px !important; margin-top: 5px; margin-bottom: 10px;" 
          class="col s12 ">
          <Page
            :total="stock.stock.length"
            :page-size = "pagination.limit"
            :current="pagination.page"
            :styles = "{margin: 'auto', display: 'block', width: 'fit-content'}"
            @on-change = "changePage"/>
        </div>
        <div class="col right">
          <p class = "right coc-text-sm">Page Size</p><br>
          <coc-number-input
            v-model = "pagination.limit" 
            size = "small"
            class = ""
            light-model/>
        </div>
        <div
          id = "general-stock"
          class="col s12">
          <p class = "coc-text-title coc-text-bold">
            <icon type = " knocks-chart" />
            Count Ratio
          </p>
          <divider />
          <div 
            v-if = "!drawing" 
            class="col s6">
            <div id = "stock-pie"/>
          </div>
          <div 
            v-if = "!drawing" 
            class="col s6">
            <div id = "stock-radar"/>
          </div>
        </div>
      </div>
      <div
        id = "margin-stock"
        class="row">
        <p class = "coc-text-title coc-text-bold">
          <icon type = " knocks-measure" />
          Margin Ratio
        </p>
        <divider />
        <div 
          v-if = "!drawing" 
          class="col s6">
          <div id = "margin-pie"/>
        </div>
        <div 
          v-if = "!drawing" 
          class="col s6">
          <div id = "margin-radar"/>
        </div>
        <div 
          v-if = "!drawing" 
          class="col s12">
          <div id = "margin-line"/>
        </div>
      </div>
      <div
        id = "demand-stock"
        class="row">
        <p class = "coc-text-title coc-text-bold">
          <icon type = " knocks-folder-minus" />
          Demand Ratio
        </p>
        <divider />
        <div 
          v-if = "!drawing" 
          class="col s6">
          <div id = "demand-pie"/>
        </div>
        <div 
          v-if = "!drawing" 
          class="col s6">
          <div id = "demand-radar"/>
        </div>
        <div 
          v-if = "!drawing" 
          class="col s12">
          <div id = "demand-line"/>
        </div>
      </div>
      <div
        id = "support-stock"
        class="row">
        <p class = "coc-text-title coc-text-bold">
          <icon type = " knocks-folder-plus" />
          Support Ratio
        </p>
        <divider />
        <div 
          v-if = "!drawing" 
          class="col s6">
          <div id = "support-pie"/>
        </div>
        <div 
          v-if = "!drawing" 
          class="col s6">
          <div id = "support-radar"/>
        </div>
        <div 
          v-if = "!drawing" 
          class="col s12">
          <div id = "support-line"/>
        </div>
      </div>
      <div
        id = "support-demand-stock"
        class="row">
        <p class = "coc-text-title coc-text-bold">
          <icon type = " knocks-crop5" />
          Support/Demand Ratio
        </p>
        <divider />
        <div 
          v-if = "!drawing" 
          class="col s6">
          <div id = "support-demand-pie"/>
        </div>
        <div 
          v-if = "!drawing" 
          class="col s6">
          <div id = "support-demand-radar"/>
        </div>
        <div 
          v-if = "!drawing" 
          class="col s12">
          <div id = "support-demand-line"/>
        </div>
      </div>
      <div
        v-if = "stock && stock.stock && !stock.stock.length && !isLoading && !hasError"
        class = "coc-text-title center">
        <span class="tcsc-oil-icon"/>
        No Stock Available
        <div class="row">
          <coc-button
            size = "large"
            icon = " tcsc-car-battery-1-icon coc-text-md-2"
            @clicked = "addStock">Add New</coc-button>
        </div>
      </div>  
      <div
        v-coc-loading = "true"
        v-if = "isLoading && !hasError"
        style = "height: 40vh"
        class = "row" />
      <div
        v-if = "hasError"
        class = "coc-text-title center coc-error-text">
        <icon type="ios-alert-outline"/>
        Whoops!<br>
        <small class = "coc-text-xs">Something Went Wrong!<br>Try to refresh</small>
        <div class="row">
          <coc-button
            size = "large"
            type = "error"
            icon = "ios-refresh"
            ghost
            @clicked = "getStock">Refresh</coc-button>
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
import brands from '~/plugins/brands'
import Master from '~/components/common/master'
const htmlColors = [
  'AliceBlue',
  'AntiqueWhite',
  'Aqua',
  'Aquamarine',
  'Azure',
  'Beige',
  'Bisque',
  'Black',
  'BlanchedAlmond',
  'Blue',
  'BlueViolet',
  'Brown',
  'BurlyWood',
  'CadetBlue',
  'Chartreuse',
  'Chocolate',
  'Coral',
  'CornflowerBlue',
  'Cornsilk',
  'Crimson',
  'Cyan',
  'DarkBlue',
  'DarkCyan',
  'DarkGoldenRod',
  'DarkGray',
  'DarkGrey',
  'DarkGreen',
  'DarkKhaki',
  'DarkMagenta',
  'DarkOliveGreen',
  'DarkOrange',
  'DarkOrchid',
  'DarkRed',
  'DarkSalmon',
  'DarkSeaGreen',
  'DarkSlateBlue',
  'DarkSlateGray',
  'DarkSlateGrey',
  'DarkTurquoise',
  'DarkViolet',
  'DeepPink',
  'DeepSkyBlue',
  'DimGray',
  'DimGrey',
  'DodgerBlue',
  'FireBrick',
  'FloralWhite',
  'ForestGreen',
  'Fuchsia',
  'Gainsboro',
  'GhostWhite',
  'Gold',
  'GoldenRod',
  'Gray',
  'Grey',
  'Green',
  'GreenYellow',
  'HoneyDew',
  'HotPink',
  'IndianRed',
  'Indigo',
  'Ivory',
  'Khaki',
  'Lavender',
  'LavenderBlush',
  'LawnGreen',
  'LemonChiffon',
  'LightBlue',
  'LightCoral',
  'LightCyan',
  'LightGoldenRodYellow',
  'LightGray',
  'LightGrey',
  'LightGreen',
  'LightPink',
  'LightSalmon',
  'LightSeaGreen',
  'LightSkyBlue',
  'LightSlateGray',
  'LightSlateGrey',
  'LightSteelBlue',
  'LightYellow',
  'Lime',
  'LimeGreen',
  'Linen',
  'Magenta',
  'Maroon',
  'MediumAquaMarine',
  'MediumBlue',
  'MediumOrchid',
  'MediumPurple',
  'MediumSeaGreen',
  'MediumSlateBlue',
  'MediumSpringGreen',
  'MediumTurquoise',
  'MediumVioletRed',
  'MidnightBlue',
  'MintCream',
  'MistyRose',
  'Moccasin',
  'NavajoWhite',
  'Navy',
  'OldLace',
  'Olive',
  'OliveDrab',
  'Orange',
  'OrangeRed',
  'Orchid',
  'PaleGoldenRod',
  'PaleGreen',
  'PaleTurquoise',
  'PaleVioletRed',
  'PapayaWhip',
  'PeachPuff',
  'Peru',
  'Pink',
  'Plum',
  'PowderBlue',
  'Purple',
  'RebeccaPurple',
  'Red',
  'RosyBrown',
  'RoyalBlue',
  'SaddleBrown',
  'Salmon',
  'SandyBrown',
  'SeaGreen',
  'SeaShell',
  'Sienna',
  'Silver',
  'SkyBlue',
  'SlateBlue',
  'SlateGray',
  'SlateGrey',
  'Snow',
  'SpringGreen',
  'SteelBlue',
  'Tan',
  'Teal',
  'Thistle',
  'Tomato',
  'Turquoise',
  'Violet',
  'Wheat',
  'White',
  'WhiteSmoke',
  'Yellow',
  'YellowGreen'
]
export default {
  name: 'JobAnalyticsJobs',
  components: {
    Master
  },
  head() {
    return {
      title: this.$store.state.core.app
        ? `${this.$store.state.core.app.title} | Stock Analytics`
        : 'Stock Analytics'
    }
  },
  data() {
    return {
      brands,
      apx: null,
      timePresentation: {
        days: 'radar',
        months: 'radar',
        years: 'radar'
      },
      drawing: false,
      onRender: false,
      isMounted: false,
      isLoading: true,
      hasError: false,
      moveCount: 1,
      htmlColors,
      stock: { stock: [] },
      columns: [
        {
          title: 'Part',
          key: 'name'
        },
        {
          title: 'Category',
          key: 'category'
        },
        {
          title: 'Price',
          key: 'price'
        },
        {
          title: 'Count',
          key: 'count'
        },
        {
          title: 'Car Compitiblity',
          key: 'car_compatibility'
        },
        {
          title: 'Vendor',
          key: 'vendor'
        },
        {
          title: 'Actions'
        }
      ],
      config: {
        drawer: false,
        price: {
          step: 100,
          max: 7000
        }
      },
      pagination: { page: 1, limit: 4 },
      formattedQuery: {},
      input: {
        name: '',
        ignore_external: true,
        category: [],
        status: null,
        date: null,
        price: [0, 6900],
        phone: '',
        products: [],
        sort: 'created_at',
        desc: 'yes',
        page: 0,
        limit: 8
      }
    }
  },
  computed: {
    user() {
      return this.$store.state.core.auth
    }
  },
  mounted() {
    setTimeout(() => {
      this.isMounted = true
      if (process.client) {
        this.apx = require('apexcharts')
        this.formatQuery(this.$route.query)
      }
    }, 1000)
    this.$root.$on('addStockSuccess', this.formatQuery)
  },
  methods: {
    addStock() {
      this.$root.$emit('addStock')
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
          text: args.title || 'Stock Chart',
          align: 'left'
        },
        subtitle: {
          text: args.subtitle || '',
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

      const stockNames = this.stock.stock.map(s => s.name)
      const stockCounts = this.stock.stock.map(s =>
        this.$_.sumBy(
          this.stock.stock.filter(f => f.name === s.name),
          su => su.count
        )
      )
      const stockMargins = this.stock.stock.map(s =>
        this.$_.sumBy(
          this.stock.stock.filter(f => f.name === s.name),
          su => su.price - su.import_price
        )
      )

      const stockDemands = this.stock.stock.map(s =>
        this.$_.sumBy(
          this.stock.stock.filter(f => f.name === s.name),
          su => su.exports
        )
      )

      const stockSupport = this.stock.stock.map(s =>
        this.$_.sumBy(
          this.stock.stock.filter(f => f.name === s.name),
          su => su.imports
        )
      )

      const stockSupportDemand = this.stock.stock.map(s =>
        this.$_.sumBy(
          this.stock.stock.filter(f => f.name === s.name),
          su => su.imports / su.exports
        )
      )

      setTimeout(() => {
        this.drawing = true
        this.onRender = false

        this.createPricesChart({
          id: '#stock-pie',
          labels: stockNames,
          type: 'pie',
          series: stockCounts
        })
        this.createPricesChart({
          id: '#stock-radar',
          labels: stockNames,
          series: [
            {
              name: 'Stock Count',
              data: stockCounts
            }
          ]
        })

        this.createPricesChart({
          id: '#margin-pie',
          labels: stockNames,
          type: 'pie',
          series: stockMargins
        })
        this.createPricesChart({
          id: '#margin-radar',
          labels: stockNames,
          series: [
            {
              name: 'Price Margin',
              data: stockMargins
            }
          ]
        })
        this.createPricesChart({
          id: '#margin-line',
          labels: stockNames,
          type: 'line',
          series: [
            {
              name: 'Price Margin',
              data: stockMargins
            }
          ]
        })

        this.createPricesChart({
          id: '#demand-pie',
          labels: stockNames,
          type: 'pie',
          series: stockDemands
        })
        this.createPricesChart({
          id: '#demand-radar',
          labels: stockNames,
          series: [
            {
              name: 'Price Margin',
              data: stockDemands
            }
          ]
        })
        this.createPricesChart({
          id: '#demand-line',
          labels: stockNames,
          type: 'line',
          series: [
            {
              name: 'Price Margin',
              data: stockDemands
            }
          ]
        })

        this.createPricesChart({
          id: '#support-pie',
          labels: stockNames,
          type: 'pie',
          series: stockSupport
        })
        this.createPricesChart({
          id: '#support-radar',
          labels: stockNames,
          series: [
            {
              name: 'Price Margin',
              data: stockSupport
            }
          ]
        })
        this.createPricesChart({
          id: '#support-line',
          labels: stockNames,
          type: 'line',
          series: [
            {
              name: 'Price Margin',
              data: stockSupport
            }
          ]
        })

        this.createPricesChart({
          id: '#support-demand-pie',
          labels: stockNames,
          type: 'pie',
          series: stockSupportDemand
        })
        this.createPricesChart({
          id: '#support-demand-radar',
          labels: stockNames,
          series: [
            {
              name: 'Price Margin',
              data: stockSupportDemand
            }
          ]
        })
        this.createPricesChart({
          id: '#support-demand-line',
          labels: stockNames,
          type: 'line',
          series: [
            {
              name: 'Price Margin',
              data: stockSupportDemand
            }
          ]
        })

        this.drawing = false
        setTimeout(() => {
          if (this.$route.query.scroll) {
            setTimeout(() => {
              const eTarget = document.getElementById(this.$route.query.scroll)
              if (eTarget) {
                eTarget.scrollIntoView()
              }
              this.onRender = false
              this.drawing = false
            }, 500)
          }
        }, 1000)
      }, 500)
    },
    askForLogin() {
      this.$root.$emit('askForLogin')
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
    getStock() {
      this.isLoading = true
      this.$router.push({
        path: '/analytics/stock',
        query: { ...this.formattedQuery }
      })
      this.$axios({
        method: 'get',
        url: '/stock',
        params: { ...this.formattedQuery, stats: 'yes' }
      })
        .then(res => {
          this.stock = res.data
          this.config.drawer = false
          this.isLoading = false
          this.hasError = false
          this.drawing = false
          this.renderAllCharts()
        })
        .catch(() => {
          this.isLoading = false
          this.hasError = true
        })
    },
    decodedQuery(query) {
      const final = this.$_.cloneDeep(query)
      if (final.external !== undefined) {
        final.external = final.external === 'yes'
      }
      if (final.ignore_external !== undefined) {
        final.ignore_external = final.ignore_external === 'yes'
      }
      if (final.page !== undefined) {
        final.page = parseInt(final.page, 10) + 1
      }
      // if (final.date) {
      //   final.date = final.date.split(',')
      // }
      if (final.brand) {
        final.brand = final.brand.split(',')
      }
      if (final.model) {
        final.model = final.model.split(',')
      }
      if (final.release) {
        final.release = final.release.split(',')
      }
      if (final.price) {
        final.price = final.price.split(',')
      }
      // console.log(final)
      // window.dq = this.decodedQuery
      // window.qq = query
      // window.res = final
      return final
    },
    encodedQuery(input = this.input) {
      const final = this.$_.cloneDeep(input)
      if (final.external !== undefined) {
        final.external = final.external ? 'yes' : 'no'
      }
      if (final.ignore_external !== undefined) {
        final.ignore_external = final.ignore_external ? 'yes' : 'no'
      }
      if (final.page !== undefined) {
        final.page = parseInt(final.page, 10)
        if (final.page > 0) final.page = final.page - 1
      }
      if (final.date && final.date.join) {
        final.date = final.date.join(',')
      } else {
        final.date = null
      }
      if (final.category && final.category.join) {
        final.category = final.category.join(',')
      } else {
        final.category = null
      }
      if (final.brand && final.brand.join) {
        final.brand = final.brand.join(',')
      } else {
        final.brand = null
      }
      if (final.model && final.model.join) {
        final.model = final.model.join(',')
      } else {
        final.model = null
      }
      if (final.release && final.release.join) {
        final.release = final.release.join(',')
      } else {
        final.release = null
      }
      if (final.price && final.price.join) {
        final.price = final.price.join(',')
      } else {
        final.price = null
      }
      return final
    },
    formatQuery(input = this.input) {
      this.formattedQuery = this.encodedQuery(input)
      this.getStock()
    },
    importStock(stock, factor = 1) {
      // some code
      this.isLoading = true
      this.$axios({
        method: 'post',
        url: `/stock/${stock._id}/move`,
        data: {
          item: stock,
          count: this.moveCount * factor
        }
      })
        .then(() => {
          this.formatQuery()
          this.isLoading = false
          this.$Message.success('Done')
        })
        .catch(() => {
          this.isLoading = false
          this.$Message.error('Stock Not Found')
        })
    },
    editStock(stock) {
      this.$root.$emit('addStock', {
        mode: 'put',
        init: stock
      })
    },
    changePage(e) {
      this.pagination.page = e
    }
  }
}
</script>

<style lang="css" scoped>
.alpha-textarea{
  color: white;
}
</style>
