<template>
  <div class = "coc-child-dropdown">
    <slot
      name = "toggler"/>
    <div
      v-if = "showChildList"
      class = "child-list">
      <div
        v-for = "(feed , index) in computedFeeds"
        :key = "index"
        @mouseover = "isHovered = true"
        @mouseleave = "isHovered = false">
        <coc-option
          :init = "feed"/>
      </div>
      <div v-if = "!computedFeeds.length">
        <p class = "center coc-content-tint-2-text coc-padding-y-5px">{{ noDataPlaceholder }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CocDropdown',
  props: {
    active: {
      type: Boolean,
      default: false
    },
    input: {
      type: [String, Number, Array, Object],
      default: ''
    },
    icon: {
      type: String,
      default: null
    },
    optionsFilter: {
      type: Function,
      default: null
    },
    feeds: {
      type: Array,
      default: null
    },
    noDataPlaceholder: {
      type: String,
      default: 'No Data Available'
    },
    multiple: {
      type: Boolean,
      default: false
    },
    markSelections: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeFeed: 0,
      focusOption: null,
      innerFocus: true,
      isHovered: false,
      focusUid: null,
      selectedOptions: []
    }
  },
  computed: {
    model() {
      return {
        val: {
          active: this.showChildList
        }
      }
    },
    computedFeeds() {
      if (!this.feeds) {
        return []
      }
      if (!this.optionsFilter) {
        return this.feeds
      }
      const tempFeeds = []
      this.feeds.forEach(option => {
        if (
          typeof option === 'object' &&
          option.group === true &&
          option.options &&
          option.options instanceof Array
        ) {
          option.options.forEach((childOption, index) => {
            const tempChild = childOption
            // Identify as a groupped options
            tempChild.groupLabel = option.label
            tempChild.inGroup = true
            // Handle Parent Fallback Icon
            if (option.icon && !tempChild.icon) {
              tempChild.icon = option.icon
            }
            if (index === 0) {
              tempChild.isFirstInGroup = true
              tempChild.isLastInGroup = false
            } else if (index === option.options.length - 1) {
              tempChild.isFirstInGroup = false
              tempChild.isLastInGroup = true
            } else {
              tempChild.isFirstInGroup = false
              tempChild.isLastInGroup = false
            }
            tempFeeds.push(childOption)
          })
        } else {
          tempFeeds.push(option)
        }
      })
      const filteredOptions = this.optionsFilter(this.input, tempFeeds)
      return this.reviseOptionsGrouping(filteredOptions)
    },
    eventHandler() {
      return new this.$coc.Event({ api: this })
    },
    showChildList() {
      return this.active && this.innerFocus
    }
  },
  watch: {
    model: {
      deep: true,
      immediate: true,
      handler(val) {
        this.$emit('input', val)
      }
    },
    active(val) {
      if (val) {
        this.innerFocus = true
      }
    },
    input() {
      if (this.focusOption > this.$children.length - 1) {
        this.focusOption = 0
        this.focusUid = this.focusUidByIndex()
      }
    },
    focusOption(val) {
      if (val === null) {
        this.$emit('noselections')
      }
    }
  },
  mounted() {
    this.$emit('control', {
      increment: this.incrementFocus,
      decrement: this.decrementFocus
    })
    this.listenOnOutterIgnore()
    // Event Handling
    const vm = this
    this.eventHandler.OnMap({
      optionmousefocus(e) {
        if (!vm.$children || !vm.$children.length) {
          return
        }
        const tempIndex = vm.$children.findIndex(
          i => typeof i === 'object' && i._isVue && i._uid === e
        )
        vm.focusUid = e
        if (tempIndex >= 0) {
          vm.focusOption = tempIndex
        }
      },
      optionmouseblur() {
        vm.focusOption = null
      },
      optionpicked(e) {
        vm.handleOptionPicked(e)
      }
    })
  },
  methods: {
    reviseOptionsGrouping(options) {
      let temp = options
      let lastGroup = null
      let i
      for (i = 0; i < temp.length; i += 1) {
        if (temp[i].inGroup) {
          if (lastGroup !== temp[i].groupLabel) {
            temp[i].isFirstInGroup = true
            lastGroup = temp[i].groupLabel
          } else {
            temp[i].isFirstInGroup = false
          }
        }
      }
      return temp
    },
    listenOnOutterIgnore() {
      if (!window || !this.showChildList) {
        return
      }
      const vm = this
      window.onclick = function(event) {
        if (
          !vm.$slots.toggler ||
          !vm.$slots.toggler.length ||
          !vm.$slots.toggler[0] ||
          !vm.$slots.toggler[0].context ||
          !vm.$slots.toggler[0].context.$refs ||
          !vm.$slots.toggler[0].context.$refs.input
        ) {
          return
        }
        if (event.target !== vm.$slots.toggler[0].context.$refs.input) {
          vm.innerFocus = false
        }
      }
    },
    incrementFocus() {
      this.handleCursor()
      if (this.focusOption === null) {
        this.focusOption = 0
        return
      }
      this.focusOption =
        this.focusOption >= this.computedFeeds.length - 1
          ? 0
          : (this.focusOption += 1)
      this.focusUidByIndex()
    },
    decrementFocus() {
      this.handleCursor()
      this.focusOption =
        this.focusOption <= 0
          ? this.computedFeeds.length - 1
          : (this.focusOption -= 1)
      this.focusUidByIndex()
    },
    focusUidByIndex(index = this.focusOption) {
      this.focusUid =
        this.$children &&
        this.$children.length &&
        this.$children[index] &&
        typeof this.$children[index] === 'object'
          ? this.$children[index]._uid
          : null
    },
    handleCursor() {
      if (document && this.isHovered) {
        this.$emit('mousehidden')
        document.body.style.cursor = 'hidden'
      }
    },
    handleOptionPicked(e) {
      if (!this.markSelections) {
        return
      }
      const optionIndex = this.selectedOptions.indexOf(e)
      if (optionIndex === -1) {
        if (this.multiple) {
          this.markOption(e)
        } else {
          this.selectedOptions = []
          this.markOption(e)
        }
      } else {
        this.unmarkOption(optionIndex)
      }
      this.$emit('selections', this.selectedOptions)
    },
    markOption(e) {
      this.selectedOptions.push(e)
    },
    unmarkOption(e) {
      this.selectedOptions.splice(e, 1)
    },
    unmarkOptionByValue(value) {
      this.selectedOptions = this.selectedOptions.filter(i => i !== value)
      this.$emit('selections', this.selectedOptions)
    }
  }
}
</script>

<style lang="css" scoped>
</style>
