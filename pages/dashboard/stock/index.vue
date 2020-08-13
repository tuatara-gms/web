
<template>
  <master>
    <div v-if = "user && $utils.roles.hasRole('stocks',user)">
      <div class="row">
        <span class = "coc-text-bold coc-text-md-2">
          Stock
          <span v-if = "stock.stock && !isLoading && !hasError && stock.stock.length && isMounted">({{ stock.stock.length }})</span>
        </span>
        <coc-button
          icon = "ios-funnel-outline"
          class = "right"
          @clicked = "config.drawer = true"/>
        <coc-button
          icon = "ios-refresh"
          class = "right coc-margin-x-5px"
          @clicked = "formatQuery()"/>
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
                    :autocomplete-remote = "model => ({ method: 'get', url: '/stock', params: { part: model.val, limit: 5 } } )"
                    :autocomplete-map-response = "(res) => $_.uniqBy(res.stock.filter(s => !!s.name), j => j.name).map(j => j.name)"
                    labeled
                    icon = "ios-search"
                    placeholder = "Search by Part Name.."
                    class = "coc-house-keeper"
                    allow-autocomplete
                    clearable
                  />
                </div>
                <div class = "col s12 l6">
                  <coc-select
                    v-model = "input.category"
                    :autocomplete-remote = "model => ({ method: 'get', url: '/stock', params: { categoryac: model.meta.query, limit: 5 } } )"
                    :autocomplete-map-response = "(res) => $_.uniqBy(res.stock.filter(s => !!s.category), j => j.category).map(j => j.category)"
                    placeholder = "Category.."
                    labeled
                    filterable
                    
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
                    <Checkbox 
                      v-model = "input.external"
                      
                      class = "right coc-margin-top-10px"/>   
                    <span class="coc-padding-x-5px right">
                      <span>External Resources</span><br>
                      <small class="right">(salaries, taxs, etc..)</small>
                    </span>
                  </div>
                  <div class="coc-padding-x-20px">
                    <Checkbox 
                      v-model = "input.non_external" 
                      
                      class = "right coc-margin-top-10px"/>   
                    <span class="coc-padding-x-5px right">
                      <span>None External</span><br>
                      <small class="right">(Parts, Operations, etc..)</small>
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
                    :autocomplete-remote = "model => ({ method: 'get', url: '/stock', params: { phone: model.val, limit: 5 } } )"
                    :autocomplete-map-response = "(res) => $_.uniqBy(res.stock.filter(s => !!s.vendor), j => j.vendor.phone).map(j => j.vendor.phone)"
                    labeled
                    icon = "ios-search"
                    placeholder = "Search by Phone.."
                    class = "coc-house-keeper"
                    allow-autocomplete
                    clearable
                  />
                </div>
                <div class = "col s12 l6">
                  <coc-input
                    v-model = "input.name"
                    :autocomplete-remote = "model => ({ method: 'get', url: '/stock', params: { name: model.val, limit: 5 } } )"
                    :autocomplete-map-response = "(res) => $_.uniqBy(res.stock.filter(s => !!s.vendor), j => j.vendor.name).map(j => j.vendor.name)"
                    labeled
                    icon = "ios-search"
                    placeholder = "Search by vendor name.."
                    class = "coc-house-keeper"
                    allow-autocomplete
                    clearable
                  />
                </div>
              </div>
              <Divider 
                class = "coc-margin-y-0" 
                orientation = "left"><span class = "coc-text-bold coc-info-shade-4-text coc-text-sm">Car Compatibility</span> </Divider>
              <div class="row coc-house-keeper">
                <div class = "col s12 l6">
                  <coc-select
                    v-model = "input.brand"
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
                  />
                </div>
                <div class = "col s12 l6">
                  <coc-input
                    v-model = "input.modelac"
                    labeled
                    icon = "ios-search"
                    placeholder = "Search by car model.."
                    class = "coc-house-keeper"
                    clearable
                    filterable
                    multiple
                  />
                </div>
                <div class="col s12 l6">
                  <coc-select
                    v-model = "input.release"
                    :rules = "{ HasValue: true }"
                    :data = "generateYears()"
                    labeled
                    placeholder = "Release Year"
                    icon = "ios-calendar"
                    filterable
                    clearable
                    multiple
                  />
                </div>
              </div>
              <Divider 
                class = "coc-margin-y-0" 
                orientation = "left"><span class = "coc-text-bold coc-info-shade-4-text coc-text-sm">Sorting</span> </Divider>
              <div class="row">
                <div class = "col s12 l6">
                  <coc-select
                    v-model = "input.sort"
                    labeled
                    placeholder = "Sort By.."
                  >
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
                  type = "primary" 
                  icon = "ios-funnel-outline coc-text-lg"
                  long 
                  @clicked = "formatQuery()">
                  <span class="coc-text-lg">Filter</span>
                </coc-button>
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
        />
        <p class = "coc-text-md-2">Price Range Step</p>
        <coc-number-input 
          v-model = "config.price.step" 
          placeholder = "Price Range Step" 
          size = "large"
          style = "width: 100%"
        />
      </Drawer>
      <div 
        v-if = "isMounted && stock && stock.stock.length" 
        class="row coc-house-keeper">
        <Modal 
          v-model="deleteModal" 
          width="360">
          <p 
            slot="header" 
            style="color:#f60;text-align:center">
            <Icon type="ios-information-circle"/>
            <span>Delete confirmation</span>
          </p>
          <div style="text-align:center">
            <p v-if = "toBeTrashed">After this stock ({{ toBeTrashed.name }}) is deleted, it will be no longer available on stock.</p>
            <p>Will you delete it?</p>
          </div>
          <div slot="footer">
            <Button 
              :loading="trashLoading" 
              type="error" 
              size="large" 
              long 
              @click="excTrashStock(toBeTrashed)">Delete</Button>
          </div>
        </Modal>
        <table
          style = "max-width: 100%;overflow-x: scroll;min-width: 100%"
          class = " coc-full-width">
          <tr class = "coc-full-width">
            <th 
              v-for = "(col, c) in columns" 
              :key = "c"
              class = "coc-primary-bg coc-padding-y-10px coc-background-text coc-padding-x-5px"
              style = "min-width: 100%">
              {{ col.title }}
            </th>
          </tr>
          <tr 
            v-for = "(stock, s) in stock.stock" 
            :key = "s"
            class = "coc-border-border center coc-dark-background-hover-bg coc-full-width"
            style = "min-width: 100%">
            <td
              class="coc-border-bottom-1 coc-border-0 coc-border-border coc-padding-y-10px coc-padding-x-4px"
              style = "text-align: left">
              <nuxt-link
                :to = "`/stock/${stock._id}`">
                <Tooltip
                  v-if = "stock.quick_add"
                  content = "Added on the fly while editing a job">
                  <span class = "knocksapp-fly3 coc-padding-5px coc-content-bg coc-warning-text coc-circle-border-radius"/>
                </Tooltip>
                <Tooltip
                  v-else
                  content = "Healthy added from Add Stock Form">
                  <span class = "knocksapp-live3 coc-padding-5px coc-content-bg coc-success-text coc-circle-border-radius"/>
                </Tooltip>
                {{ stock.name }}
              </nuxt-link>
            </td>
            <td class="coc-border-bottom-1 coc-border-0 coc-border-border coc-padding-y-10px coc-padding-x-4px">{{ stock.category }}</td>
            <td class="coc-border-bottom-1 coc-border-0 coc-border-border coc-padding-y-10px coc-padding-x-4px">{{ stock.import_price }}</td>
            <td class="coc-border-bottom-1 coc-border-0 coc-border-border coc-padding-y-10px coc-padding-x-4px">{{ stock.price }}</td>
            <td class="coc-border-bottom-1 coc-border-0 coc-border-border coc-padding-y-10px coc-padding-x-4px">{{ stock.count }}</td>
            <td 
              class="coc-border-bottom-1 coc-border-0 coc-border-border coc-padding-y-10px coc-padding-x-4px" 
              style=" width: 170px;">
              <collapse
                v-if = "stock.car_compatibility && stock.car_compatibility.length"
                class = "coc-border-0 coc-background-bg"
                simple>
                <panel 
                  name = "cars" 
                  class = "coc-border-0 coc-background-bg">
                  ({{ stock.car_compatibility.length }}) Car/s
                  <cell-group
                    slot = "content"
                    class = "coc-background-bg">
                    <cell 
                      v-for = "(car, c) in stock.car_compatibility" 
                      :key = "c" 
                      :title = "car.brand"
                      :label="`${car.model} (${car.release})`"/>
                  </cell-group>
                </panel>
              </collapse>
              <i v-else><small>NONE</small></i>
            </td>
            <td
              :style = "`text-align: ${ stock.vendor ? 'left' : 'center'} !important`"
              style=" width: 150px;"
              class="coc-border-bottom-1 coc-border-0 coc-border-border coc-padding-y-10px coc-padding-x-4px">
              <p
                v-if = "stock.vendor"
                class = "coc-padding-left-5px">
                <Icon type = "ios-person" /> {{ stock.vendor.name }} <br>
                <a :href="`tel:${stock.vendor.phone}`"><Icon type = "ios-call" /> {{ stock.vendor.phone }}</a> <br>
                <Icon type = "ios-navigate" /> {{ stock.vendor.address }} <br>
              </p>
              <i v-else ><small>NONE</small></i>
            </td>
            <td
              class="coc-border-bottom-1 coc-border-0 coc-border-border coc-padding-y-10px center coc-padding-x-7px">
              <Tooltip content = "Import (Buy)">
                <coc-button
                  icon = "md-arrow-down coc-error-text"
                  class = "coc-border-0"
                  @clicked = "importStock(stock, 1)" />
              </Tooltip>
              <Tooltip content = "Export (Sell)">
                <coc-button
                  :disabled = "stock.count - moveCount < 0"
                  icon = "md-arrow-up coc-success-text"
                  class = "coc-border-0"
                  @clicked = "importStock(stock, -1)" />
              </Tooltip>
              <Tooltip content = "Edit">
                <coc-button
                  icon = " knocks-pen-angled coc-warning-text"
                  class = "coc-border-0"
                  @clicked = "editStock(stock)" />
              </Tooltip>
              <Tooltip content = "Trash">
                <coc-button
                  icon = "ios-trash coc-error-text"
                  class = "coc-border-0"
                  @clicked = "trashStock(stock)" />
              </Tooltip>
              <div class="coc-full-width coc-margin-top-5px">
                <Tooltip content = "Count">
                  <coc-number-input
                    v-model = "moveCount"
                    :min = "1"
                    class = "left" />
                </Tooltip>
              </div>
            </td>
          </tr>
          <tr v-if = "stock.stock && stock.stock.length">
            <td />
            <td />
            <td class="center coc-text-bold">Total {{ $_.sumBy(stock.stock, o => o.price) }} LE</td>
            <td />
          </tr>
        </table>
        <div 
          v-if = "pagination && stock && stock.stock.length && input.page >= 0"
          style = " padding-top: 10px !important; margin-top: 5px; margin-bottom: 10px;" 
          class="col s12 ">
          <Page
            :total="pagination.pages"
            :page-size = "1"
            :current="pagination.page + 1"
            :styles = "{margin: 'auto', display: 'block', width: 'fit-content'}"
            @on-change = "changePage"/>
        </div>
      </div>
      <div
        v-if = "stock && stock.stock && !stock.stock.length && !isLoading && !hasError"
        class = "coc-text-title center">
        <span class="tcsc-oil-icon"/>
        No Stock Available
        <div class="row">
          <i-button
            size = "large"
            icon = " tcsc-car-battery-1-icon coc-text-md-2"
            @click = "addStock">Add New</i-button>
        </div>
      </div>  
      <div
        v-if = "isLoading && !hasError"
        style = "height: 40vh"
        class = "row" >
        <p v-coc-loading = "isLoading && !hasError">...</p>
      </div>
      <div
        v-if = "hasError"
        class = "coc-text-title center coc-error-text">
        <icon type="ios-alert-outline"/>
        Whoops!<br>
        <small class = "coc-text-xs">Something Went Wrong!<br>Try to refresh</small>
        <div class="row">
          <i-button
            size = "large"
            type = "error"
            icon = "ios-refresh"
            ghost
            @click = "getStock">Refresh</i-button>
        </div>
      </div>
    </div>
    <Card v-else-if = "!user">
      <p class = "coc-text-title coc-error-text center">
        <Icon type = "ios-alert-outline"/>
        You Are Not Logged In
      </p>
      <br>
      <p class="center">
        <button-group>
          <i-button
            type = "default"
            size = "large"
            shape = "circle"
            style = "width: 120px"
            @click = "askForLogin">
            Login
          </i-button>
        </button-group>
      </p>
    </Card>
    <Card v-else-if = "user && !$utils.roles.hasRole('stocks',user)">
      <p class = "coc-text-title green-text text-darken-3 center">
        <Icon type = " knocksapp-prick3"/>
        Looks like you're lost
      </p>
      <i-button
        to = "/"
        size = "large"
        long>Take Me Home</i-button>
    </Card>
  </master>
</template>

<script>
import brands from '~/plugins/brands'
import Master from '~/components/common/master'
export default {
  name: 'StockIndex',
  components: {
    Master
  },
  head() {
    return {
      title: this.$store.state.core.app
        ? `${this.$store.state.core.app.title} | Stock`
        : 'Stock'
    }
  },
  data() {
    return {
      brands,
      toBeTrashed: null,
      trashLoading: false,
      deleteModal: false,
      isMounted: false,
      isLoading: true,
      hasError: false,
      moveCount: 1,
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
          title: 'Import Price',
          key: 'importPrice'
        },
        {
          title: 'Export Price',
          key: 'exportPrice'
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
      pagination: null,
      formattedQuery: {},
      input: {
        non_external: true,
        external: true,
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
      this.isLoading = true
      this.isMounted = true
      this.formatQuery(this.$route.query)
    }, 1000)
    this.$root.$on('addStockSuccess', this.formatQuery)
  },
  methods: {
    addStock() {
      this.$root.$emit('addStock')
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
        path: '/stock',
        query: { ...this.formattedQuery }
      })
      this.$axios({
        method: 'get',
        url: '/stock',
        params: { ...this.formattedQuery }
      })
        .then(res => {
          this.stock = res.data
          this.config.drawer = false
          this.isLoading = false
          this.pagination = this.$_.omit(res.data, ['stock'])
          this.hasError = false
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
      if (final.non_external !== undefined) {
        final.non_external = final.non_external === 'yes'
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
      if (final.non_external !== undefined) {
        final.non_external = final.non_external ? 'yes' : 'no'
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
      Object.keys(input).forEach((k, i) => {
        if (this.input[i] !== undefined) this.input[i] = k
      })
      this.getStock()
    },
    importStock(stock, factor = 1) {
      if (this.moveCount === 0) {
        this.$Message.error('Count can not be zero.')
        return
      }
      // some code
      this.isLoading = true
      this.$axios({
        method: 'post',
        url: `/stock/${stock._id}/move`,
        data: {
          item: stock,
          count: this.moveCount * factor,
          type: this.moveCount > 0 ? 'import' : 'export'
        }
      })
        .then(() => {
          this.formatQuery()
          this.isLoading = false
          this.$Message.success('Done')
        })
        .catch(err => {
          this.isLoading = false
          this.$Message.error(err && err.data ? err.data : 'Stock Not Found')
        })
    },
    editStock(stock) {
      this.$root.$emit('addStock', {
        mode: 'put',
        init: stock
      })
    },
    changePage(e) {
      this.input.page = e
      this.formatQuery()
    },
    trashStock(stock) {
      this.toBeTrashed = stock
      this.deleteModal = true
    },
    rejectTrash() {
      this.toBeTrashed = null
      this.deleteModal = false
    },
    excTrashStock(stock) {
      this.trashLoading = false
      this.$axios({
        url: `/stock/${stock._id}`,
        data: {
          ...stock,
          trashed: true
        },
        method: 'put'
      })
        .then(() => {
          this.formatQuery()
          this.trashLoading = false
          this.deleteModal = false
          this.$Message.success('Deleted Successfully!')
        })
        .catch(() => {
          this.trashLoading = false
          this.$Message.error('Something Went Wrong')
        })
    }
  }
}
</script>

<style lang="css" scoped>
tr {
  width: 100%;
}
table {
  border-collapse: collapse;
  width: 100%;
}
th, td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}
</style>
