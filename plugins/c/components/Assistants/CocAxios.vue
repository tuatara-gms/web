<template>
  <div 
    v-if = "dev" 
    class="row">
    <pre class = "black">
    <code>
      {{ result }}
    </code>
    </pre>
  </div>
</template>

<script>
export default {
  name: 'CocAxios',
  props: {
    xdata: {
      type: [Object],
      default: null
    },
    method: {
      type: String,
      default: 'post'
    },
    url: {
      type: String,
      required: true
    },
    freeOrigin: {
      type: Boolean,
      default: false
    },
    timeout: {
      type: Number,
      default: 15000
    },
    params: {
      type: Object,
      default: null
    },
    recursed: {
      type: Boolean,
      default: false
    },
    recursion_time: {
      type: Number,
      default: 10000
    },
    recursion_precondition: {
      type: Boolean,
      default: null
    },
    precondition: {
      type: Boolean,
      default: null
    },
    behind_recursion: {
      type: Boolean,
      default: false
    },
    dev: {
      type: Boolean,
      default: false
    },
    scope: {
      type: Array,
      default: null
    },
    preventOnMount: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isLoading: false,
      loadingPercentage: null,
      response: null,
      errors: null,
      hasErrors: false,
      status: null,
      result: null,
      windowStatus: true,
      recursionStopped: false
      // CancelToken: null,
      // requestSource: null
    }
  },
  computed: {
    finalUrl() {
      return this.url
    }
  },
  mounted() {
    this.resultCollector()
    if (!this.preventOnMount) this.retrieve()
    this.watchMyWindow()
    const vm = this
    // App.$on('axios' , (payloads)=>{
    //   if(vm.scope == null) return;
    //   let i, j;
    //   for (i = 0 ; i < payloads.scope.length; i++){
    //     for(j = 0; j < vm.scope.length; j++){
    //       if(payloads.scope[i] == vm.scope[j]){
    //         vm.retrieve();
    //         return;
    //       }
    //     }
    //   }
    // });
  },
  methods: {
    async retrieve() {
      // this.CancelToken = this.$axios.CancelToken
      // this.requestSource = this.CancelToken.source()
      if (this.precondition != null && this.precondition == false) return
      this.isLoading = true
      this.resultCollector()
      const vm = this
      this.$axios({
        method: vm.method,
        url: vm.finalUrl,
        data: vm.xdata,
        params: vm.params,
        // CancelToken: vm.CancelToken,
        onDownloadProgress: progressEvent => {
          vm.resultCollector()
          vm.$emit('progress', vm.result)
          vm.isLoading = true
          vm.loadingPercentage = Math.floor(
            (progressEvent.loaded * 100) / progressEvent.total
          )
        },
        timeout: vm.timeout
      })
        .then(res => {
          vm.isLoading = false
          vm.response = res.data
          vm.hasErrors = false
          vm.errors = null
          // vm.CancelToken = null
          // vm.requestSource = null
          vm.resultCollector()
          vm.$emit('success', vm.result)
          if (
            vm.recursed &&
            (vm.recursion_precondition == null ||
              vm.recursion_precondition == true)
          ) {
            setTimeout(() => {
              if (
                vm.behind_recursion ||
                (!vm.behind_recursion && vm.windowStatus)
              ) {
                //Recursion
                vm.$emit('recursion', vm.result)
                vm.retrieve()
              } else {
                vm.$emit('stop', vm.result)
                vm.recursionStopped = true
                //Stop
              }
            }, vm.recursion_time)
          }
        })
        .catch(err => {
          vm.isLoading = false
          vm.hasErrors = true
          vm.errors = err
          // vm.CancelToken = null
          // vm.requestSource = null
          vm.resultCollector()
          vm.$emit('catch', vm.result)
          //if(err.response.status == 401)
          //App.$emit('logoutGlobal');
        })
    },
    abort(message = 'Operation canceled by the user.') {
      // if (!this.requestSource) {
      //   return
      // }
      // this.requestSource.cancel(message)
    },
    resultCollector() {
      this.result = {
        loading: this.isLoading,
        progress: this.loadingPercentage,
        response: this.response,
        status: this.status,
        hasErrors: this.hasErrors,
        errors: this.errors,
        monitor: {
          data: this.xdata,
          url: this.finalUrl,
          timeout: this.timeout,
          recursion: this.recursed,
          recursion_time: this.recursion_time,
          recursion_precondition: this.recursion_precondition
        },
        scope: this.scope,
        scopeRetrive: this.remoteRetrive,
        retrieve: this.retrieve,
        abort: this.abort
      }
      this.$emit('input', this.result)
    },
    remoteRetrive() {
      //f=App.$emit('knocksRetriver' , {scope : this.scope});
    },
    watchMyWindow() {
      const vm = this

      //   $(document).ready(function(){
      //   $(window).focus(function(){
      //     vm.windowStatus = true ;
      //       if(vm.behind_recursion || (!vm.behind_recursion && vm.windowStatus) ){
      //          vm.recursionStopped = false;
      //         if(vm.behind_recursion) vm.retrieve();
      //     }
      //   });
      //   $(window).blur(function(){
      //       vm.windowStatus = false ;
      //   });
      // });
    }
  }
}
</script>

<style lang="css" scoped>
</style>
