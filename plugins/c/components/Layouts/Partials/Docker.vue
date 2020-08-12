<template>
  <div
    v-coc-mouse-over = "'active'"
    id = "coc-docker"
    class = "coc-docker row z-depth-2">
    <div 
      id = "coc-docker-container"
      :style = "{ marginLeft: `${pushValue}px` }"
      class = "col">
      <div
        v-for = "(item, i) in docker.Items"
        v-if = "!item.hidden"
        :key = "i"
        class = "col coc-docker-item text-lg"
        @mouseup = "getCallback(item, $event)">
        <Tooltip
          v-if = "item.label"
          :content = "item.label">
          <span
            v-coc-mouse-over = "'mouse-over'"
            v-coc-mouse-down = "'jello'"
            v-coc-mouse-up = "'rubberBand'"
            :class = "[item.icon, 'coc-docker-item-icon animated']"/>
        </Tooltip>
        <span
          v-coc-mouse-over = "'mouse-over'"
          v-coc-mouse-down = "'jello'"
          v-coc-mouse-up = "'rubberBand'"
          v-else
          :class = "[item.icon, 'coc-docker-item-icon animated']"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Docker',
  props: {
    items: {
      type: Array,
      default() {
        return []
      }
    },
    show: {
      type: Array,
      default() {
        return []
      }
    },
    hide: {
      type: Array,
      default() {
        return []
      }
    },
    ignoreDefaults: {
      type: Boolean,
      default: false
    },
    windowWatcher: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      pushValue: 0
    }
  },
  computed: {
    docker() {
      return new this.$coc.Docker(!this.ignoreDefaults, {
        items: this.items,
        hide: this.hide,
        show: this.show
      })
    }
  },
  watch: {
    items: {
      deep: true,
      handler(val) {
        if (val) {
          this.docker.AddItems(val)
        }
      }
    },
    show: {
      deep: true,
      handler(val) {
        if (val) {
          this.docker.Show(val)
        }
      }
    },
    hide: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val) {
          this.docker.Hide(val)
        }
      }
    }
  },
  mounted() {
    this.centerizeItems()
    if (process.browser) {
      const { centerizeItems } = this
      window.addEventListener('resize', () => {
        centerizeItems()
      })
    }
  },
  methods: {
    centerizeItems() {
      if (!process.browser) {
        this.pushValue = 0
      }
      let container = document.getElementById('coc-docker-container')
      if (container) {
        container = container.offsetWidth
      } else this.pushValue = 0
      let docker = document.getElementById('coc-docker')
      if (docker) {
        docker = docker.offsetWidth
      } else this.pushValue = 0
      this.pushValue = docker > container ? (docker - container) / 2 : 0
    },
    getCallback(item, e) {
      if (item.callback) item.callback(e)
    }
  }
}
</script>

<style lang="css" scoped>
</style>
