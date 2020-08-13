<template>
  <div>
    <div class = "about-background" />
    <div class = "coc-background-bg coc-about-holder">
      <coc-nav :classes = "{ nav: 'coc-background-bg z-depth-0 coc-border-bottom-1 coc-border-0 coc-border-border coc-full-width' }">
        <nuxt-link
          slot = "title"
          to = "/">
          <img 
            src="/snaps/tuatara.png" 
            class = "tuatara-about-nav-logo col">
          <div 
            class = "coc-primary-text col coc-text-bold coc-margin-top-5px" 
            style="font-family: jura">TUATARA</div>
        </nuxt-link>
      </coc-nav>
      <div class="container">
        <div class="row">
          <p class = "coc-text-md-2">
            <b class = "coc-text-subtitle">What Is Tuatara?</b><br>
            <b class = "coc-primary-text">Tuatara</b> is a <b>Garage Managment System (GMS)</b> designed to organize the working flow of your garage.
            We Start from your early operation processes, followed by repairs documentation, reaching Fainancial Status and Analytics.<br>
            The system is divided into 5 main sections
            <ol class = "coc-margin-left-2rem">
              <li><b>Stock Managment</b></li>
              <li><b>Job Managment</b></li>
              <li><b>Users Management</b></li>
              <li><b>Organization Management</b></li>
              <li><b>Reports and Analytics</b></li>
            </ol>
            Each section of them is completes the others, so the final pattern of the system will be the completest GMS ever.<br>
            <b class = "coc-text-subtitle">How it works</b><br>
            Every section in Tuatara is designed to be independent, but also completes the others.<br>
            <b>Organization Managment Section</b><br>
            <span class="coc-margin-left-2rem">
              Declares all priamary date your organization may need
              <ul class = "coc-margin-left-4rem">
                <li>Organization Data Entiry</li>
                <li>VAT Declaration</li>
                <li>Promotions Declaration</li>
                <li>Smart Card Generation</li>
                <li>Branches Management</li>
              </ul>
            </span>
            <b>Jobs Section</b><br>
            <span class="coc-margin-left-2rem">
              covers the journey of car maintainance using the following sub-modules.
              <ul class = "coc-margin-left-4rem">
                <li>Job Registeration</li>
                <li>Requirements Declaration</li>
                <li>Operations Record</li>
                <li>Spare Parts Replacements</li>
                <li>Labors Registeration</li>
                <li>Job Status Alteration
                  <ol class = "coc-margin-left-2rem coc-text-body">
                    <li>Running</li>
                    <li>Postponed</li>
                    <li>Finished</li>
                  </ol>
                </li>
                <li>VAT Applyment</li>
                <li>Promotions Applyment</li>
                <li>Job Card Printing</li>
                <li>Job Qoutation Printing</li>
                <li>Job Invoice Printing</li>
                <li>Client History Inquery</li>
                <li>Car History Inquery</li>
                <li>Diagnose assistance based on Car History</li>
              </ul>
            </span>
            <b>Stocks Section</b><br>
            <span class="coc-margin-left-2rem">
              covers all the imports/exports data flow
              <ul class = "coc-margin-left-4rem">
                <li>Parts and Assets Registeration</li>
                <li>Imports/Exports Moves Execution</li>
                <li>Providers Support</li>
                <li>Automobiles Compitability Support</li>
                <li>External Resources Registeration (Taxes, Salaries, ..etc)</li>
                <li>Moves listing and deep inqueries</li>
                <li>Stock listing and deep inqueries</li>
              </ul>
            </span>
            <b class = "coc-text-subtitle">Do i need to do all the work?</b><br>
            Absloutly not, Tuatara is designed to work with diffirent users and different roles, which makes your data flow smoother and more accurate.<br>
            Tuatara includes 4 different user roles
            <ol class = "coc-margin-left-2rem">
              <li><b>Stocks Supervision</b></li>
              <li><b>Jobs Supervision</b></li>
              <li><b>Admin</b></li>
              <li><b>Owner</b></li>
            </ol>
            Every user in your organization can get one or many roles, which makes it flixible for you to manage your staff, but still keep the limits for each one.<br>
          </p>
          <div class="col s12 coc-house-keeper">
            <div class="col l6 s12 coc-house-keeper">
              <p>
                <b class = "coc-text-subtitle">What should i expect?</b><br>
                Tuatara's target is to make the operations easy so you can focus on what's next; That's why we provide you with a super analytics module that will guide you to detect which are your wining cards and which are not.<br>
                You will have over 20 types of reports with a very deep filtering tools.
              </p>
            </div>
            <div class="col l6 s12">
              <img
                src = "/snaps/chartgif.gif"
                class = "coc-full-width"
                style = "filter: brightness(1.2) opacity(0.5);">
            </div>
          </div>
          <div class="col s12 coc-house-keeper">
            <div class="col s12 coc-house-keeper">
              <img
                src = "/snaps/COC-trans.png"
                class = "coc-full-width"
                style = "height: 100px; width: 100px;" >
            </div>
            <div class = "col s12 coc-text-bold pink-text">
              COC, inc Product
            </div>
          </div>
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
.tuatara-about-nav-logo {
	height: 50px;
	width: 50px;
	padding: 0 !important;
	margin-left: 20px;
}
.about-background {
	background: url(/snaps/compass.png);
	background-repeat:no-repeat;
	background-size: contain;
	background-position: right;
	height: calc(100vh - 70px);
	width: 100vw;
    position: fixed;
    top: 70px;
    left: 0;
	filter: opacity(7%);
	z-index: 0;
	max-width: 100vw;
	overflow-x: hidden;
}
.coc-about-holder {
	min-height: 100vh;
	width: 99vw;
	max-width: 99vw;
	overflow-x: hidden;
	z-index: 1;
	display: block;
	padding-bottom: 2rem;
}
</style>
