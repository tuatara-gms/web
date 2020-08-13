<template>
  <master>
    <card title = "Add To Stock">
      <divider orientation = "left">Item</divider>
      <div class="row">
        <div class="col s12 l4 m6">
          <coc-input
            v-model = "input.name"
            :scope = "['add-stock']"
            :rules = "{ HasValue: true }" 
            light-model
            placeholder = "Item Name.." />        	
        </div>
        <div class="col s12 l4 m6">
          <coc-input
            v-model = "input.category"
            :scope = "['add-stock']"
            :rules = "{ HasValue: true }"
            light-model
            placeholder = "Item Category.." />        	
        </div>
        <div class="col s12 l4 m6">
          <coc-input
            :scope = "['add-stock']"  
            :rules = "{
              HasValue: true,
              IsNumericString: true
            }"
            placeholder = "Item Price.." 
            filters = "ToInt" 
            @filter = "input.price = $event"/>        	
        </div>
        <div class="col s12 l4 m6 coc-margin-top-10px right">
          <i-switch 
            v-model = "input.external" 
            light-model
            class = "right coc-margin-top-10px"/>   
          <span class="coc-padding-x-5px right">
            <span>External Resources</span><br>
            <small class="right">(salaries, taxs, etc..)</small>
          </span>
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
            :scope = "input.external ? [] : ['add-stock']"
            :rules = "{ HasValue: true }" 
            light-model
            placeholder = "Provider Name.." />        	
        </div>
        <div class="col s12 l4 m6">
          <coc-input
            v-model = "input.vendor.phone"
            :scope = "input.external ? [] : ['add-stock']"
            :rules = "{ HasValue: true }"  
            light-model
            placeholder = "Provider Phone.." />        	
        </div>
        <div class="col s12 l4 m6">
          <coc-input
            v-model = "input.vendor.address"
            :scope = "input.external ? [] : ['add-stock']"
            :rules = "{ HasValue: true }" 
            light-model
            placeholder = "Provider Address.." />        	
        </div>
      </div>
      <divider orientation = "left">Extra Info</divider>
      <div class="row">
        <div class="col s12 l4 m6">
          <coc-input
            v-coc-loading.ivu-icon.ivu-icon-ios-checkmark-circle.coc-success-text.text-md-2 = "input.external"
            :scope = "input.external ? [] : ['add-stock']" 
            :rules = "{
              HasValue: true,
              IsNumericString: true
            }"
            coc-loader-text = "No Points"  
            coc-loader-classes = "coc-success-text coc-text-md-2 block"
            placeholder = "Points.."
            filters = "ToInt" 
            @filter = "input.points = $event" />         
        </div>
        <div class="col s12 l4 m6">
          <coc-input
            v-coc-loading.ivu-icon.ivu-icon-ios-checkmark-circle.coc-success-text.text-md-2 = "input.external"
            :scope = "input.external ? [] : ['add-stock']" 
            :rules = "{
              HasValue: true,
              IsNumericString: true
            }"
            coc-loader-text = "No Count"  
            coc-loader-classes = "coc-success-text coc-text-md-2 block"
            placeholder = "Points.."
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
              <label class="coc-subcolor-text coc-text-small">Car Brand</label>
              <coc-input
                v-model = "externalInput.car.brand"
                :scope = "['add-car']"
                :rules = "{ HasValue: true }"
                :data = "brands"
                :icon = "externalInput.car.brand && externalInput.car.brand.length ? null : 'ios-color-filter'"
                :style = "externalInput.car.brand && externalInput.car.brand.length ? 'width: calc( 100% - 40px )' : 'width: 100%'"
                placeholder = "Car Brand"
                class = "col"
                light-model
                allow-autocomplete />
              <coc-avatar
                v-if = "externalInput.car.brand && externalInput.car.brand.length"
                slot = "suffix"
                :source = "`/snaps/brands/png/${externalInput.car.brand.split(' ').join('-').toLowerCase()}.png`"
                scale = "30px"
                class = "col coc-margin-left-4px coc-margin-top-5px"/>
            </div>
            <div class="col l3 s12">
              <label class="coc-subcolor-text coc-text-small">Car Model</label>
              <coc-input
                v-model = "externalInput.car.model"
                :scope = "['add-car']"
                :rules = "{ HasValue: true }"
                placeholder = "Car Model"
                icon = "ios-car"
                light-model />
            </div>
            <div class="col l3 s12">
              <label class="coc-subcolor-text coc-text-small">Car Release Year</label>
              <coc-select
                v-model = "externalInput.car.release"
                :scope = "['add-car']"
                :rules = "{ HasValue: true }"
                :data = "generateYears()"
                placeholder = "Release Year"
                icon = "ios-calendar"
                filterable
                clearable
                light-model />
            </div>
            <div class="col s12 l2">
              <coc-button
                :scope = "['add-car']"
                type = "default"
                placeholder = "Add"
                icon = "ios-add-circle"
                class = "right coc-padding-y-20px"
                local
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
                      class = "col coc-padding-left-30px"/>
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
          :request = "{ url: '/stock', method: 'post', xdata: formatInput() }"
          placeholder = "Submit"
          class = "right" />
      </div>
    </card>
  </master>
</template>

<script>
import Master from '~/components/common/master'
import brands from '~/plugins/brands'
export default {
  name: 'AddStockIndex',
  components: {
    Master
  },
  data() {
    return {
      brands,
      externalInput: {
        car: {
          brand: '',
          model: '',
          release: ''
        }
      },
      cars: [],
      input: {
        name: '',
        category: '',
        points: 0,
        external: false,
        price: 0,
        count: 0,
        vendor: {
          name: '',
          phone: '',
          address: ''
        }
      }
    }
  },
  methods: {
    handleFilter(e) {
      console.log(typeof e)
    },
    formatInput() {
      const result = this.$_.cloneDeep(this.input)
      if (this.input.external) {
        result.vendor = null
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
      console.log(e)
    }
  }
}
</script>

<style lang="css" scoped>
</style>
