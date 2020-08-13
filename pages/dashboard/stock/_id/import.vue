<template>
  <master>
    <div v-if = "user">
      <Card v-if = "stock">
        {{ stock }}
      </Card>
    </div>
    <Card v-if = "!user">
      <p class = "coc-text-title coc-error-text center">
        <Icon type = "ios-alert-outline"/>
        You Are Not Logged In
      </p>
      <br>
      <p class="center">
        <button-group>
          <Button
            type = "default"
            size = "large"
            shape = "circle"
            style = "width: 120px"
            @click = "askForLogin">
            Login
          </Button>
        </button-group>
          
      </p>
    </Card>
  </master>
</template>

<script>
export default {
  name: 'ImportStock',

  data() {
    return {
      stock: null
    }
  },
  computed: {
    user() {
      return this.$store.state.core.auth
    }
  },
  mounted() {
    if (!this.$route.params.id) {
      this.$router.push('/')
    }
  }
}
</script>

<style lang="css" scoped>
</style>
