<template>
  <div>
    <div class = "tuatara-commer-main" />
    <coc-nav :classes = "{ nav: 'transparent' }">
      <div
        slot = "title"
        class="col s12"
        style = "align-items: center; align-content: center; justify-content: center">
        <div
          style="font-family: jura; margin-top: 15px"
          class = " pink-text">COC, inc Product</div>
      </div>
      <div
        slot = "actions"
        class="col s12 center">
        <i-button 
          to = "/dashboard"
          type = "text" 
          size = "large"
          class = "teal-text text-accent-3 coc-text-bold coc-text-md-2">
          <span style="font-family: jura">Dashboard</span>
        </i-button>
        <i-button 
          to = "/about"
          type = "text" 
          size = "large"
          class = "teal-text text-accent-3 coc-text-bold coc-text-md-2">
          <span style="font-family: jura">About Us</span>
        </i-button>
      </div>
    </coc-nav>
    <div class = "container commer-content-holder">
      <div class="row">
        <h1 
          class = "center coc-text-super coc-text-bold teal-text text-accent-3" 
          style="font-family: jura;">TUATARA</h1>
        <p 
          class = "center teal-text text-accent-3 coc-text-lg coc-text-bold" 
          style="font-family: jura;">Garage Managment System</p>
        <div class = "col l6 push-l3">
          <img 
            v-coc-mouse-over = "'jello'"
            v-coc-mouse-leave = "'rubberBand'"
            src="/snaps/tuatara-teal.png" 
            class = "coc-full-width animated" >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Index',

  data() {
    return {}
  }
}
</script>

<style lang="css" scoped>
@font-face {
  font-family: 'jura';
  src: url('/fonts/Jura/Jura-Regular.ttf');
  font-weight: 250;
  font-style: normal;
}
@font-face {
  font-family: 'jura';
  src: url('/fonts/Jura/Jura-Bold.ttf');
  font-weight: bold;
  font-style: normal;
}
.tuatara-commer-main {
	background: url("/snaps/garage.jpg");
	background-repeat:no-repeat;
	background-size: cover;
	height: 100vh;
	width: 100vw;
	filter: grayscale(0.5);
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
}
.commer-content-holder {
	height: calc(100vh - 70px);
	width: 100vw;
	align-content: center;
	justify-content: center;
	align-items: center;
	display: flex;
}
.tuatara-commer-logo-coc {
	height: 40px;
	width: 40px;
	padding: 0 !important;
	margin-left: 20px;
	margin-top: 5px;
}
</style>
