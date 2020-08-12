/* To avoid CSS expressions while still supporting IE 7 and IE 6, use this script */
/* The script tag referencing this file must be placed before the ending body tag. */

/* Use conditional comments in order to target IE 7 and older:
	<!--[if lt IE 8]><!-->
	<script src="ie7/ie7.js"></script>
	<!--<![endif]-->
*/

(function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'tcsc\'">' + entity + '</span>' + html;
	}
	var icons = {
		'tcsc-car-icon': '&#xe900;',
		'tcsc-traffic-light-icon': '&#xe901;',
		'tcsc-automaton-icon': '&#xe902;',
		'tcsc-car-1-icon': '&#xe903;',
		'tcsc-car-2-icon': '&#xe904;',
		'tcsc-professions-and-jobs-icon': '&#xe905;',
		'tcsc-real-estate-icon': '&#xe906;',
		'tcsc-wheel-icon': '&#xe907;',
		'tcsc-car-3-icon': '&#xe908;',
		'tcsc-car-accident-icon': '&#xe909;',
		'tcsc-robotic-arm-icon': '&#xe90a;',
		'tcsc-speed-icon': '&#xe90b;',
		'tcsc-car1-icon': '&#xe90c;',
		'tcsc-fuel-icon': '&#xe90d;',
		'tcsc-car-11-icon': '&#xe90e;',
		'tcsc-oil-icon': '&#xe90f;',
		'tcsc-motor-icon': '&#xe910;',
		'tcsc-wheel-1-icon': '&#xe911;',
		'tcsc-motor-1-icon': '&#xe912;',
		'tcsc-parking-icon': '&#xe913;',
		'tcsc-car-4-icon': '&#xe914;',
		'tcsc-car-battery-icon': '&#xe915;',
		'tcsc-car-5-icon': '&#xe916;',
		'tcsc-jeep-icon': '&#xe917;',
		'tcsc-car-6-icon': '&#xe918;',
		'tcsc-inflate-icon': '&#xe919;',
		'tcsc-motor1-icon': '&#xe91a;',
		'tcsc-tire-icon': '&#xe91b;',
		'tcsc-car-21-icon': '&#xe91c;',
		'tcsc-car-check-icon': '&#xe91d;',
		'tcsc-spring-icon': '&#xe91e;',
		'tcsc-turbo-icon': '&#xe91f;',
		'tcsc-broken-car-icon': '&#xe920;',
		'tcsc-motor-2-icon': '&#xe921;',
		'tcsc-architecture-and-city-icon': '&#xe922;',
		'tcsc-car-31-icon': '&#xe923;',
		'tcsc-car-41-icon': '&#xe924;',
		'tcsc-racing-game-icon': '&#xe925;',
		'tcsc-car-51-icon': '&#xe926;',
		'tcsc-motor-11-icon': '&#xe927;',
		'tcsc-car-wash-icon': '&#xe928;',
		'tcsc-technician-icon': '&#xe929;',
		'tcsc-car-61-icon': '&#xe92a;',
		'tcsc-entertainment-icon': '&#xe92b;',
		'tcsc-bumper-car-icon': '&#xe92c;',
		'tcsc-car-7-icon': '&#xe92d;',
		'tcsc-car-8-icon': '&#xe92e;',
		'tcsc-farming-and-gardening-icon': '&#xe92f;',
		'tcsc-business-and-finance-icon': '&#xe930;',
		'tcsc-key-icon': '&#xe931;',
		'tcsc-cab-icon': '&#xe932;',
		'tcsc-car-9-icon': '&#xe933;',
		'tcsc-car-sales-icon': '&#xe934;',
		'tcsc-maps-and-location-icon': '&#xe935;',
		'tcsc-car-sales-1-icon': '&#xe936;',
		'tcsc-technician-1-icon': '&#xe937;',
		'tcsc-architecture-and-city-1-icon': '&#xe938;',
		'tcsc-car-10-icon': '&#xe939;',
		'tcsc-investing-icon': '&#xe93a;',
		'tcsc-oil1-icon': '&#xe93b;',
		'tcsc-car-battery-1-icon': '&#xe93c;',
		'tcsc-hippie-icon': '&#xe93d;',
		'tcsc-truck-icon': '&#xe93e;',
		'tcsc-volkswagen-beetle-icon': '&#xe93f;',
		'tcsc-hover-car-icon': '&#xe940;',
		'tcsc-maintenance-icon': '&#xe941;',
		'tcsc-car-radio-icon': '&#xe942;',
		'tcsc-spray-icon': '&#xe943;',
		'tcsc-car-service-icon': '&#xe944;',
		'tcsc-taxi-icon': '&#xe945;',
		'tcsc-car-111-icon': '&#xe946;',
		'tcsc-car-service-1-icon': '&#xe947;',
		'tcsc-car-12-icon': '&#xe948;',
		'tcsc-safe-driving-icon': '&#xe949;',
		'tcsc-crane-truck-icon': '&#xe94a;',
		'tcsc-turbo1-icon': '&#xe94b;',
		'tcsc-car-parts-icon': '&#xe94c;',
		'tcsc-crane-truck-1-icon': '&#xe94d;',
		'tcsc-checklist-icon': '&#xe94e;',
		'tcsc-motor-3-icon': '&#xe94f;',
		'tcsc-generator-icon': '&#xe950;',
		'tcsc-insurance-icon': '&#xe951;',
		'tcsc-car-13-icon': '&#xe952;',
		'tcsc-insurance-1-icon': '&#xe953;',
		'tcsc-fix-icon': '&#xe954;',
		'tcsc-insurance-2-icon': '&#xe955;',
		'tcsc-storage-icon': '&#xe956;',
		'tcsc-transportation-icon': '&#xe957;',
		'tcsc-gear-box-icon': '&#xe958;',
		'tcsc-inventory-icon': '&#xe959;',
		'tcsc-electric-car-icon': '&#xe95a;',
		'tcsc-inventory-1-icon': '&#xe95b;',
		'tcsc-stock-icon': '&#xe95c;',
		'tcsc-transportation-1-icon': '&#xe95d;',
		'tcsc-news-report-icon': '&#xe95e;',
		'tcsc-transportation-2-icon': '&#xe95f;',
		'tcsc-cost-icon': '&#xe960;',
		'tcsc-market-analysis-icon': '&#xe961;',
		'tcsc-car-services-icon': '&#xe962;',
		'tcsc-margin-icon': '&#xe963;',
		'tcsc-warehouse-icon': '&#xe964;',
		'tcsc-warehouse-1-icon': '&#xe965;',
		'tcsc-stock-1-icon': '&#xe966;',
		'tcsc-stock-2-icon': '&#xe967;',
		'0': 0
		},
		els = document.getElementsByTagName('*'),
		i, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		c = el.className;
		c = c.match(/tcsc-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
}());
