<template>
  <div :class = "cssMixins.container">
    <div :class = "cssMixins.listContainer">
      <div :class = "cssMixins.list">
        <div 
          v-for = "(get , index) in $slots"
          v-if = "onValidKey(index)"
          :key = "index" 
          :class = "cssMixins.li">
          <transition 
            :enter-active-class = "cssMixins.liEnter" 
            :leave-active-class = "cssMixins.liLeave">
            <slot 
              :name = "index"/>
          </transition>
        </div>
      </div>
    </div>
    <div v-if = "cssMixins.showCount">
      <slot 
        :toggled = "toggled" 
        :all = "numericSlotCount" 
        name = "count">
        <div 
          v-if = "cssMixins.showCount && cssMixins.countText" 
          :class = "cssMixins.countContainer">
          <span>{{ `${toggled} ${cssMixins.countText} ${numericSlotCount}` }}</span>
        </div>
        <div 
          v-if = "cssMixins.showCount && !cssMixins.countText && cssMixins.countIcon" 
          :class = "cssMixins.countContainer">
          <span>{{ toggled }}</span>
          <span :class = "cssMixins.countIcon"/>
          <span>{{ numericSlotCount }}</span>
        </div>
      </slot>
    </div>
    <div 
      v-if = "numericSlotCount > 0" 
      :class = "cssMixins.buttonsDiv">
      <ButtonGroup v-if = "cssMixins.groupped" >
        <Button 
          v-if = "cssMixins.viewing.showAll"
          :size = "cssMixins.buttonsSize.group"
          :disabled = "toggled === numericSlotCount || numericSlotCount === 0"
          :type = "cssMixins.buttonTypes.showAll"
          :class = "cssMixins.buttons"
          :icon = "cssMixins.icons.showAll"
          @click = "toggled = numericSlotCount">
          <slot name = "showall">
            {{ messages.showAll }}
          </slot>
        </Button>
        <Button 
          v-if = "cssMixins.viewing.more"
          :size = "cssMixins.buttonsSize.group"
          :disabled = "!hasMore"
          :type = "cssMixins.buttonTypes.more"
          :class = "cssMixins.buttons"
          :icon = "cssMixins.icons.more"
          @click = "changeShowKey(true)">
          <slot name = "more">
            {{ messages.seeMore }}
          </slot>
        </Button>
        <Button 
          v-if = "cssMixins.viewing.less"
          :size = "cssMixins.buttonsSize.group"
          :disabled = "!hasLess"
          :type = "cssMixins.buttonTypes.less"
          :class = "cssMixins.buttons"
          :icon = "cssMixins.icons.less"
          @click = "changeShowKey(false)">
          <slot name = "less">
            {{ messages.seeLess }}
          </slot>
        </Button>
        <Button 
          v-if = "cssMixins.viewing.hideAll"
          :size = "cssMixins.buttonsSize.group"
          :disabled = "toggled === 0 || numericSlotCount === 0"
          :type = "cssMixins.buttonTypes.hideAll"
          :class = "cssMixins.buttons"
          :icon = "cssMixins.icons.hideAll"
          @click = "toggled = 0">
          <slot name = "hideall">
            {{ messages.hideAll }}
          </slot>
        </Button>
      </ButtonGroup>
      <template v-else>
        <Button 
          v-if = "cssMixins.viewing.showAll"
          :size = "cssMixins.buttonsSize.showAll"
          :disabled = "toggled === numericSlotCount || numericSlotCount === 0"
          :type = "cssMixins.buttonTypes.showAll"
          :class = "cssMixins.buttons"
          :icon = "cssMixins.icons.showAll"
          @click = "toggled = numericSlotCount">
          <slot name = "showall">
            {{ messages.showAll }}
          </slot>
        </Button>
        <Button 
          v-if = "cssMixins.viewing.more"
          :size = "cssMixins.buttonsSize.more"
          :disabled = "!hasMore"
          :type = "cssMixins.buttonTypes.more"
          :class = "cssMixins.buttons"
          :icon = "cssMixins.icons.more"
          @click = "changeShowKey(true)">
          <slot name = "more">
            {{ messages.seeMore }}
          </slot>
        </Button>
        <Button 
          v-if = "cssMixins.viewing.less"
          :size = "cssMixins.buttonsSize.less"
          :disabled = "!hasLess"
          :type = "cssMixins.buttonTypes.less"
          :class = "cssMixins.buttons"
          :icon = "cssMixins.icons.less"
          @click = "changeShowKey(false)">
          <slot name = "less">
            {{ messages.seeLess }}
          </slot>
        </Button>
        <Button 
          v-if = "cssMixins.viewing.hideAll"
          :size = "cssMixins.buttonsSize.hideAll"
          :disabled = "toggled === 0 || numericSlotCount === 0"
          :type = "cssMixins.buttonTypes.hideAll"
          :class = "cssMixins.buttons"
          :icon = "cssMixins.icons.hideAll"
          @click = "toggled = 0">
          <slot name = "hideall">
            {{ messages.hideAll }}
          </slot>
        </Button>
      </template>
    </div>
    <div v-if = "numericSlotCount === 0">
      <slot name = "empty"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Cocshowkeys',
  props: {
    showkey: {
      type: Number,
      default: 5
    },
    len: {
      type: Number,
      default: null
    },
    loop: {
      type: Number,
      default: null
    },
    classes: {
      type: Object,
      default: () => {
        return {
          container: 'row house-keeper',
          buttons: '',
          buttonTypes: {
            less: null,
            more: null,
            showAll: null,
            hideAll: null
          },
          icons: {
            less: null,
            more: null,
            showAll: null,
            hideAll: null
          },
          buttonsSize: {
            less: null,
            more: null,
            showAll: null,
            hideAll: null,
            group: null
          },
          viewing: {
            less: true,
            more: true,
            showAll: true,
            hideAll: true
          },
          groupped: true,
          buttonsDiv: 'row center',
          listItem: 'col s12',
          liEnter: 'animated slideInDown',
          liLeave: 'animated slideOutLeft',
          list: 'row',
          listContainer: 'row house-keeper',
          showCount: true,
          count: 'right coc-primary-text',
          countText: '/',
          countIcon: null,
          countContainer: 'row house-keeper coc-primary-text right'
        }
      }
    },
    cssClasses: {
      type: Object,
      default: () => {
        return {}
      }
    },
    messages: {
      type: Object,
      default: () => {
        return {
          seeMore: 'See More',
          seeLess: 'See Less',
          showAll: 'Show All',
          hideAll: 'Hide All',
          empty: 'Nothing to show here.',
          emptyIcon: ''
        }
      }
    },
    scope: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      toggled: 0
    }
  },
  computed: {
    model() {
      return {
        control: {
          showAll: this.showAll,
          hideAll: this.hideAll,
          showMore: this.showMore,
          showLess: this.showLess,
          showCustom: this.showCustom,
          showOnly: this.showOnly
        },
        meta: {
          hasLess: this.hasLess,
          hasMore: this.hasMore,
          toggled: this.toggled,
          total: this.numericSlotCount
        }
      }
    },
    cssMixins() {
      return new this.$coc.Objects(this.classes).Mix(this.cssClasses).get
    },
    hasMore() {
      return this.toggled < this.numericSlotCount
    },
    hasLess() {
      return this.toggled > this.showkey
    },
    numericSlotCount() {
      return this.limit ? this.limit : this.getNumericSlotCount()
    }
  },
  mounted() {
    setTimeout(() => {
      if (this.limit !== null) {
        this.toggled = Math.min(this.showkey, this.numericSlotCount)
      }
    }, 400)
    this.emit()
    //VUE EVENTS
    //Global Events <<App API>
    const vm = this
    $nuxt.$on('COCFormController' , (payloads)=>{ // eslint-disable-line
      if (!vm.scope) return
      //Type Check
      if (payloads.type !== undefined && payloads.type !== 'showkeys') return
      //Check Matching
      if (this.$coc.IsMatchedArrays(vm.scope, payloads.scope)) {
        if (vm.model.control[payloads.controller] !== undefined) {
          vm.model.control[payloads.controller](
            payloads.credentials,
            payloads.callback !== 'undefined' &&
            typeof payloads.callback === 'function'
              ? payloads.callback
              : null
          )
        } else {
          this.$coc.DevWarn({
            component: 'COC Show Keys',
            message:
              'The controller (' +
              payloads.controller +
              ') that you`re trying to access is not exist.'
          })
        }
      } else return
    })
  },
  methods: {
    onValidKey(index) {
      if (isNaN(index)) {
        return false
      } else {
        return this.toggled > parseInt(index)
      }
    },
    showMore() {
      if (arguments.length === 0 || arguments[0] === null)
        this.changeShowKey(true)
      else if (typeof arguments[0] === 'function') {
        this.changeShowKey(true, arguments[0])
      }
      this.emit('showmore')
    },
    showLess() {
      if (arguments.length === 0 || arguments[0] === null)
        this.changeShowKey(false)
      else if (typeof arguments[0] === 'function') {
        this.changeShowKey(true, arguments[0])
      }
      this.emit('showless')
    },
    showCustom() {
      if (
        arguments.length === 1 ||
        (arguments.length > 1 && arguments[1] === null)
      )
        this.changeShowKey(arguments[0])
      else if (typeof arguments[1] === 'function') {
        this.changeShowKey(arguments[0], arguments[1])
      }
    },
    showOnly() {
      this.toggled = this.$coc.GetRange(arguments[0], 0, this.numericSlotCount)
      if (typeof arguments[0] === 'function') arguments[0]()
      this.emit('showonly')
    },
    hideAll() {
      this.toggled = 0
      if (typeof arguments[0] === 'function') arguments[0]()
      this.emit('hideall')
    },
    showAll() {
      if (arguments.length === 0 || arguments[0] === null)
        this.changeShowKey(this.numericSlotCount)
      else if (typeof arguments[0] === 'function') {
        this.changeShowKey(this.numericSlotCount, arguments[0])
      }
      this.emit('showall')
    },
    changeShowKey() {
      if (typeof arguments[0] === 'number') {
        this.toggled = Math.min(
          this.numericSlotCount,
          this.toggled + arguments[0]
        )
      }
      if (typeof arguments[0] === 'boolean') {
        if (arguments[0]) {
          this.toggled = Math.min(
            this.numericSlotCount,
            this.toggled + this.showkey
          )
        } else {
          this.toggled = Math.max(this.showkey, this.toggled - this.showkey)
        }
      }
      this.emit()
      //callback
      if (typeof arguments[arguments.length - 1] === 'function') {
        arguments[arguments.length - 1]()
      }
    },
    getNumericSlotCount() {
      let keys = Object.keys(this.$slots),
        i,
        count = 0
      for (i = 0; i < keys.length; i++) if (!isNaN(keys[i])) count++
      return count
    },
    emit() {
      this.$emit(arguments.length > 0 ? arguments[0] : 'input', this.model)
    }
  }
}
</script>

<style lang="css" scoped>
</style>
