<template>
  <component
    :is = "resolved.group ? 'OptionGroup' : 'Option'"
    :label = "resolved.label"
    :value = "!resolved.group ?resolved.value : undefined" >
    <div v-if = "!resolved.group">
      <div
        class = "pointer coc-padding-x-10px coc-padding-y-7px animated fadeIn">
        <span
          v-if = "resolved.icon"
          :class = "[resolved.icon ]"/>
        <Avatar
          v-if = "resolved.avatar"
          v-bind = "resolved.avatarOptions"
          :src = "resolved.avatar"/>
        <span class = "coc-padding-x-5px">{{ resolved.label }}</span>
        <span class="coc-padding-x-5px">
          <small
            v-if = "resolved.comment"
            :class = "['coc-padding-x-5px', $coc.GetAlignment($root.$coc).inverse]">
            {{ resolved.comment }}
          </small>
        </span>
      </div>
    </div>
    <template v-else>
      <coc-iview-option
        v-for = "(option, index) in resolved.options"
        :key = "index"
        :init = "option"/>
    </template>
  </component>
</template>

<script>
export default {
  name: 'CocIviewOption',
  props: {
    init: {
      type: [Object, String, Array],
      default: 'Option'
    }
  },
  data() {
    return {
      resolver: new this.$coc.OptionsManager(this.init)
    }
  },
  computed: {
    resolved() {
      return this.resolver.Resolve()
    }
  },
  methods: {
    // Methods
  }
}
</script>

<style lang="css" scoped>
</style>
