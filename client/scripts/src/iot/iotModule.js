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

    iotModule.directive('fileModel', require('common/directives/fileModelDirective'));
    iotModule.directive('toggle', require('common/directives/toggleDirective'));
    
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
    

    return iotModule;

});
