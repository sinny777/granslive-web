define(function () {
    'use strict';

  function ctrl($rootScope, $scope, $http, $cookies, authService, Place){
	  
    $scope.fetchMyPlaces = function(){
    	console.log('IN fetchMyPlaces >>>>>>>>>> ', $rootScope.currentUser);
    	if(!$rootScope.currentUser.id){
    		$rootScope.currentUser = authService.ensureCurrentUser();
    	}
    	
    	if(!$rootScope.currentUser){
    		return;
    	}
    	
    	var findReq = {filter: {
    						where: {
    							"user.username": $rootScope.currentUser.username
    						}
    					}
    				  };
    	console.log(findReq);
    	
    	$scope.places = Place.find(findReq,
    			  function(list) { 
    			  /* success */ 
    				  console.log('PLACES FETCHED: >>>> ', list);
    			  },
	    		  function(errorResponse) { 
    				  /* error */ 
    				  console.log(errorResponse);
    			  });
    };

  }
  
  ctrl.$inject = ['$rootScope', '$scope', '$http', '$cookies', 'authService', 'Place'];
  return ctrl;

});

