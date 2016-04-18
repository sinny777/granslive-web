define([
	'angular',	
	'angularRoute',
	'angularResource',
    'angularAnimate',
    'angularLocalStorage',
    'angularToastr',
    'angularCookies',
    'angularFilesystem',
    'bootstrap',
//    'ui.bootstrap',
    'cryptojslib',
    'querystring',
    'paho-mqtt',
	'config',
	'loopback/lb-services',
	'common/commonModule',
	'iot/iotModule',
	'watson/watsonModule'
], function (angular, angularRoute) {
    'use strict';

    var myworkstyle =  angular.module('myworkstyle', [
        'ngRoute',
        'ngResource',
        'ngAnimate',
//        'ui.bootstrap',
        'LocalStorageModule',
        'toastr',
        'ngCookies',
        'fileSystem',
        'app.config',
        'lbServices',
        'commonModule',
        'iotModule',
        'watsonModule'
    ]);
    
    
    myworkstyle.config(function(toastrConfig) {
    	
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
    
    myworkstyle.run(['$rootScope','$location',function($rootScope, $location) {
        $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
            console.log('IN routeChangeStart >>>>>>> ');
             $rootScope.footerLinks = [];
        });
        
        $rootScope.currentUser = {permissions: {}};
        
        $rootScope.loadingScreen = $('<div style="position:fixed;top:0;left:0;right:0;bottom:0;z-index:10000;background-color:gray;background-color:rgba(70,70,70,0.2);"><img style="position:absolute;top:50%;left:50%;" alt="" src="/assets/images/loading.gif" /></div>')
        .appendTo($('body')).hide();

    }]);
     
    
    return myworkstyle;


});
