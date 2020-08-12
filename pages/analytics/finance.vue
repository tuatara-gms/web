<template>
  <master v-coc-loading = "isLoading">
    <div v-if = "user && $store.state.core.app && user.roles.indexOf('admin') !== -1">
      <div class="row">
        <p class="coc-text-bold coc-text-md-2 coc-padding-y-10px">Select Time Range</p>
        <div 
          class="col" 
          style="width: calc( 100% - 100px )">
          <DatePicker 
            v-model = "input.date"
            :start-date="$moment().toDate()" 
            size = "large"
            type="daterange" 
            placement="bottom-end" 
            placeholder="Select date" 
            style="width: 100%"/>
        </div>
        <div 
          class="col coc-padding-x-0" 
          style="width: 100px">
          <i-button
            :loading = "isLoading"
            size = "large"
            type = "primary"
            icon = " knocks-merge2"
            class = "coc-text-bold"
            long
            @click = "getData">Pull</i-button>
        </div>
      </div>
      <div class="row">
        <div class="col l3 s12 coc-error-text center coc-text-lg-1 coc-text-bold">
          <div class="col s12 coc-border-1 coc-standard-border-radius coc-padding-y-10px">
            <icon type = "md-arrow-round-up" />
            Outgoing<br>
            {{ stockImports }} {{ $store.state.core.app.currency }}
          </div>
        </div>
        <div class="col l3 s12 coc-success-shade-3-text center coc-text-lg-1 coc-text-bold">
          <div class="col s12 coc-border-1 coc-standard-border-radius coc-padding-y-10px">
            <icon type = "md-arrow-round-down" />
            Incoming<br>
            {{ stockExports + labors }} {{ $store.state.core.app.currency }}
          </div>
        </div>
        <div
          :class = "[
            {'coc-success-text': profitPercentage > 30},
            {'coc-error-text': profitPercentage <= 30}
          ]"
          class="col l3 s12 center coc-text-lg-1 coc-text-bold">
          <div class="col s12 coc-border-1 coc-standard-border-radius coc-padding-y-10px">
            <icon type = " knocks-moneybag" />
            Profit<br>
            {{ totalProfit }} {{ $store.state.core.app.currency }}
          </div>
        </div>
        <div
          :class = "[
            {'coc-success-text': profitPercentage > 30},
            {'coc-error-text': profitPercentage <= 30}
          ]"
          class="col l3 s12 center coc-text-lg-1 coc-text-bold">
          <div class="col s12 coc-border-1 coc-standard-border-radius coc-padding-10px">
            <icon type = " knocks-percent" />
            Percentage<br>
            {{ profitPercentage | CocToFixedTwo }}%
          </div>
        </div>
      </div>
      <div class="row coc-primary-background-bg coc-standard-border-radius coc-padding-y-10px">
        <div class="">
          <div class = "coc-primary-background-bg coc-primary-background-hover-shade-1-bg finance-menu-item">
            <div class = "row coc-text-bold coc-text-lg">
              <div class="col coc-margin-top-15px">
                <span class = "tcsc-car-5-icon coc-text-lg-1" />
              </div>
              <div class="col">
                Spare Parts Overhead
                <br><small>Total cost you spent for resailable spare parts.</small>
              </div>
              <div class = "right col coc-padding-top-10px"> {{ stockImports - externals }} {{ $store.state.core.app.currency }}</div>
            </div>
          </div>
          <div class = "coc-primary-background-bg coc-primary-background-hover-shade-1-bg finance-menu-item">
            <div class = "row coc-text-bold coc-text-lg">
              <div class="col coc-margin-top-15px">
                <span class = "knocksapp-divide coc-text-lg-1" />
              </div>
              <div class="col">
                VAT
                <br><small>Total VAT calculated all over the jobs.</small>
              </div>
              <div class = "right col coc-padding-top-10px"> {{ vat | CocToFixedTwo }} {{ $store.state.core.app.currency }}</div>
            </div>
          </div>
          <div class = "coc-primary-background-bg coc-primary-background-hover-shade-1-bg finance-menu-item">
            <div class = "row coc-text-bold coc-text-lg">
              <div class="col coc-margin-top-15px">
                <span class = "tcsc-car-7-icon coc-text-lg-1" />
              </div>
              <div class="col">
                Utilities & External Overhead
                <br><small>VAT, Promotions, Taxes, salaries and other operational costs.</small>
                <div
                  style = "margin-left: -2% !important"
                  class="row coc-house-keeper">
                  <div class="col s12 coc-text-sm-1">
                    <div class = "col coc-info-section-outline coc-info-section-hover-dark coc-border-1 coc-tiny-border-radius">
                      Promotions | {{ promotionsOverhead | CocToFixedTwo }} {{ $store.state.core.app.currency }}
                    </div>
                    <div class = "col coc-warning-section-outline coc-warning-section-hover-dark coc-border-1 coc-tiny-border-radius coc-margin-x-4px">
                      Operation | {{ stockExternals - promotionsOverhead | CocToFixedTwo }} {{ $store.state.core.app.currency }}
                    </div>
                  </div>
                </div>
              </div>
              <div class = "right col coc-padding-top-10px">
                <span class = "right">{{ externals | CocToFixedTwo }} {{ $store.state.core.app.currency }}</span><br>
              </div>
            </div>
          </div>
          <div class = "coc-primary-background-bg coc-primary-background-hover-shade-1-bg finance-menu-item">
            <div class = "row coc-text-bold coc-text-lg coc-error-shade-2-text">
              <div class="col coc-margin-top-15px">
                <span class = "tcsc-car-check-icon coc-text-lg-1" />
              </div>
              <div class="col">
                Total Overhead
                <br>
                <small>
                  All the spent money during this period <small style="font-weight: 200 !important">(Spare Parts, Taxes, Salaries, ...etc)</small>
                </small>
              </div>
              <div class = "right col coc-padding-top-10px"> {{ stockImports }} {{ $store.state.core.app.currency }}</div>
            </div>
          </div>
          <div class = "coc-primary-background-bg coc-primary-background-hover-shade-1-bg finance-menu-item">
            <div class = "row coc-text-bold coc-text-lg">
              <div class="col coc-margin-top-15px">
                <span class = "tcsc-car-sales-icon coc-text-lg-1" />
              </div>
              <div class="col">
                Stock Sales
                <br>
                <small>Total revenue for stock.</small>
              </div>
              <div class = "right col coc-padding-top-10px"> {{ stockExports }} {{ $store.state.core.app.currency }}</div>
            </div>
          </div>
          <div class = "coc-primary-background-bg coc-primary-background-hover-shade-1-bg finance-menu-item">
            <div class = "row coc-text-bold coc-text-lg">
              <div class="col coc-margin-top-15px">
                <span class = "tcsc-fix-icon coc-text-lg-1" />
              </div>
              <div class="col">
                Labors
                <br><small>All the labors for each operation.</small>
              </div>
              <div class = "right col coc-padding-top-10px"> {{ labors }} {{ $store.state.core.app.currency }}</div>
            </div>
          </div>
          <div class = "coc-primary-background-bg coc-primary-background-hover-shade-1-bg finance-menu-item">
            <div class = "row coc-text-bold coc-text-lg">
              <div class="col coc-margin-top-15px">
                <span class = "tcsc-truck-icon coc-text-lg-1" />
              </div>
              <div class="col">
                Out Sourced Parts
                <br><small>Spare Parts that were brought from outside your inventory.</small>
              </div>
              <div class = "right col coc-padding-top-10px"> {{ outSourcedParts }} {{ $store.state.core.app.currency }}</div>
            </div>
          </div>
          <div class = "coc-primary-background-bg coc-primary-background-hover-shade-1-bg finance-menu-item">
            <div class = "row coc-text-bold coc-text-lg">
              <div class="col coc-margin-top-15px">
                <span class = "tcsc-investing-icon coc-text-lg-1" />
              </div>
              <div class="col">
                Jobs Revenue
                <br><small>Total customers payments for jobs.</small>
              </div>
              <div class = "right col coc-padding-top-10px"> {{ jobsWithOutSourcedParts }} {{ $store.state.core.app.currency }}</div>
            </div>
          </div>
          <div class = "coc-primary-background-bg coc-primary-background-hover-shade-1-bg finance-menu-item">
            <div class = "row coc-text-bold coc-text-lg">
              <div class="col coc-margin-top-15px">
                <span class = "tcsc-business-and-finance-icon coc-text-lg-1" />
              </div>
              <div class="col">
                Locale Jobs Profits
                <br><small>Total customer payments for your locale parts and labors.</small>
              </div>
              <div class = "right col coc-padding-top-10px"> {{ jobsWithOutSourcedParts - outSourcedParts }} {{ $store.state.core.app.currency }}</div>
            </div>
          </div>
          <div class = "coc-primary-background-bg coc-primary-background-hover-shade-1-bg finance-menu-item">
            <div class = "row coc-text-bold coc-text-lg coc-success-text">
              <div class="col coc-margin-top-15px">
                <span class = "tcsc-cost-icon coc-text-lg-1" />
              </div>
              <div class="col">
                Total Profits
                <br><small>Stock revenue compined with labors.</small>
              </div>
              <div class = "right col coc-padding-top-10px"> {{ totalProfit }} {{ $store.state.core.app.currency }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <card v-else>
      <p class="center coc-text-super coc-error-text coc-text-bold"><icon type = "ios-alert-outline" /><br>UNAUTHORIZED</p>
    </card>
  </master>
</template>

<script>
import Master from '~/components/common/master.vue'
export default {
  name: 'AnalyticsFinance',
  components: {
    Master
  },
  head() {
    return {
      title: this.$store.state.core.app
        ? `${this.$store.state.core.app.title} | Financial Analytics`
        : 'Financial Analytics'
    }
  },
  data() {
    return {
      isLoading: false,
      hasError: false,
      stockImports: 0,
      stockExports: 0,
      externals: 0,
      stockExternals: 0,
      promotionsOverhead: 0,
      vat: 0,
      labors: 0,
      totalProfit: 0,
      profitPercentage: 0,
      outSourcedParts: 0,
      jobsWithOutSourcedParts: 0,
      stock: [],
      jobs: [],
      input: {
        ignore_external: 'yes',
        // category: [],
        // status: null,
        date: null
        // price: [0, 6900],
        // phone: '',
        // products: [],
        // sort: 'created_at',
        // desc: 'yes',
        // page: 0,
        // limit: 10
      }
    }
  },
  computed: {
    user() {
      return this.$store.state.core.auth
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.isLoading = true
      this.isLoading = false
      this.$axios({
        method: 'get',
        url: '/job',
        params: { ...this.encodedQuery() }
      })
        .then(jobsRes => {
          this.jobs = jobsRes.data.jobs
          this.$axios({
            method: 'get',
            url: '/move',
            params: { ...this.encodedQuery() }
          })
            .then(stockRes => {
              this.stock = stockRes.data.move
              this.isLoading = false
              this.hasError = false
              this.handleGetDataSuccess()
            })
            .catch(() => {
              this.isLoading = false
              this.hasError = true
            })
        })
        .catch(() => {
          this.isLoading = false
          this.hasError = true
        })
    },
    encodedQuery(dateLabel = 'created_at', input = this.input) {
      const final = this.$_.cloneDeep(input)
      // if (final.page > 0) {
      //   final.page = final.page - 1
      // }
      if (final.date && final.date.length && final.date.join) {
        final.date = final.date.join(',')
      } else {
        delete final.date
      }
      // if (final.category && final.category.join) {
      //   final.category = final.category.join(',')
      // } else {
      //   final.category = null
      // }
      // if (final.brand && final.brand.join) {
      //   final.brand = final.brand.join(',')
      // } else {
      //   final.brand = null
      // }
      // if (final.model && final.model.join) {
      //   final.model = final.model.join(',')
      // } else {
      //   final.model = null
      // }
      // if (final.release && final.release.join) {
      //   final.release = final.release.join(',')
      // } else {
      //   final.release = null
      // }
      // if (final.price && final.price.join) {
      //   final.price = final.price.join(',')
      // } else {
      //   final.price = null
      // }
      final.stats = 'yes'
      return final
    },
    handleGetDataSuccess() {
      this.stockImports = this.$_.sumBy(
        this.stock.filter(m => m.type === 'import'),
        s => s.price
      )
      this.stockExports = this.$_.sumBy(
        this.stock.filter(m => m.type === 'export'),
        s => s.price
      )
      this.promotionsOverhead = this.$_.sumBy(
        this.stock.filter(m => m.item.category === 'Automated Promotion'),
        s => s.price
      )
      this.vat = this.$_.sumBy(this.jobs, o => o.vat)
      this.stockExternals = this.$_.sumBy(
        this.stock.filter(s => s.item.external),
        x => x.price
      )
      this.externals = this.stockExternals + this.vat
      this.labors = this.$_.sumBy(
        this.$coc.CielChilds(this.jobs, j => j.operations),
        o => o.fees * o.count
      )
      this.outSourcedParts = this.$_.sumBy(
        this.$coc
          .CielChilds(this.jobs, j => j.operations)
          .filter(o => !o.makeMove),
        o => o.price
      )
      this.jobsWithOutSourcedParts = this.$_.sumBy(
        this.$coc.CielChilds(this.jobs, j => j.operations),
        o => o.price + o.fees
      )
      this.totalProfit = this.stockExports - this.stockImports + this.labors
      this.profitPercentage = (this.totalProfit / this.stockImports) * 100
    }
  }
}
</script>

<style lang="css" scoped>
.anltc-card {
	height: 200px;
}
.card-div{
  max-height: 130px;
  overflow-y: auto;
  border-top: 2px solid #fff;
}
.finance-menu-item {
  min-height: 90px;
}
</style>
