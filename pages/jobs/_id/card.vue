<template>
  <master
    v-if = "this.$store.state.core.app"
    :on-print = "onPrint">
    <div 
      v-coc-loading = "(!job && !fetchError)" 
      class="row"
      style="min-height: 40vh">
      <div 
        v-if = "job"
        :class = "[ { 'coc-house-keeper': onPrint } ]"
        class = "row">
        <coc-avatar
          v-if = "job.car.brand && job.car.brand.length"
          :source = "`/snaps/brands/png/${job.car.brand.split(' ').join('-').toLowerCase()}.png`"
          :scale = "onPrint ? '30px' : '100px'"
          class = "col coc-margin-left-4px coc-margin-top-5px"/>
        <span 
          :class = "onPrint ? 'coc-text-md' : 'coc-text-title'"
          :style="onPrint ? 'margin-top: 10px; font-weight: bold' : 'margin-top: 20px'" 
          class="col coc-margin-x-0px">
          {{ `${ job.car.brand } / ${ job.car.model }` | CocCapitalizeName }}
          <span v-if = "job && onPrint">(Job Card #{{ job.job_no }})</span>
        </span>
        <br>
        <button-group
          v-if = "!onPrint"
          class = "right">
          <coc-button
            :size = "onPrint ? 'small' : 'large'"
            :to = "`/jobs/${job.job_no}/quotation`">
            <tooltip content = "Job Quotation">
              <icon type = "ios-list" />
            </tooltip>
          </coc-button>
          <coc-button
            :size = "onPrint ? 'small' : 'large'"
            :to = "`/jobs/${job.job_no}`">
            <tooltip content = "Job Home">
              <icon type = "ios-home-outline" />
            </tooltip>
          </coc-button>
          <coc-button   
            :type = "onPrint ? 'primary' : 'default'"         
            :size = "onPrint ? 'small' : 'large'"
            @clicked = "print">
            <tooltip content = "Print">
              <icon type = "ios-print-outline" />
            </tooltip>
          </coc-button>
          <coc-button
            :size = "onPrint ? 'small' : 'large'"
            @clicked = "getJob">
            <tooltip content = "Refresh">
              <icon type = "ios-refresh" />
            </tooltip>
          </coc-button>
        </button-group>
      </div>
      <div 
        v-if = "job && !onPrint" 
        class="row coc-house-keeper coc-text-bold">
        <p>Job #{{ job.job_no }}</p>
      </div>
      <component
        v-if = "job"
        :is = "onPrint ? 'DIV' : 'Card'">
        <p 
          v-if = "!onPrint" 
          slot = "title"
          class = "coc-content-text">
          <icon :type = "onPrint ? 'ios-information-circle-outline coc-content-text' : 'ios-create coc-content-text'"/>
          <span class="coc-content-text">{{ onPrint ? 'Job Details' : 'Edit Job' }}</span>
        </p>
        <div class="row">
          <div :class = "[ { 'col s6': !onPrint }, { 'col s3': onPrint } ]">
            <label class="coc-subcolor-text coc-text-small">Client Phone</label>
            <coc-input
              ref = "clientPhone"
              v-model = "input.client.phone"
              :scope = "['create-edit-job']"
              :rules = "{ HasValue: { active: true } }"
              :autocomplete-remote = "model => ({ method: 'get', url: '/job', params: { phone: model.val, limit: 5 }})"
              :autocomplete-map-response = "res => $_.uniqBy(res.jobs, j => j.client.phone).map(o => o.client.phone)"
              :hide-status = "onPrint"
              :size = "onPrint ? 'small' : 'large'"
              placeholder = "Client Phone"
              icon = "ios-phone-portrait"
              light-model
              allow-autocomplete
              @coc-enter = "handleAutocompleteSelect"
              @coc-select = "handleAutocompleteSelect" />
          </div>
          <div :class = "[ { 'col s6': !onPrint }, { 'col s3': onPrint } ]">
            <label class="coc-subcolor-text coc-text-small">Client Name</label>
            <coc-input
              v-model = "input.client.name"
              :scope = "['create-edit-job']"
              :rules = "{ HasValue: { active: true } }"
              :hide-status = "onPrint"
              :size = "onPrint ? 'small' : 'large'"
              placeholder = "Client Name"
              icon = "ios-person"
              light-model />
          </div>
          <div :class = "[ { 'col s6': !onPrint }, { 'col s3': onPrint } ]">
            <label class="coc-subcolor-text coc-text-small">Car Make</label>
            <coc-input
              v-model = "input.car.brand"
              :scope = "['create-edit-job']"
              :rules = "{ HasValue: true }"
              :data = "brands"
              :icon = "input.car.brand && input.car.brand.length ? null : 'ios-color-filter'"
              :style = "input.car.brand && input.car.brand.length ? 'width: calc( 100% - 40px )' : 'width: 100%'"
              :hide-status = "onPrint"
              :size = "onPrint ? 'small' : 'large'"
              placeholder = "Car Make"
              class = "col"
              light-model
              allow-autocomplete />
            <coc-avatar
              v-if = "input.car.brand && input.car.brand.length"
              slot = "suffix"
              :source = "`/snaps/brands/png/${input.car.brand.split(' ').join('-').toLowerCase()}.png`"
              :scale = "onPrint ? '20px' : '30px'"
              class = "col coc-margin-left-4px coc-margin-top-5px"/>
          </div>
          <div :class = "[ { 'col s6': !onPrint }, { 'col s3': onPrint } ]">
            <label class="coc-subcolor-text coc-text-small">Car Model</label>
            <coc-input
              v-model = "input.car.model"
              :scope = "['create-edit-job']"
              :rules = "{ HasValue: true }"
              :hide-status = "onPrint"
              :size = "onPrint ? 'small' : 'large'"
              placeholder = "Car Model"
              icon = "ios-car"
              light-model />
          </div>
          <div :class = "[ { 'col s6': !onPrint }, { 'col s3': onPrint } ]">
            <label class="coc-subcolor-text coc-text-small">Car Release Year</label>
            <coc-select
              v-model = "input.car.release"
              :scope = "['create-edit-job']"
              :rules = "{ HasValue: true }"
              :data = "generateYears()"
              :hide-status = "onPrint"
              :size = "onPrint ? 'small' : 'large'"
              placeholder = "Release Year"
              icon = "ios-calendar"
              filterable
              clearable
              light-model />
          </div>
          <div :class = "[ { 'col s6': !onPrint }, { 'col s3': onPrint } ]">
            <label class="coc-subcolor-text coc-text-small">Car Kilometers</label>
            <coc-input
              v-model = "input.car.kilometers"
              :scope = "['create-edit-job']"
              :rules = "{ HasValue: true, IsNumericString: true, NumberGreaterThan: -1 }"
              :hide-status = "onPrint"
              :size = "onPrint ? 'small' : 'large'"
              placeholder = "Kilometers"
              icon = "ios-speedometer"
              light-model />
          </div>
          <div :class = "[ { 'col s6': !onPrint }, { 'col s3': onPrint } ]">
            <label class="coc-subcolor-text coc-text-small">Car Chase Number</label>
            <coc-input
              v-model = "input.car.chase"
              :scope = "['create-edit-job']"
              :rules = "{ HasValue: true }"
              :hide-status = "onPrint"
              :size = "onPrint ? 'small' : 'large'"
              placeholder = "Chase Number"
              icon = "ios-barcode"
              light-model />
          </div>
          <div :class = "[ { 'col s6': !onPrint }, { 'col s3': onPrint } ]">
            <label class="coc-subcolor-text coc-text-small">Reciptionist</label>
            <coc-input
              v-model = "input.reciptionist"
              :scope = "['create-edit-job']"
              :rules = "{ HasValue: true }"
              :hide-status = "onPrint"
              :size = "onPrint ? 'small' : 'large'"
              placeholder = "Reciptionist"
              icon = "ios-ionitron"
              light-model />
          </div>
          <!-- <div class="col s12">
            <label class="coc-subcolor-text coc-text-small">Complain</label>
            <coc-input
              v-model = "input.complain"
              :scope = "['create-edit-job']"
              :rules = "{ HasValue: { active: false } }"
              :hide-status = "onPrint"
              :size = "onPrint ? 'small' : 'large'"
              placeholder = "Complain..."
              type = "textarea"
              light-model />
          </div> -->
          <div class="col s12">
            <label class="coc-subcolor-text coc-text-small">Notes</label>
            <coc-input
              v-model = "input.notes"
              :scope = "['create-edit-job']"
              :rules = "{ MaxLength: 9000 }"
              :hide-status = "onPrint"
              :size = "onPrint ? 'small' : 'large'"
              placeholder = "Notes..."
              type = "textarea"
              light-model />
          </div>
          <div
            :class = "{ hidden: onPrint }"
            class="col s12">
            <label class="coc-subcolor-text coc-text-small">Working Status</label>
            <coc-select
              v-model = "input.status"
              :scope = "['create-edit-job']"
              :rules = "{ MaxLength: 9000 }"
              :data = "['running', 'postponed', 'finished']"
              :hide-status = "onPrint"
              :size = "onPrint ? 'small' : 'large'"
              placeholder = "Notes..."
              light-model />
          </div>
          <Divider 
            v-if = "!onPrint" 
            orientation = "left"><span class="coc-content-text">Time Entry</span></Divider>
          <div 
            v-if = "!onPrint"
            class="col s12 animated slideInUp">
            <table
              :class = "[ { white: onPrint }, { 'black-text': onPrint } ]"
              class = "full-width coc-border-1 coc-border-border coc-light-background-bg">
              <tr class = "coc-border-bg coc-content-text">
                <th :class="[{'coc-padding-y-10px': !onPrint}, {'coc-padding-y-4px': onPrint}]">Entry Time</th>
                <th :class="[{'coc-padding-y-10px': !onPrint}, {'coc-padding-y-4px': onPrint}]">Departure Time</th>
              </tr>
              <tr
                class = "coc-primary-hover-bg coc-secondary-hover-text coc-smooth-bg-color full-width center coc-border-bottom-1 animated slideInLeft">
                <td> <span v-if = "!onPrint">{{ $moment(job.timein).fromNow() }}</span> ({{ $moment(job.timein).format('D/M/YYYY h:m A') }})</td>
                <td>
                  <span v-if = "!onPrint">{{ job.timeleave && job.status.toLowerCase() === 'finished' ? `${$moment(job.timeleave).fromNow()}` : '' }}</span>
                  {{ job.timeleave && job.status.toLowerCase() === 'finished' ? ` (${ $moment(job.timeleave).format('D/M/YYYY h:m A')})` : 'Not Finished Yet' }}
                </td>
              </tr>
            </table>
            <br>
          </div>
          <div 
            v-if = "onPrint"
            class="col s12 coc-margin-top-5px coc-padding-x-0 coc-margin-x-0">
            <div class="col s6">
              <div class = "coc-padding-y-3px coc-margin-y-0">Entry Time: <small>{{ $moment(job.timein).format('D/M/YYYY h:m A') }}</small></div>
            </div>
            <div class="col s6">
              <div class = "coc-padding-y-3px coc-margin-y-0">Departure Time: 
                <small>{{ job.timeleave && job.status.toLowerCase() === 'finished' ? $moment(job.timeleave).format('D/M/YYYY h:m A') : 'Not Finished Yet' }}</small>
              </div>
            </div>
          </div>
          <Divider 
            v-if = "!onPrint"
            id = "requirements"
            orientation = "left"><span class="coc-content-text">Requirements</span></Divider>
          <div
            class="col s12">
            <div
              :class = "[
                { 'coc-margin-y-10px coc-padding-y-10px coc-background-bg coc-border-border coc-border-1 coc-standard-border-radius': !onPrint },
                { 'coc-margin-y-3px coc-padding-y-3px coc-padding-x-0': onPrint } ]"
              class="col s12">
              <p 
                v-if = "!input.requirements.length && !onPrint"
                class = "coc-text-body">No Requirements</p>
              <p 
                v-if = "onPrint && input.requirements.length"
                class = "coc-text-body">Requirements</p>
              <div 
                v-for = "(required, i) in input.requirements" 
                :class = "[{ 'hidden': onPrint }]"
                :key = "i"
                class="row coc-padding-y-3px coc-margin-y-3px coc-border-bottom-1 coc-border-0 coc-border-border animated slideInLeft">
                <div :class = "[{'col s6': !onPrint}, { 'col s10': onPrint }]">
                  <i-input
                    v-model = "input.requirements[i].name"
                    size = "small"
                    placeholder = "Name"
                    @input = "input.requirements[i].created_at = $moment()"/>
                </div>
                <div :class = "[{'col s6': !onPrint}, { 'col s2': onPrint }]">
                  <Button
                    :class = "{ hidden: onPrint }"
                    icon = "ios-trash"
                    type = "error"
                    class = "right"
                    shape = "circle"
                    @click = "input.requirements.splice(i, 1)"/>
                  <i-switch
                    v-model = "input.requirements[i].done"
                    :class = "{ hidden: onPrint }"
                    placeholder = "Name"
                    true-color = "green"
                    false-color = "red"
                    class = "right coc-margin-x-5px coc-margin-top-5px"
                    @input = "handleRequirementChange(i)">
                    <icon 
                      slot="open" 
                      type = "md-checkmark" />
                    <icon 
                      slot="close" 
                      type = "md-close" />
                  </i-switch>
                  <icon 
                    v-if = "onPrint && job.requirements[i].done"
                    type = "md-checkmark"
                    class = "coc-success-text" />
                  <icon 
                    v-if = "onPrint && !job.requirements[i].done"
                    type = "md-close"
                    class = "coc-error-text" />
                </div>
              </div>
              <ul
                v-if = "onPrint"
                style = "list-style: none;">
                <li
                  v-for = "(required, i) in input.requirements"
                  :key = "i">
                  <icon 
                    v-if = "job.requirements[i].done"
                    type = "md-checkmark"
                    class = "coc-success-text" />
                  <icon 
                    v-if = "!job.requirements[i].done"
                    type = "md-close"
                    class = "coc-error-text" />
                  <span>
                    {{ input.requirements[i].name }}
                  </span>
                </li>
              </ul>
              <div 
                :class = "{ hidden: onPrint }"
                class="row coc-padding-y-3px coc-margin-y-3px">
                <p 
                  class = "coc-text-subtitle">Add Requirements</p>
                <div class = "col s6">
                  <coc-input
                    v-model = "requirements.name"
                    :autocomplete-remote = "model => ({ method: 'get', url: '/job', params: { requirements: model.meta.query, limit: 5 } } )"
                    :autocomplete-map-response = "(res) => $_.uniqBy( $coc.CielChilds(res.jobs, r => r.requirements) , j => j.name).map(j => j.name)"
                    placeholder = "Name"
                    allow-autocomplete
                    light-model
                    @coc-enter = "addRequirement"/>
                </div>
                <div class = "col s6">
                  <i-button
                    icon = "ios-add-circle"
                    type = "info"
                    shape = "circle"
                    class = "right"
                    @click = "addRequirement" />
                  <i-switch
                    v-model = "requirements.done"
                    placeholder = "Name"
                    true-color = "green"
                    false-color = "red"
                    class = "right coc-margin-x-5px coc-margin-top-5px">
                    <icon 
                      slot="open" 
                      type = "md-checkmark" />
                    <icon 
                      slot="close" 
                      type = "md-close" />
                  </i-switch>
                </div>
              </div>
            </div>
          </div>
          <div class="col s12">
            <coc-button
              :scope = "['create-edit-job']"
              :request = "{ xdata: formatInput(), url: `/job/${job._id}`, method: 'put' }"
              :validation-tolerence-time = "1500"
              :class = "{ hidden: onPrint }"
              :size = "onPrint ? 'small' : 'large'"
              placeholder = "Save"
              icon = "ios-checkmark-circle"
              class = "right coc-margin-top-3px"
              @coc-submit-accepted = "handleResult"/>
            <checkbox
              v-if = "!onPrint"
              v-model = "printSwitch"
              class = "right">Print</checkbox>
          </div>
          <div 
            :class = "{ hidden: onPrint }" 
            class="col s12 coc-margin-top-10px coc-padding-x-0">
            <Button
              icon = "ios-trash"
              type = "text"
              class = "coc-error-text right coc-padding-bottom-0"
              @click = "deleteJob">Delete Job</Button>
          </div>
        </div>
      </component>
      <Card v-else-if = "fetchError">
        <h3 class = "coc-text-title coc-content-text center">
          <Icon type = "ios-alert-outline coc-text-lg-2" /><br>
          <span class = "coc-text-lg-2">404</span><br>
          <span>Job Not Found</span>
        </h3>
      </Card>
    </div>
  </master>
</template>

<script>
import Master from '~/components/common/master'
import brands from '~/plugins/brands'
export default {
  name: 'JobCard',
  components: {
    Master
  },
  head() {
    return {
      title: this.job ? `Job | ${this.job.job_no}` : 'Job Not Found'
    }
  },
  data() {
    return {
      printSwitch: false,
      brands,
      partAutocompleteResponse: null,
      onPrint: false,
      fetchError: null,
      job: null,
      requirements: {
        name: '',
        done: false
      },
      externalInput: {
        name: '',
        price: '',
        fees: '',
        count: 1,
        makeMove: false,
        boughtPrice: 1
      },
      input: {
        notes: '',
        complain: '',
        promotion: '',
        reciptionist: '',
        requirements: [],
        car: {
          brand: '',
          model: '',
          release: '',
          chase: '',
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
    finalResources() {
      const actualPrice = this.finalValues
      if (this.input.promotion)
        return this.renderPromotion(this.input.promotion, actualPrice).after
      else return actualPrice
    },
    finalValues() {
      return this.$_.sumBy(
        this.input.operations,
        operation => (operation.price + operation.fees) * operation.count
      )
    },
    applyedVat() {
      if (!this.input.apply_vat || !this.input.applied_vat) return 0
      return parseFloat(this.input.applied_vat, 10)
    },
    vat() {
      return this.calculateVat(this.finalResources, this.applyedVat)
    },
    finalPrice() {
      return this.calculateFinalPrice(this.finalResources, this.vat)
    },
    appInstance() {
      return this.$store.state.core.app
    },
    importFromStockEnabled() {
      const ename = this.externalInput.name
      if (
        !this.$refs.partInput ||
        !this.$refs.partInput.autocompleteRetriever.response
      )
        return
      const response = this.$refs.partInput.autocompleteRetriever.response.stock.filter(
        c => c.name === ename
      )
      return !!response.length
    }
  },
  watch: {
    importFromStockEnabled(val) {
      if (!val) this.externalInput.makeMove = false
    }
  },
  mounted() {
    this.getJob()
    if (window) {
      const vm = this
      window.onafterprint = () => {
        vm.onPrint = false
      }
      window.onbeforeprint = () => {
        vm.onPrint = true
      }
    }
  },
  methods: {
    calculateVat(subtotal, vat) {
      return (subtotal / 1) * (vat / 100)
    },
    calculateFinalPrice(subtotal, vat) {
      return subtotal + vat
    },
    renderPromotion(promotionName, before) {
      let promotion = { type: 'fixed', amount: 0 }
      if (this.input.promotion_data) {
        promotion = this.input.promotion_data
      } else if (
        this.$store.state.core.app &&
        this.$store.state.core.app.promotions
      ) {
        const filtered = this.$store.state.core.app.promotions.filter(
          p => p.name === promotionName
        )
        if (filtered.length) promotion = filtered[0]
      }
      let discount = 0
      let after = 0
      if (promotion.type === 'fixed') {
        after = Math.max(before - promotion.amount, 0)
        discount = promotion.amount
      } else if (promotion.type === 'percentage') {
        discount = (before / 1) * (promotion.amount / 100)
        after = before - discount
      }
      return { before, after, discount }
    },
    handleStatusChange(e) {
      this.printSwitch = e && e.toLowerCase() === 'finished'
    },
    getJob() {
      this.$axios
        .get(`/job/${this.$route.params.id}`)
        .then(res => {
          this.fetchError = null
          this.job = res.data
          this.input = this.$_.cloneDeep(res.data)
          this.input.notes = this.input.notes ? this.input.notes : ' '
          this.input.complain = this.input.complain ? this.input.complain : ' '
          setTimeout(() => {
            this.$root.$emit('COCFormController', {
              scope: ['create-edit-job'],
              type: 'select',
              controller: 'validate'
            })
          }, 500)
          document.title = `Techno-Service | Job #${res.data.job_no}`
          if (this.$route.query.scroll) {
            setTimeout(() => {
              const eTarget = document.getElementById(this.$route.query.scroll)
              if (eTarget) {
                eTarget.scrollIntoView()
                this.$router.push(`/jobs/${this.$route.params.id}`)
              }
            }, 1000)
          }
        })
        .catch(err => {
          this.fetchError = err
          this.job = null
        })
    },
    deleteJob() {
      this.$axios({ url: `/job/${this.job._id}`, method: 'delete' }).then(
        res => {
          this.$router.push('/jobs')
        }
      )
    },
    handleResult(e) {
      this.$root.$emit('updateRunningJobs')
      this.job = e.meta.response
      if (this.printSwitch) {
        this.$Message.destroy()
        this.$Notice.destroy()
        window.focus()
        setTimeout(() => {
          this.print()
        }, 1000)
      }
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
    processExternalInput(operation = this.externalInput) {
      return {
        ...operation,
        name: operation.name,
        count: operation.count,
        price: parseFloat(operation.price, 10),
        fees: parseFloat(operation.fees, 10)
      }
    },
    handleAddPart() {
      this.input.operations.push(this.processExternalInput())
      this.$refs.partInput.focus()
      this.partAutocompleteResponse = null
    },
    formatInput() {
      const temp = this.$_.cloneDeep(this.input)
      temp.operations = temp.operations.map(o => this.processExternalInput(o))
      if (temp.applied_vat) temp.applied_vat = parseFloat(temp.applied_vat, 10)
      temp.promotion =
        temp.promotion && temp.promotion.length ? temp.promotion : null
      let promotion_data = null
      if (temp.promotion_data && temp.promotion && temp.promotion.length) {
        promotion_data = temp.promotion_data
      } else if (
        this.input.promotion &&
        this.$store.state.core.app &&
        this.$store.state.core.app.promotions
      ) {
        const filtered = this.$store.state.core.app.promotions.filter(
          p => p.name === this.input.promotion
        )
        if (filtered.length) promotion_data = filtered[0]
        promotion_data = {
          ...promotion_data,
          ...this.renderPromotion(this.input.promotion, this.finalValues)
        }
      }
      temp.vat = temp.apply_vat ? this.vat : 0
      return {
        ...this.$_.pick(temp, [
          'car',
          'client',
          'requirements',
          'reciptionist',
          'complain',
          'notes',
          'status',
          'operations',
          'vat',
          'apply_vat',
          'applied_vat',
          'promotion'
        ]),
        price: this.finalPrice,
        promotion_data
      }
    },
    handleAutocompleteSelect(e) {
      const response = this.$refs.clientPhone.autocompleteRetriever.response.jobs.filter(
        c => c.client.phone === e
      )
      if (response.length) {
        this.input.client = response[response.length - 1].client
        this.input.car = response[response.length - 1].car
      }
    },
    handleAutocompleteSelectPart() {
      setTimeout(() => {
        const ename = this.externalInput.name
        if (
          !this.$refs.partInput ||
          !this.$refs.partInput.autocompleteRetriever.response
        )
          return
        const response = this.$refs.partInput.autocompleteRetriever.response.stock.filter(
          c => c.name === ename
        )
        if (response.length) {
          this.partAutocompleteResponse = response[0]
          this.externalInput = {
            priceOnStock: response[0].price,
            ...response[0],
            count: 0
          }
          this.externalInput.countOnStock = response[0].count
          this.externalInput.makeMove = true
          setTimeout(() => {
            this.externalInput.count = 1
          }, 200)
        } else {
          this.partAutocompleteResponse = null
          this.externalInput = {
            ...this.$_.pick(this.externalInput, [
              'name',
              'price',
              'fees',
              'count'
            ]),
            makeMove: false
          }
        }
      }, 500)
    },
    merge(arrayOfArrays) {
      let i
      let j
      const result = []
      for (i = 0; i < arrayOfArrays.length; i += 1) {
        for (j = 0; j < arrayOfArrays[i].length; j += 1) {
          result.push(arrayOfArrays[i][j])
        }
      }
      return result
    },
    addRequirement() {
      if (this.requirements.name.length) {
        this.input.requirements.push({
          ...this.$_.cloneDeep(this.requirements),
          created_at: this.$moment()
        })
        this.requirements.name = ''
        this.requirements.done = false
      } else {
        this.$Message.error('No description added')
      }
    },
    print() {
      if (this.onPrint) {
        this.onPrint = false
        return
      }
      this.onPrint = true
      setTimeout(() => {
        window.print()
      }, 500)
    },
    addToStock() {
      this.$axios({
        method: 'post',
        url: '/stock',
        data: {
          external: 'false',
          name: this.externalInput.name,
          count: this.externalInput.count,
          price: this.externalInput.price,
          import_price: this.externalInput.boughtPrice,
          category: this.externalInput.name,
          points: 0,
          car_compatibility: [this.job.car],
          quick_add: true
        }
      }).then(res => {
        this.externalInput = { ...res.data }
        this.externalInput.makeMove = true
        const tempName = this.externalInput.name
        this.externalInput.name = ''
        this.$refs.partInput.autocompleteInvoker()
        setTimeout(() => {
          this.externalInput.name = tempName
          this.$refs.partInput.focus()
        }, 700)
      })
    },
    handleRequirementChange(i) {
      if (this.input.requirements[i].created_at) {
        this.input.requirements[i].updated_at = this.$moment()
      } else {
        this.input.requirements[i].created_at = this.$moment()
      }
    }
    // mapPartsAutoComplete(res) {
    //   const allOperations = this.merge(res.jobs.map(j => j.operations))
    //   return this.$_.uniqBy(allOperations, o => o.part).map(p => p.part)
    // }
  }
}
</script>

<style lang="css" scoped>
.scratched-text{
  text-decoration: line-through;
}
</style>
