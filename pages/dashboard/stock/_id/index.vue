<template>
  <master :crumbs = "stock ? [ 'Stock', stock.name] : null">
    <div v-if = "user">
      <Card v-if = "stock">
        <cell-group>
          <cell>
            <span class="coc-text-bold">Name</span>
            <span slot = "extra">{{ stock.name | CocCapitalizeName }}</span>
          </cell>
          <cell>
            <span class="coc-text-bold">Category</span>
            <span slot = "extra">{{ stock.category | CocCapitalizeName }}</span>
          </cell>
          <cell>
            <span class="coc-text-bold">Import Price</span>
            <span slot = "extra">{{ stock.import_price }} LE</span>
          </cell>
          <cell>
            <span class="coc-text-bold">Export Price</span>
            <span slot = "extra">{{ stock.price }} LE</span>
          </cell>
          <cell>
            <span class="coc-text-bold">Count</span>
            <span slot = "extra">{{ stock.count }}</span>
          </cell>
          <cell>
            <span class="coc-text-bold">Exported Times</span>
            <span slot = "extra">{{ stock.exports }}</span>
          </cell>
          <cell>
            <span class="coc-text-bold">Imported Times</span>
            <span slot = "extra">{{ stock.imports }}</span>
          </cell>
        </cell-group>
        <div class = "row  coc-border-hover-bg">
          <div class="col s12 right ">
            <span class="coc-text-bold">Vendor</span>
            <p
              v-if = "stock.vendor"
              class = "coc-padding-left-5px right">
              <Icon type = "ios-person right coc-margin-x-5px coc-margin-top-5px" /> <span class = "right">{{ stock.vendor.name | CocCapitalizeName }}</span> <br>
              <a :href="`tel:${stock.vendor.phone}`"><Icon type = "ios-call right coc-margin-x-5px coc-margin-top-5px" /> <span class="right">{{ stock.vendor.phone }}</span></a> <br>
              <Icon type = "ios-navigate right coc-margin-x-5px coc-margin-top-5px" /> <span class="right">{{ stock.vendor.address | CocCapitalizeName }}</span><br>
            </p>
            <i v-else><small>NONE</small></i>
          </div>
        </div>
        <div class = "row coc-margin-right-0px coc-padding-right-0px">
          <div class="col s12 right coc-margin-right-0px coc-padding-right-0px">
            <span class="coc-text-bold">Car Compitibility ({{ stock.car_compatibility.length }})</span>
            <div class="col s12 right coc-margin-right-0px coc-padding-right-0px">
              <CellGroup slot = "content">
                <Cell 
                  v-for = "(car, c) in stock.car_compatibility" 
                  :key = "c" 
                  :label="car.model" 
                  :extra = "car.release"
                  class = "animated slideInLeft">
                  <div class = "row coc-house-keeper">
                    <coc-avatar
                      :source = "`/snaps/brands/png/${car.brand.split(' ').join('-').toLowerCase()}.png`"
                      scale = "25px"
                      class = "col coc-padding-x-2px"/>
                    <span class="col coc-margin-x-0px">
                      {{ car.brand | CocCapitalizeName }}
                    </span>
                  </div>
                </Cell>
              </CellGroup>
            </div>
          </div>
        </div>
      </Card>
    </div>
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
  </master>
</template>

<script>
import Master from '~/components/common/master'

export default {
  name: 'ImportStock',
  components: {
    Master
  },
  data() {
    return {
      stock: null,
      fetchError: null
    }
  },
  computed: {
    user() {
      return this.$store.state.core.auth
    }
  },
  mounted() {
    if (!this.$route.params.id) {
      this.$router.push('/')
    } else this.getStock()
  },
  methods: {
    getStock() {
      this.$axios
        .get(`/stock/${this.$route.params.id}`)
        .then(res => {
          this.fetchError = null
          this.stock = res.data
          document.title = `Techno-Service | Stock ${res.data.name}`
          if (this.$route.query.scroll) {
            setTimeout(() => {
              const eTarget = document.getElementById(this.$route.query.scroll)
              if (eTarget) {
                eTarget.scrollIntoView()
                this.$router.push(`/stock/${this.$route.params.id}`)
              }
            }, 1000)
          }
        })
        .catch(err => {
          this.fetchError = err
          this.stock = null
        })
    }
  }
}
</script>

<style lang="css" scoped>
</style>
