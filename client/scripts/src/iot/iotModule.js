define(function (require) {
    'use strict';

    var angular = require('angular'),
	config = require('config'),
	ngRoute = require('angularRoute'),
	ngStorage = require('angularLocalStorage'),
//	uiBootstrap = require('ui.bootstrap'),
    iotModule = angular.module('iotModule', ['ngRoute',
                                                   'ngAnimate',
                                                   'LocalStorageModule',
//                                                   'ui.bootstrap',
                                                   'app.config']);
    
    iotModule.factory('authService', require('common/services/authService'));
    
    iotModule.controller('placeController', require('iot/controllers/placeController'));
    iotModule.controller('groupsController', require('iot/controllers/groupsController'));
    
    iotModule.directive('fileModel', require('common/directives/fileModelDirective'));
    iotModule.directive('toggle', require('common/directives/toggleDirective'));
    iotModule.directive('groupsDirective', require('iot/directives/groupsDirective'));
    
    iotModule.filter('interpolate', ['version', function(version) {
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
    
    iotModule.config(['$routeProvider',
                         function($routeProvider) {
		$routeProvider.
			when('/places', {
	            templateUrl: 'scripts/src/iot/partials/places.html',
	            controller: 'placeController',
	            controllerAs: 'vm',
	            access: { requiredLogin: false }
	        }).
	        otherwise({
	            redirectTo: '/home'
	        });
	}]);
    

    return iotModule;

});
