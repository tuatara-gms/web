import COC from './c/index.js'
import moment from 'moment'
import 'moment-timezone'
import lodash from 'lodash'
import pkg from '~/package'
import Vue from 'vue'
export default ({ app: { router, $axios }, env }, inject) => {
  // Init COC
  COC.Init({
    Vue,
    lodash,
    moment,
    axios: $axios
  })
  // Config app data
  COC.Config.Meta({
    name: pkg.name,
    brandName: 'Spart',
    version: pkg.version,
    repository: pkg.repository,
    author: pkg.author,
    mode: env.mode,
    logo: {
      primary: '/snaps/tservice.png',
      invert: '/snaps/tservice-white.png'
    }
  })
  // Docker
  const Docker = new COC.Docker()
  Docker.AddItems([
    {
      icon: 'ivu-icon ivu-icon-ios-home-outline',
      label: 'Home',
      id: 'home',
      callback: () => {
        router.push('/')
      }
    },
    {
      icon: 'ivu-icon ivu-icon-ios-bug-outline',
      label: 'Validate',
      id: 'validate',
      callback: () => {
        router.push('/demo/validate')
      }
    },
    {
      icon: 'ivu-icon ivu-icon-ios-hammer-outline',
      label: 'Demos',
      id: 'demos',
      callback: () => {
        router.push('/demo')
      }
    },
    {
      icon: 'ivu-icon ivu-icon-ios-alert-outline',
      label: 'Show Alert',
      id: 'alert',
      callback() {
        alert('Once a COC, always a COC!')
      }
    }
  ])
  const Loader = {
    spinner: [
      'ivu-icon',
      'knocks-loader',
      'coc-spin',
      'text-lg',
      'center',
      'coc-content-text'
    ],
    placeholder: '',
    placeholderClass: 'coc-content-text text-lg block',
    backgroundColor: 'rgba(255,255,255,0.8)'
  }
  COC.Config.Defaults({ Docker, Loader })
  inject('coc', COC)
}
