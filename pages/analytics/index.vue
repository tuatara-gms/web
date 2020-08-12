<template>
  <master>
    <h3 class = "coc-text-title coc-text-bold">Analytics</h3>
    <div class="row">
      <coc-input
        v-model = "input.q"
        placeholder = "Search Analyics.."
        size = "large"
        icon = "ios-search"
        light-model />
      <div
        v-coc-mouse-over = "'coc-deanimate'"
        v-for = "(card, c) in cards"
        :key = "c"
        :class = "[
          'col s12 l4 m6 coc-margin-y-10px',
          {'animated pulse infinite': isMatchedSearch(card) && input.q.length }
      ]">
        <Card
          :class = "[card.class, {'z-depth-3': isMatchedSearch(card) && input.q.length }]">
          <nuxt-link
            :to = "card.url"
            class = "coc-text-lg-1 white-text coc-text-bold">
            <span :class = "card.icon" />
            {{ card.label }}
          </nuxt-link>
          <cell-group
            :class = "card.cellsClass">
            <cell
              v-for = "(cell, c) in card.cells"
              v-if = "isMatchedSearch(cell)"
              :key = "c"
              :to = "cell.url"
              :class = "card.cellsClass"
              class = "coc-background-text coc-content-hover-text animated pulse">
              <icon :type = "cell.icon" />
              <span>{{ cell.label }}</span>
            </cell>
          </cell-group>
        </Card>
      </div>
      <div class="col s12">
        <nuxt-link
          :class = "[
            'coc-padding-y-3rem',
            'coc-text-massive',
            'coc-success-bg',
            'col',
            's12',
            'center',
            'coc-background-text',
            'coc-success-hover-tint-1-bg',
            'coc-background-hover-text',
            'coc-standard-border-radius',
          ]"
          to = "/analytics/finance">
          <div class="col s3">
            <span class = "knocks-moneybag coc-text-lg-2 coc-border-3 coc-padding-4px coc-success-shade-1-bg coc-circle-border-radius"/>
          </div>
          <div class="col s9">
            <span>
              <span class="coc-text-bold">Where's My Money</span>
              <divider class = "coc-margin-y-0"/>
              <small>Financial Status</small>
            </span>
          </div>
        </nuxt-link>
      </div>
      <!-- <div style="max-height: 300px; overflow-y: scroll; width: 100%;">
        <div
          v-for = "(card, c) in cards"
          :key = "c"
          style = "margin-top: 20px !important; padding-left: 10px;">
          <cell
            v-for = "(cell, c) in card.cells"
            v-if = "isMatchedSearch(cell)"
            :key = "c"
            :to = "cell.url"
            class = " coc-content-text-text animated pulse">
            <icon :type = "cell.icon" />
            <span><b>{{ card.label }}</b> {{ cell.label }}</span>
          </cell>
        </div>
      </div> -->
    </div>
  </master>
</template>

<script>
import Master from '~/components/common/master.vue'
export default {
  name: 'AnalyticsIndex',
  components: {
    Master
  },
  head() {
    return {
      title: this.$store.state.core.app
        ? `${this.$store.state.core.app.title} | Analytics`
        : 'Analytics'
    }
  },
  data() {
    return {
      input: {
        q: ''
      },
      cards: {
        jobs: {
          label: 'JOBS',
          keywords: ['job', 'jobs', 'profit'],
          icon: 'tcsc-maintenance-icon',
          url: '/analytics/jobs',
          class: 'anltc-card animated pulse blue coc-house-keeper',
          cellsClass:
            'blue lighten-1 white-text coc-full-width card-cell-group',
          cells: [
            {
              label: 'Overview',
              url: '/analytics/jobs',
              keywords: ['profit', 'all', 'overview'],
              icon: ' knocksapp-book'
            },
            {
              label: 'Job Status',
              url: '/analytics/jobs?scroll=status',
              keywords: ['status', 'finished', 'postponed', 'running'],
              icon: ' knocksapp-flag2'
            },
            {
              label: 'Daily Count',
              url: '/analytics/jobs?scroll=daily-count',
              keywords: ['profit', 'daily', 'day', 'count'],
              icon: ' knocks-calendar4'
            },
            {
              label: 'Monthly Count',
              url: '/analytics/jobs?scroll=monthly-count',
              keywords: ['profit', 'monthly', 'month', 'count'],
              icon: ' knocks-calendar7'
            },
            {
              label: 'Annual Count',
              url: '/analytics/jobs?scroll=annual-count',
              keywords: ['profit', 'annual', 'year', 'count'],
              icon: ' knocks-calendar10'
            },
            {
              label: 'Requirements Status',
              url: '/analytics/jobs?scroll=requirements-analytics',
              keywords: ['requirements', 'running', 'finished', 'status'],
              icon: ' knocksapp-toggle-right'
            },
            {
              label: 'Requirements Time Consumption',
              url: '/analytics/jobs?scroll=requirements-time',
              keywords: ['profit', 'annual', 'year', 'count'],
              icon: ' knocksapp-alarm-clock'
            },
            {
              label: 'Car Makes',
              url: '/analytics/jobs?scroll=makes',
              keywords: ['profit', 'makes', 'brands'],
              icon: ' tcsc-car-icon'
            }
          ]
        },
        stock: {
          label: 'STOCK',
          keywords: ['stock', 'rawmaterial', 'products'],
          icon: 'tcsc-stock-1-icon',
          url: '/analytics/stock',
          class: 'anltc-card animated pulse amber darken-3 coc-house-keeper',
          cellsClass:
            'amber darken-2 white-text coc-full-width card-cell-group',
          cells: [
            {
              label: 'All Stock',
              url: '/analytics/stock',
              keywords: ['stock', 'products', 'rawmaterial', 'all', 'overview'],
              icon: ' tcsc-stock-icon'
            },
            {
              label: 'Count Ratio',
              url: '/analytics/stock?scroll=general-stock',
              keywords: ['stock', 'products', 'rawmaterial', 'count'],
              icon: ' knocks-chart3'
            },
            {
              label: 'Margin Ratio',
              url: '/analytics/stock?scroll=margin-stock',
              keywords: ['margin', 'difference'],
              icon: ' knocks-measure'
            },
            {
              label: 'Demand Ratio',
              url: '/analytics/stock?scroll=demand-stock',
              keywords: ['demand', 'exports'],
              icon: 'md-remove-circle'
            },
            {
              label: 'Support Ratio',
              url: '/analytics/stock?scroll=support-stock',
              keywords: ['support', 'imports'],
              icon: 'md-add-circle'
            },
            {
              label: 'Support/Demand Ratio',
              url: '/analytics/stock?scroll=support-demand-stock',
              keywords: ['support', 'imports', 'demand', 'exports'],
              icon: ' knocks-crop5'
            }
          ]
        },
        automobiles: {
          label: 'AUTOMOBILES',
          keywords: [
            'car',
            'cars',
            'automobiles',
            'vichels',
            'makes',
            'brands'
          ],
          icon: 'tcsc-car-icon',
          url: '/analytics/automobiles',
          class:
            'anltc-card animaRightd bounceInUp teal pulse-1 coc-house-keeper',
          cellsClass: 'teal darken-2 white-text coc-full-width card-cell-group',
          cells: [
            {
              label: 'Overview',
              url: '/analytics/automobiles',
              keywords: ['automobiles', 'cars', 'all', 'overview'],
              icon: ' knocksapp-book'
            },
            {
              label: 'Car Makes',
              url: '/analytics/automobiles?scroll=makes',
              keywords: ['automobiles', 'cars', 'makes', 'brands'],
              icon: ' tcsc-car-icon'
            },
            {
              label: 'Daily Count',
              url: '/analytics/automobiles?scroll=daily-count',
              keywords: ['automobiles', 'cars', 'daily', 'day', 'count'],
              icon: ' knocks-calendar4'
            },
            {
              label: 'Monthly Count',
              url: '/analytics/automobiles?scroll=monthly-count',
              keywords: ['automobiles', 'cars', 'monthly', 'month', 'count'],
              icon: ' knocks-calendar7'
            },
            {
              label: 'Annual Count',
              url: '/analytics/automobiles?scroll=annual-count',
              keywords: ['automobiles', 'cars', 'annual', 'year', 'count'],
              icon: ' knocks-calendar10'
            }
          ]
        }
        // parts: {
        //   label: 'PARTS',
        //   keywords: [],
        //   icon: 'tcsc-motor-11-icon',
        //   url: '/analytics/parts',
        //   class:
        //     'anltc-card animaRightd bounceInUp pink pulse-2 coc-house-keeper',
        //   cellsClass: 'pink darken-3 white-text coc-full-width card-cell-group',
        //   cells: [
        //     {
        //       label: 'Overview',
        //       url: '/analytics/automobiles',
        //       keywords: ['automobiles', 'cars', 'all', 'overview'],
        //       icon: ' knocksapp-book'
        //     },
        //     {
        //       label: 'Car Makes',
        //       url: '/analytics/automobiles?scroll=makes',
        //       keywords: ['automobiles', 'cars', 'makes', 'brands'],
        //       icon: ' tcsc-car-icon'
        //     },
        //     {
        //       label: 'Daily Count',
        //       url: '/analytics/automobiles?scroll=daily-count',
        //       keywords: ['automobiles', 'cars', 'daily', 'day', 'count'],
        //       icon: ' knocks-calendar4'
        //     },
        //     {
        //       label: 'Monthly Count',
        //       url: '/analytics/automobiles?scroll=monthly-count',
        //       keywords: ['automobiles', 'cars', 'monthly', 'month', 'count'],
        //       icon: ' knocks-calendar7'
        //     },
        //     {
        //       label: 'Annual Count',
        //       url: '/analytics/automobiles?scroll=annual-count',
        //       keywords: ['automobiles', 'cars', 'annual', 'year', 'count'],
        //       icon: ' knocks-calendar10'
        //     }
        //   ]
        // },
        // vendors: {
        //   label: 'VENDORS',
        //   keywords: [],
        //   icon: 'tcsc-car-6-icon',
        //   url: '/analytics/vendors',
        //   class: 'anltc-card animated pulse purple pulseen-1 coc-house-keeper',
        //   cellsClass:
        //     'purple darken-2 white-text coc-full-width card-cell-group',
        //   cells: [
        //     {
        //       label: 'Overview',
        //       url: '/analytics/automobiles',
        //       keywords: ['automobiles', 'cars', 'all', 'overview'],
        //       icon: ' knocksapp-book'
        //     },
        //     {
        //       label: 'Car Makes',
        //       url: '/analytics/automobiles?scroll=makes',
        //       keywords: ['automobiles', 'cars', 'makes', 'brands'],
        //       icon: ' tcsc-car-icon'
        //     },
        //     {
        //       label: 'Daily Count',
        //       url: '/analytics/automobiles?scroll=daily-count',
        //       keywords: ['automobiles', 'cars', 'daily', 'day', 'count'],
        //       icon: ' knocks-calendar4'
        //     },
        //     {
        //       label: 'Monthly Count',
        //       url: '/analytics/automobiles?scroll=monthly-count',
        //       keywords: ['automobiles', 'cars', 'monthly', 'month', 'count'],
        //       icon: ' knocks-calendar7'
        //     },
        //     {
        //       label: 'Annual Count',
        //       url: '/analytics/automobiles?scroll=annual-count',
        //       keywords: ['automobiles', 'cars', 'annual', 'year', 'count'],
        //       icon: ' knocks-calendar10'
        //     }
        //   ]
        // },
        // requirements: {
        //   label: 'REQUIREMENTS',
        //   keywords: [],
        //   icon: 'tcsc-car-6-icon',
        //   url: '/analytics/requirements',
        //   class: 'anltc-card animated pulse red accent-3 coc-house-keeper',
        //   cellsClass: 'red accent-2 white-text coc-full-width card-cell-group',
        //   cells: [
        //     {
        //       label: 'Overview',
        //       url: '/analytics/automobiles',
        //       keywords: ['automobiles', 'cars', 'all', 'overview'],
        //       icon: ' knocksapp-book'
        //     },
        //     {
        //       label: 'Car Makes',
        //       url: '/analytics/automobiles?scroll=makes',
        //       keywords: ['automobiles', 'cars', 'makes', 'brands'],
        //       icon: ' tcsc-car-icon'
        //     },
        //     {
        //       label: 'Daily Count',
        //       url: '/analytics/automobiles?scroll=daily-count',
        //       keywords: ['automobiles', 'cars', 'daily', 'day', 'count'],
        //       icon: ' knocks-calendar4'
        //     },
        //     {
        //       label: 'Monthly Count',
        //       url: '/analytics/automobiles?scroll=monthly-count',
        //       keywords: ['automobiles', 'cars', 'monthly', 'month', 'count'],
        //       icon: ' knocks-calendar7'
        //     },
        //     {
        //       label: 'Annual Count',
        //       url: '/analytics/automobiles?scroll=annual-count',
        //       keywords: ['automobiles', 'cars', 'annual', 'year', 'count'],
        //       icon: ' knocks-calendar10'
        //     }
        //   ]
        // }
      }
    }
  },
  methods: {
    isMatchedSearch(cell) {
      if (!this.input.q.length) return true
      return !!cell.keywords.filter(
        k =>
          this.input.q.toLowerCase().includes(k) ||
          k.includes(this.input.q.toLowerCase()) ||
          this.input.q
            .toLowerCase()
            .split(' ')
            .filter(
              split => split.length && (split.includes(k) || k.includes(split))
            ).length
      ).length
    }
  }
}
</script>

<style lang="css" scoped>
.anltc-card {
	height: 200px;
}
.card-cell-group{
  max-height: 130px;
  overflow-y: auto;
  border-top: 2px solid #fff;
}
</style>
