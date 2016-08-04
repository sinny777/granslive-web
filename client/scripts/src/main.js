
console.log('\n\n<<<<<<<<< INSIDE main.js >>>>>>>>>');

require.config({
	waitSeconds: 200,
    paths :{
    	'jquery' : '../vendor/jquery/dist/jquery.min',
        'angular' :'../vendor/angular/angular.min',
        'angularRoute' : '../vendor/angular-route/angular-route.min',
        'angularResource' : '../vendor/angular-resource/angular-resource.min',
        'angularLocalStorage' : '../vendor/angular-local-storage/dist/angular-local-storage.min',
        'angularAnimate' : '../vendor/angular-animate/angular-animate.min',
        'angularFilesystem': '../vendor/angular-filesystem/src/filesystem',
        'angularToastr': '../vendor/angular-toastr/dist/angular-toastr.tpls.min',
        'angularCookies' : '../vendor/angular-cookies/angular-cookies.min',
        'bootstrap' : '../vendor/bootstrap/dist/js/bootstrap.min',
        'ui.bootstrap':'../vendor/angular-bootstrap/ui-bootstrap.min',
        'cryptojslib' : '../vendor/cryptojslib/rollups/pbkdf2',
        'querystring': '../vendor/querystring/querystring.min',
        'text': '../vendor/text',
        'mqtt':'../vendor/paho-mqtt/src/mqttws31'
    },
    shim: {
        'angular': {
            exports: 'angular'
        },
        'angularRoute' :{
            deps: ['angular']
        },
        'angularResource' :{
            deps: ['angular']
        },
        'angularAnimate' :{
            deps: ['angular']
        },
        'angularToastr': {
            deps: ['angularAnimate']
        },
        'angularLocalStorage' :{
            deps: ['angular']
        },
        'angularCookies' :{
            deps: ['angular']
        },
        'angularFilesystem' :{
            deps: ['angular']
        },
        'cryptojslib' : {
            exports : 'cryptojslib'
        },
        'querystring' : {
            exports : 'querystring'
        },
        'mqtt' : {
            exports : 'mqtt'
        },
        'jquery':{
        	 exports : 'jquery'
        },
        'bootstrap' : {
        	deps: ['jquery'],
        	exports: 'bootstrap'
        },
        'ui.bootstrap': {
            deps: ['angular','bootstrap'],
            exports: 'ui.bootstrap'
        }
    },
    priority:
    	[
         'jquery',
	       'angular',
	       'cryptojslib',
	       'querystring',
	       'mqtt',
	       'bootstrap',
	       'ui.bootstrap'
	   ],
   deps: [
          'initialize'
          ]
});

/*
require(['require','angular','bootstrap','app'], function () {
    angular.element(document).ready(function() {
        angular.bootstrap(document, ['myworkstyle']);
    });
});
*/
