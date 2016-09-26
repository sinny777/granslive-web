define([
	'angular',	
	'angularRoute',
	'angularResource',
    'angularAnimate',
    'angularLocalStorage',
    'angularToastr',
    'angularCookies',
    'angularFilesystem',
    'xeditable',
    'angularMoment',
    'bootstrap',
//    'ui.bootstrap',
    'cryptojslib',
    'querystring',
    'mqtt',
	'config',
	'../modules/loopback/lb-services',
	'../modules/common/commonModule',
	'../modules/iot/iotModule',
	'../modules/watson/watsonModule'
], function (angular, angularRoute) {
    'use strict';

    var granslive =  angular.module('granslive', [
        'ngRoute',
        'ngResource',
        'ngAnimate',
//        'ui.bootstrap',
        'LocalStorageModule',
        'toastr',
        'ngCookies',
        'xeditable',
        'angularMoment',
        'fileSystem',
        'app.config',
        'lbServices',
        'commonModule',
        'iotModule',
        'watsonModule'
    ]);
    
    
    granslive.config(function(toastrConfig) {
    	
        angular.extend(toastrConfig, {
            allowHtml: false,
            closeButton: true,
            closeHtml: '<button>&times;</button>',
            containerId: 'toast-container',
            extendedTimeOut: 2000,
            iconClasses: {
                error: 'toast-error',
                info: 'toast-info',
                success: 'toast-success',
                warning: 'toast-warning'
            },
            maxOpened: 0,
            messageClass: 'toast-message',
            newestOnTop: true,
            onHidden: null,
            onShown: null,
            positionClass: 'toast-top-full-width',
            preventDuplicates: false,
            progressBar: false,
            tapToDismiss: true,
            target: 'body',
            templates: {
                toast: 'directives/toast/toast.html',
                progressbar: 'directives/progressbar/progressbar.html'
            },
            timeOut: 5000,
            titleClass: 'toast-title',
            toastClass: 'toast'
        });
    });
    
    granslive.run(['$rootScope','$location','LoopBackAuth', 'editableOptions', function($rootScope, $location, LoopBackAuth, editableOptions) {
        $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
            console.log('IN routeChangeStart >>>>>>> ');
             $rootScope.footerLinks = [];
             var currentUserId = LoopBackAuth.currentUserId;
             if (!LoopBackAuth.isLoggedIn() && !currentUserId) {
               console.log("USER IS NOT LOGGEDIN: >>> ", currentUserId);
//               $location.path("/#!/home");
//               event.preventDefault();
               if(!$rootScope.currentUser){
          		 $rootScope.currentUser = {permissions: {}};
	           }else{
	          		 console.log("$rootScope.currentUser: >>> ", $rootScope.currentUser);
	           }
             }else{
            	 console.log("USER IS LOGGEDIN: >>> ", currentUserId);
            	 if(!$rootScope.currentUser){
            		 $rootScope.currentUser = {permissions: {}};
            	 }else{
            		 console.log("$rootScope.currentUser: >>> ", $rootScope.currentUser);
            	 }
             }
             
             editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'

        });
        
        $rootScope.loadingScreen = $('<div style="position:fixed;top:0;left:0;right:0;bottom:0;z-index:10000;background-color:gray;background-color:rgba(70,70,70,0.2);"><img style="position:absolute;top:50%;left:50%;" alt="" src="/assets/images/loading.gif" /></div>')
        .appendTo($('body')).hide();

    }]);
     
    
    return granslive;


});
