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
    
    commonModule.factory('authService', require('common/services/authService'));
    
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
    

    return commonModule;

});
