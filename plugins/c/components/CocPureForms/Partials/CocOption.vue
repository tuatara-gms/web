<template>
  <div>
    <div>
      <p
        v-if = "resolvedOption.isFirstInGroup"
        class = "text-thin coc-text-normal coc-padding-x-10px">
        {{ resolvedOption.groupLabel }}
      </p>
      <div
        :class = "[
          {'coc-option-prescoped': prescoped},
          {'coc-padding-x-20px': resolvedOption.inGroup},
        ]"
        class = "pointer coc-padding-x-10px coc-padding-y-7px animated fadeIn"
        @mouseover = "handleMouseOver"
        @mouseleave = "handleMouseLeave"
        @click = "handleMouseClick">
        <span
          v-if = "resolvedOption.icon"
          :class = "[resolvedOption.icon ]"/>
        <coc-avatar
          v-if = "resolvedOption.avatar"
          v-bind = "resolvedOption.avatarOptions"
          :source = "resolvedOption.avatar"/>
        <span class = "coc-padding-x-5px">{{ resolvedOption.label }}</span>
        <span class="coc-padding-x-5px">
          <span
            v-if = "onSelect"
            class="coc-padding-x-5px">
            <span
              :class = "['coc-padding-x-5px', 'ivu-icon ivu-icon-md-checkmark-circle-outline', $coc.GetAlignment($root.$coc).inverse]"/>
          </span>
          <small
            v-if = "resolvedOption.comment"
            :class = "['coc-padding-x-5px', $coc.GetAlignment($root.$coc).inverse]">
            {{ resolvedOption.comment }}
          </small>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CocOption',
  props: {
    init: {
      type: [Object, String],
      default: 'foo'
    }
  },
  data() {
    return {
      onHover: false
    }
  },
  computed: {
    fallbackIcon() {
      return this.$parent && this.$parent._isVue && this.$parent.icon
        ? this.$parent.icon
        : null
    },
    onFocus() {
      return (
        this.$parent &&
        this.$parent._isVue &&
        this.$parent.focusUid === this._uid
      )
    },
    onSelect() {
      return (
        this.$parent &&
        this.$parent._isVue &&
        this.$parent.selectedOptions &&
        this.$parent.selectedOptions.indexOf(this.resolvedOption.value) !== -1
      )
    },
    prescoped() {
      return this.onHover || this.onFocus
    },
    resolvedOption() {
      return this.resolveOption(this.init)
    }
  },
  watch: {
    prescoped(val) {
      if (val) {
        this.parentEmit('optionprescoped', this.resolveOption(this.init).value)
      }
    }
  },
  mounted() {
    this.$parent.$on('mousehidden', () => {
      this.onHover = false
    })
    this.$parent.$on('selections', () => {
      this.onHover = false
    })
    this.$parent.$parent.$on('cocenter', () => {
      if (this.prescoped) {
        this.parentEmit('optionpicked', this.resolveOption(this.init).value)
      }
    })
  },
  methods: {
    parentEmit(event, payload = null) {
      this.$parent.$emit(event, payload)
    },
    resolveOption(feed) {
      if (feed == null) {
        return {
          value: null,
          label: '',
          icon: this.fallbackIcon,
          avatar: null,
          avatarOptions: null,
          comment: null,
          groupLabel: null,
          inGroup: false,
          isFirstInGroup: false,
          isLastInGroup: false
        }
      }
      if (typeof feed == 'object') {
        return {
          groupLabel: feed.groupLabel,
          inGroup: feed.inGroup,
          isFirstInGroup: feed.isFirstInGroup,
          isLastInGroup: feed.isLastInGroup,
          value:
            feed.value !== undefined ? feed.value : feed[Object.keys(feed)[0]],
          label:
            feed.label !== undefined ? feed.label : feed[Object.keys(feed)[0]],
          icon:
            feed.icon !== undefined && !feed.avatar
              ? feed.icon
              : this.fallbackIcon,
          avatar: feed.avatar !== undefined ? feed.avatar : null,
          avatarOptions:
            feed.avatarOptions !== undefined && feed.avatar
              ? feed.avatarOptions
              : { scale: '20px', childClasses: ['col house-keeper'] },
          comment: feed.comment !== undefined ? feed.comment : null
        }
      } else
        return {
          value: feed,
          label: feed,
          icon: this.fallbackIcon,
          avatar: null,
          avatarOptions: null,
          comment: null,
          groupLabel: null,
          inGroup: false,
          isFirstInGroup: false,
          isLastInGroup: false
        }
    },
    handleMouseOver() {
      this.onHover = true
      this.parentEmit('optionmousefocus', this._uid)
    },
    handleMouseLeave() {
      this.onHover = false
      this.parentEmit('optionmouseblur')
    },
    handleMouseClick() {
      this.parentEmit('optionpicked', this.resolveOption(this.init).value)
    }
  }
}
</script>

<style lang="css" scoped>
</style>
