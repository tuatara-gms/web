f<template>
  <div>
    <div class="row">
      <div class="col s12 l4 m6 coc-margin-top-10px right">
        <i-switch 
          v-model = "input.external" 
          class = "right coc-margin-top-10px"/>   
        <span class="coc-padding-x-5px right">
          <span>External Resources</span><br>
          <small class="right">(salaries, taxs, etc..)</small>
        </span>
      </div>
    </div>
    <card      
      :class = "[
        { 'animated fadeIn': $utils.roles.hasRole('stocks',user) && !input.external }, 
        { 'hidden': !($utils.roles.hasRole('stocks',user) && !input.external) }
    ]">
      <p
        slot = "title"
        class = "coc-content-text">
        <span class="coc-content-text">
          Add Stock
        </span>
      </p>
      <divider orientation = "left">Item</divider>
      <div class="row">
        <div class="col s12 l4 m6">
          <coc-input
            v-model = "input.name"
            :scope = "['add-stock']"
            :rules = "{ HasValue: true }"
            labeled 
            placeholder = "Item Name" />          
        </div>
        <div class="col s12 l4 m6">
          <coc-input
            v-model = "input.category"
            :scope = "['add-stock']"
            :rules = "{ HasValue: true }"
            :autocomplete-remote = "model => ({ url: '/stock', method: 'get', params: { q: model.meta.query } })"
            :autocomplete-map-response = "res => $_.uniq(res.stock.map(i => i.category))"
            labeled
            allow-autocomplete
            placeholder = "Item Category" />          
        </div>
        <div class="col s12 l4 m6">
          <coc-input
            ref = "import_price"
            :scope = "['add-stock']"
            :rules = "{
              HasValue: true,
              IsNumericString: true,
              NumberGreaterThan: 0
            }"  
            labeled
            placeholder = "Import Price" 
            filters = "ToInt" 
            @filter = "input.import_price = $event"/>          
        </div>
        <div class="col s12 l4 m6">
          <coc-input
            ref = "price"
            :scope = "['add-stock']"
            :rules = "{
              HasValue: true,
              IsNumericString: true,
              NumberGreaterThanOrEqual: {
                args: input.import_price,
                message: 'Price should be at least like Import Price (|*args*|)'
              }
            }"  
            labeled
            placeholder = "Export Price" 
            filters = "ToInt" 
            @filter = "input.price = $event"/>          
        </div>
      </div>
      <divider orientation = "left">Provider</divider>
      <div
        v-coc-loading.ivu-icon.ivu-icon-ios-checkmark-circle.coc-success-text.text-super = "input.external"
        coc-loader-text = "No Provider"
        coc-loader-classes = "coc-success-text coc-text-lg-1 block"
        class="row">
        <div class="col s12 l4 m6">
          <coc-input
            v-model = "input.vendor.name"
            :scope = "['add-stock']"
            :hide-status = "input.external"
            :rules = "input.external ? {} : { HasValue: true }"
            :autocomplete-remote = "model => ({ url: '/stock', method: 'get', params: { q: model.meta.query } })"
            :autocomplete-map-response = "res => $_.uniq(res.stock.filter(v => v.vendor).map(i => i.vendor.name))"
            labeled 
            placeholder = "Provider Name"
            allow-autocomplete />          
        </div>
        <div class="col s12 l4 m6">
          <coc-input
            v-model = "input.vendor.phone"
            :scope = "['add-stock']"
            :hide-status = "input.external"
            :rules = "input.external ? {} : { HasValue: true }"
            :autocomplete-remote = "model => ({ url: '/stock', method: 'get', params: { q: model.meta.query } })"
            :autocomplete-map-response = "res => $_.uniq(res.stock.filter(v => v.vendor).map(i => i.vendor.phone))"
            labeled  
            placeholder = "Provider Phone"
            allow-autocomplete />         
        </div>
        <div class="col s12 l4 m6">
          <coc-input
            v-model = "input.vendor.address"
            :scope = "['add-stock']"
            :hide-status = "input.external"
            :rules = "input.external ? {} : { HasValue: true }"
            :autocomplete-remote = "model => ({ url: '/stock', method: 'get', params: { q: model.meta.query } })"
            :autocomplete-map-response = "res => $_.uniq(res.stock.filter(v => v.vendor).map(i => i.vendor.address))"
            labeled 
            placeholder = "Provider Address"
            allow-autocomplete />         
        </div>
      </div>
      <divider orientation = "left">Extra Info</divider>
      <div class="row">
        <div class="col s12 l4 m6">
          <coc-input
            v-coc-loading.ivu-icon.ivu-icon-ios-checkmark-circle.coc-success-text.text-md-2 = "input.external"
            ref = "points"
            :scope = "['add-stock']"
            :hide-status = "input.external"
            :rules = "input.external ? {} : {
              HasValue: true,
              IsNumericString: true
            }" 
            labeled
            coc-loader-text = "No Points"  
            coc-loader-classes = "coc-success-text coc-text-md-2 block"
            placeholder = "Points"
            filters = "ToInt" 
            @filter = "input.points = $event" />         
        </div>
        <div class="col s12 l4 m6">
          <coc-input
            v-coc-loading.ivu-icon.ivu-icon-ios-checkmark-circle.coc-success-text.text-md-2 = "input.external"
            ref = "count"
            :scope = "['add-stock']"
            :hide-status = "input.external"
            :rules = "input.external ? {} : {
              HasValue: true,
              IsNumericString: true
            }" 
            labeled
            coc-loader-text = "No Count"  
            coc-loader-classes = "coc-success-text coc-text-md-2 block"
            placeholder = "Count"
            filters = "ToInt" 
            @filter = "input.count = $event"/>         
        </div>
      </div>
      <div 
        v-coc-loading.ivu-icon.ivu-icon-ios-checkmark-circle.coc-success-text.text-super = "input.external"
        class = "row"
        coc-loader-text = "No Compatible Cars"
        coc-loader-classes = "coc-success-text coc-text-lg-1 block">
        <Divider orientation = "left">Car Compatibility</Divider>
        <div class="full-width">
          <div class="col s12 coc-background-bg coc-margin-y-10px coc-padding-y-10px coc-border-border coc-border-1 coc-standard-border-radius">
            <p class = "coc-text-subtitle">Add a Car</p>
            <div class="col l4 s12">
              <coc-input
                v-if = "isMounted"
                v-model = "externalInput.car.brand"
                :scope = "['add-car']"
                :rules = "{ HasValue: true }"
                :data = "brands"
                :icon = "externalInput.car.brand && externalInput.car.brand.length ? null : 'ios-color-filter'"
                :style = "externalInput.car.brand && externalInput.car.brand.length ? 'width: calc( 100% - 40px )' : 'width: 100%'"
                labeled
                placeholder = "Car Brand"
                class = "col"
                allow-autocomplete />
              <coc-avatar
                v-if = "externalInput.car.brand && externalInput.car.brand.length"
                slot = "suffix"
                :source = "`/snaps/brands/png/${externalInput.car.brand.split(' ').join('-').toLowerCase()}.png`"
                scale = "30px"
                class = "col coc-margin-left-4px coc-margin-top-25px"/>
            </div>
            <div class="col l3 s12">
              <coc-input
                v-model = "externalInput.car.model"
                :scope = "['add-car']"
                :rules = "{ HasValue: true }"
                labeled
                placeholder = "Car Model"
                icon = "ios-car"
              />
            </div>
            <div class="col l3 s12">
              <coc-select
                v-model = "externalInput.car.release"
                :scope = "['add-car']"
                :rules = "{ HasValue: true }"
                :data = "generateYears()"
                labeled
                placeholder = "Release Year"
                icon = "ios-calendar"
                filterable
                clearable
              />
            </div>
            <div class="col s12 l2">
              <coc-button
                :scope = "['add-car']"
                type = "default"
                placeholder = "Add"
                icon = "ios-add-circle"
                class = "right coc-margin-y-20px"
                @coc-validation-passed = "handleAddPart" />
            </div>
            <div 
              v-if = "cars && cars.length" 
              class="col s12 animated slideInUp">
              <Divider 
                v-if = "cars.length" 
                orientation = "left">Compatible Cars ({{ cars.length }})</Divider>
              <table class = "full-width coc-border-1 coc-border-border coc-light-background-bg">
                <tr class = "coc-border-bg coc-content-text">
                  <th class="coc-padding-y-10px"/>
                  <th class="coc-padding-y-10px">Brand</th>
                  <th class="coc-padding-y-10px">Model</th>
                  <th class="coc-padding-y-10px">Release Year</th>
                  <th class="coc-padding-y-10px">Actions</th>
                </tr>
                <tr 
                  v-for = "(car, c) in cars" 
                  :key = "c"
                  class = "coc-primary-hover-bg coc-secondary-hover-text coc-smooth-bg-color full-width center coc-border-bottom-1 animated slideInLeft">
                  <td> 
                    <coc-avatar
                      slot = "suffix"
                      :source = "`/snaps/brands/png/${car.brand.split(' ').join('-').toLowerCase()}.png`"
                      scale = "30px"
                      class = "col coc-padding-left-30px coc-margin-top-25px"/>
                  </td>
                  <td> {{ car.brand | CocCapitalizeName }}</td>
                  <td> {{ car.model | CocCapitalizeName }}</td>
                  <td> {{ car.release | CocCapitalizeName }}</td>
                  <td>
                    <Button
                      icon = "ios-remove-circle-outline coc-error-text coc-text-lg"
                      class = "coc-margin-y-3px"
                      type = "text"
                      @click = "cars.splice(c, 1)"/>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <coc-button
          :scope = "['add-stock']"
          :request = "{ url: init && init._id && mode === 'put' ? `/stock/${init._id}` : '/stock', method: mode, xdata: formatInput() }"
          placeholder = "Submit"
          class = "right"
          @coc-submit-accepted = "handleAccept"/>
      </div>
    </card>
    <card
      :class = "[
        { 'animated fadeIn' :$utils.roles.hasRole('stocks',user) && input.external },
        { 'hidden' : !($utils.roles.hasRole('stocks',user) && input.external) }
    ]">
      <p
        slot = "title"
        class = "coc-content-text">
        <span class="coc-content-text">
          Add External Resources
        </span>
      </p>
      <div class="row">
        <div class="col s12 l4 m6">
          <coc-input
            v-model = "xinput.name"
            :scope = "['add-stock-external']"
            :rules = "{ HasValue: true }"
            labeled 
            placeholder = "Item Name" />          
        </div>
        <div class="col s12 l4 m6">
          <coc-input
            v-model = "xinput.category"
            :scope = "['add-stock-external']"
            :rules = "{ HasValue: true }"
            :autocomplete-remote = "model => ({ url: '/stock', method: 'get', params: { q: model.meta.query } })"
            :autocomplete-map-response = "res => $_.uniq(res.stock.map(i => i.category))"
            labeled
            placeholder = "Item Category"
            allow-autocomplete />          
        </div>
        <div class="col s12 l4 m6">
          <coc-input
            ref = "ex_import_price"
            :scope = "['add-stock-external']"
            :rules = "{
              HasValue: true,
              IsNumericString: true,
              NumberGreaterThan: 0
            }"  
            labeled
            placeholder = "Price" 
            filters = "ToInt" 
            @filter = "xinput.price = $event"/>          
        </div>
      </div>
      <div class="row">
        <coc-button
          :scope = "['add-stock-external']"
          :request = "{ url: init && init._id && mode === 'put' ? `/stock/${init._id}` : '/stock', method: mode, xdata: formatInput() }"
          placeholder = "Submit"
          class = "right"
          @coc-submit-accepted = "handleAccept"/>
      </div>
    </card>
  </div>
</template>
<script>
import brands from '~/plugins/brands'

const input = {
  name: '',
  category: '',
  points: 0,
  external: false,
  price: 0,
  count: 0,
  vendor: {
    name: '',
    phone: '',
    address: '',
    import_price: 0
  }
}
const xinput = {
  name: '',
  category: '',
  price: 0
}
export default {
  name: 'AddStock',
  props: {
    mode: {
      type: String,
      default: 'post'
    },
    init: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      filterBased: [
        'price',
        'count',
        'points',
        'import_price',
        'ex_import_price'
      ],
      isMounted: false,
      brands,
      externalInput: {
        car: {
          brand: '',
          model: '',
          release: ''
        }
      },
      cars: [],
      input,
      xinput
    }
  },
  computed: {
    user() {
      return this.$store.state.core.auth
    }
  },
  watch: {
    mode: {
      // immediate: true,
      handler(val) {
        setTimeout(() => {
          if (val === 'post') {
            this.input = input
            this.cars = []
          }
        }, 700)
      }
    },
    init: {
      deep: true,
      immediate: true,
      handler(val) {
        if (this.mode === 'put' && val) {
          // Clean First
          this.input.external = val.external
          if (!val.external) this.input = this.$_.cloneDeep(input)
          else this.xinput = this.$_.cloneDeep(xinput)
          setTimeout(() => {
            let temp = {}
            temp = this.$_.cloneDeep(val)
            if (!val.vendor) {
              temp.vendor = {
                name: '',
                phone: '',
                address: ''
              }
            }
            let i
            for (i = 0; i < this.filterBased.length; i += 1)
              if (this.$refs[this.filterBased[i]])
                this.$refs[this.filterBased[i]].update(
                  val[
                    this.filterBased[i].startsWith('ex_')
                      ? this.filterBased[i].split('ex_').join('')
                      : this.filterBased[i]
                  ] || '0'
                )
              else console.log(this.filterBased[i])
            this.cars = val.car_compatibility
            if (!temp.external) this.input = temp
            else this.xinput = temp
          }, 1000)
        } else {
          this.input = this.$_.cloneDeep(input)
          this.xinput = this.$_.cloneDeep(xinput)
        }
      }
    }
  },
  mounted() {
    setTimeout(() => {
      this.isMounted = true
    }, 1500)
  },
  methods: {
    handleFilter(e) {
      // console.log(typeof e)
    },
    formatInput() {
      const result = this.$_.cloneDeep(
        this.input.external ? this.xinput : this.input
      )
      if (this.input.external) {
        result.vendor = null
        result.import_price = result.price
        result.external = true
      } else {
        result.car_compatibility = this.cars
      }
      return result
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
    handleAddPart(e) {
      this.cars.push(this.$_.clone(this.externalInput.car))
      // console.log(e)
    },
    handleAccept(e) {
      this.$emit('success', e.meta.response)
    }
  }
}
</script>

<style lang="css" scoped>
</style>
