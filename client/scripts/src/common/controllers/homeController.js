define(function () {
    'use strict';

  function ctrl($rootScope, $scope, $http, $cookies, authService){
	  
    $scope.fetchPlaces = function(){
    	console.log('IN fetchPlaces >>>>>>>>>> ');
    	/*var req = {
    			 method: 'GET',
    			 url: '/resources/homelinks.json',
    			 headers: {
    			   'Accept': 'application/json'
    			 } 
    			}

		$http(req).then(function(data){
			$scope.homeLinks = data.data;
			//console.log(JSON.stringify($scope.homeLinks.data));    				
		}, function(err){
			console.log(err);
		});*/
    };

  }
  
  ctrl.$inject = ['$rootScope', '$scope', '$http', '$cookies', 'authService'];
  return ctrl;

});

