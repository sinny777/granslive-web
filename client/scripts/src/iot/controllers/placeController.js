define(function () {
    'use strict';

  function ctrl($rootScope, $scope, authService, Place, PlaceArea){
	  
	  $scope.places = [];
	  $scope.selectedPlace = {};
	  $scope.show = {areas: false, addAreaPanel: false};
	  $scope.selectedPlaceArea = {};
	  
	  $scope.placeAreaTypes = ['LIVING_ROOM', 'BED_ROOM', 'BATHROOM', 'KITCHEN', 'STORE', 'GALLERY', 'PARKING', 'BALCONY', 'OTHER'];
	  $scope.floors = ['Ground'];
	  
	  $scope.initPlacesPage = function(){
		  $scope.floors = ['Ground'];
		  for(var i = 1; i <= 150; i++){
			  $scope.floors.push(''+i);
		  }
		  if($scope.places.length == 0){
			  $scope.fetchMyPlaces();
		  }
	  }
	  
    $scope.fetchMyPlaces = function(){
    	console.log('IN fetchMyPlaces >>>>>>>>>> ', $rootScope.currentUser);
    	if(!$rootScope.currentUser.id){
    		$rootScope.currentUser = authService.ensureCurrentUser();
    	}
    	if(!$rootScope.currentUser){
    		return;
    	}
    	var findReq = {filter: {where: {"user.username": $rootScope.currentUser.username}}};
    	console.log(findReq);
    	$scope.show.areas = false;
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
    		var findReq = {filter: {where: {placeId: $scope.selectedPlace.id}}};
    		$scope.selectedPlace.placeAreas = PlaceArea.find(findReq,
      			  function(list) { 
    				  $scope.selectedPlace.placeAreas = list;
    				  $scope.show.areas = true;
      			  },
  	    		  function(errorResponse) { 
      				  console.log(errorResponse);
      			  });
    	}    	
    };
    
    $scope.showPlaceAreasPanel = function(){
    	$scope.selectedPlaceArea = {};
    	if($scope.places.length == 0){
			  $scope.fetchMyPlaces();
		}
    	$scope.show.areas = true;
    	$scope.show.addAreaPanel = false;
    };
    
    $scope.showAddAreaPanel = function(){
    	$scope.selectedPlaceArea = {};
    	$scope.show.areas = false;
    	$scope.show.addAreaPanel = true;
    };
    

  }
  
  ctrl.$inject = ['$rootScope', '$scope', 'authService', 'Place', 'PlaceArea'];
  return ctrl;

});

