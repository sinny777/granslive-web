define(function () {
    'use strict';

  function ctrl($rootScope, $scope, authService, Place, PlaceArea){
	  
	  $scope.places = [];
	  $scope.selectedPlace = {};
	  
	  
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
    				  $scope.places = list;
    				  angular.forEach($scope.places, function(place) {
    					  console.log('PLACE FETCHED: >>>> ', place);
    					  if(place.isDefault){
    						  $scope.selectedPlace = place;
    						  $scope.fetchPlaceAreas();
    					  }
    					});
    			  },
	    		  function(errorResponse) { 
    				  console.log(errorResponse);
    			  });
    };
    
    $scope.fetchPlaceAreas = function(){
    	if($scope.selectedPlace.id){
    		console.log('FETCH AREAS FOR PLACE: ', $scope.selectedPlace);
    		var findReq = {filter: {
				where: {
					"placeId": $scope.selectedPlace.id
				}
			}
		  };
    		$scope.selectedPlace.placeAreas = PlaceArea.find(findReq,
      			  function(list) { 
    				  $scope.selectedPlace.placeAreas = list;
      			  },
  	    		  function(errorResponse) { 
      				  console.log(errorResponse);
      			  });
    	}    	
    };

  }
  
  ctrl.$inject = ['$rootScope', '$scope', 'authService', 'Place', 'PlaceArea'];
  return ctrl;

});

