<template>
  <div>
    <Button 
      type="primary" 
      @click="login_modal = true">Login</Button>
    <Modal
      v-model="login_modal"
      :footer-hide = "true"
      icon = "ios-log-in">
      <div class="col s12 coc-padding-bottom-20px">
        <div class="col s4 left">
          <img 
            width="30"
            class="circle" 
            src="duser.png">
        </div>
        <h1 class="col s8 coc-primary-text coc-padding-left-40px">Login</h1>
      </div>
      <hr>
      <login class="coc-padding-top-20px house-keeper"/>
    </Modal>
  </div>
</template>

<script>
import Login from './Login'
export default {
  name: 'LoginModal',
  components: {
    Login
  },
  props: {
    title: {
      type: String,
      default: 'Title'
    }
  },
  data() {
    return {
      login_modal: false
    }
  },
  methods: {}
}
</script>

<style lang="css" scoped>
</style>
