/*global define */

//API_URL: 'https://granslive-web.mybluemix.net/api'

define(['angular'], function (angular) {
	'use strict';
  
	return angular.module('app.config', [])
		.constant('CONFIG', {
			VERSION: '0.1',
			ENVIRONMENT: 'DEV',
			API_URL: 'http://localhost:3000/api',
			MQTT: {
				broker: '52.76.33.2',
				port: 9001
			}
		});
    
});