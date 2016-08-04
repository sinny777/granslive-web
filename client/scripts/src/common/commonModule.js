define(function (require) {
    'use strict';

    var angular = require('angular'),
	config = require('config'),
	ngRoute = require('angularRoute'),
	ngStorage = require('angularLocalStorage'),
//	uiBootstrap = require('ui.bootstrap'),
    commonModule = angular.module('commonModule', ['ngRoute',
                                                   'ngAnimate',
                                                   'LocalStorageModule',
//                                                   'ui.bootstrap',
                                                   'app.config']);
//    config = require('common/config/config')(commonModule);
    
    commonModule.factory('authService', require('common/services/authService'));
    commonModule.factory('mqttService', require('common/services/mqttService'));
    
    commonModule.controller('commonController', require('common/controllers/commonController'));

    commonModule.directive('fileModel', require('common/directives/fileModelDirective'));
    commonModule.directive('toggle', require('common/directives/toggleDirective'));
    
    commonModule.filter('interpolate', ['version', function(version) {
        return function(text) {
            return String(text).replace(/\%VERSION\%/mg, version);
          }
        }  
        ]).
        filter('unsafe', ['$sce', function($sce) {
          return function(val) {
          	return $sce.trustAsHtml(val);
            }
          }  
        ]);
    
    commonModule.config(['$routeProvider',
                         function($routeProvider) {
		$routeProvider.
			when('/home', {
				templateUrl: 'scripts/src/common/partials/home.html',
				controller: 'commonController',
				controllerAs: 'vm',
				access: { requiredLogin: false }
			});
	}]);
    

    return commonModule;

});
