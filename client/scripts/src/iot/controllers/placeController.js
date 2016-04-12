define(function () {
    'use strict';

  function ctrl($rootScope, $scope, authService, Place, PlaceArea, Member){
	  
	  $scope.memberships = [];
	  $scope.places = [];
	  $scope.selectedPlace = {floor: 'Ground'};
	  $scope.display = 'places';
	  $scope.selectedPlaceArea = {};
	  
	  $scope.placeAreaTypes = ['LIVING_ROOM', 'BED_ROOM', 'BATHROOM', 'KITCHEN', 'STORE', 'GALLERY', 'PARKING', 'BALCONY', 'OTHER'];
	  $scope.floors = ['Ground'];
	  
	  $scope.initPlacesPage = function(){
		  console.log('IN initPlacesPage for User >>>>>>>>>> ', $rootScope.currentUser);
		  $rootScope.checkUser(function(currentUser){
			  $rootScope.currentUser = currentUser;
			  if(!$rootScope.currentUser){
		    		return;
		    	}
			  
		    	$scope.ownerId = $rootScope.currentUser.id;
		    	if($rootScope.currentUser.userId){
		    		$scope.ownerId = $rootScope.currentUser.userId;
		    	}
			  
			  $scope.floors = ['Ground'];
			  for(var i = 1; i <= 150; i++){
				  $scope.floors.push(''+i);
			  }
			  if($scope.places.length == 0){
				  $scope.fetchMyMembership();
			  }
		  });
	  }
	  
	  $scope.showAddNewPlacePanel = function(){
		  console.log('IN showAddNewPlacePanel: ');
		  $scope.selectedPlace = {floor: 'Ground'};
		  $scope.display = "savePlacePanel";
	  };
	  
	  $scope.showUpdatePlacePanel = function(){
		  console.log('IN showUpdatePlacePanel: ');
		  $scope.display = "savePlacePanel";
	  };
	  
	  $scope.showPlaces = function(){
		  console.log('IN showPlaces: ');
		  if($scope.places.length == 0){
			  $scope.fetchMyMembership();
		  }if($scope.places.length == 1){
			  $scope.selectedPlace = $scope.places[0];
			  $scope.showDashboard();
		  }else{
			  $scope.display = "places";
		  }
	  };
	  
	  $scope.showDashboard = function(){
		  console.log('IN showDashboard: ');
		  $scope.display = "dashboard";
	  };
	  
	  $scope.showAddNewPlaceAreaPanel = function(){
		  console.log('IN showAddNewPlaceAreaPanel: ');
		  $scope.selectedPlaceArea = {};
		  $scope.display = "savePlaceAreaPanel";
	  };
	  
	  $scope.showUpdatePlaceAreaPanel = function(){
		  console.log('IN showUpdatePlaceAreaPanel: ');
		  $scope.display = "savePlaceAreaPanel";
	  };
	  
	  $scope.showDashBoardForPlace = function(place){
		  console.log('IN showDashBoardForPlace: ', place);
		  $scope.selectedPlace = place;
		  $scope.showDashboard();
	  };
	  
	  $scope.showGroups = function(){
		  console.log('IN showGroups: ');
		  $scope.display = "groups";
	  };
	  
	  $scope.fetchMyMembership = function(){
	    	console.log('IN fetchMyMembership for User >>>>>>>>>> ', $rootScope.currentUser);
	    	
	    	var username = $rootScope.currentUser.profile && $rootScope.currentUser.profile.username;
	    	if(!username){
	    		username = $rootScope.currentUser.username;
	    	}
	    	var email = $rootScope.currentUser.profile && $rootScope.currentUser.profile.email;
	    	if(!email){
	    		email = $rootScope.currentUser.email;
	    	}
	    	
	    	var findReq = {"filter": {"where": {"or": [{"username":username}, {"username":email}]}}};
	    	console.log(findReq);
	    	$rootScope.loadingScreen.show();
	    	Member.find(findReq,
			  function(list) { 
				  $rootScope.loadingScreen.hide();
				  $scope.memberships = list;
				  $scope.fetchMyPlaces();
			  },
    		  function(errorResponse) { 
				  $rootScope.loadingScreen.hide();
				  console.log(errorResponse);
				  $scope.fetchMyPlaces();
			  });
	    };
	  
    $scope.fetchMyPlaces = function(){
    	console.log('IN fetchMyPlaces for User >>>>>>>>>> ', $rootScope.currentUser);
    	console.log('MEMBERSHIPS: >>>> ', $scope.memberships);
    	var findReq = {filter: {where: {or: [{ownerId: $scope.ownerId}]}}};
    	var placeIds = [];
		  angular.forEach($scope.memberships, function(membership) {
			  placeIds.push(membership.placeId);
			});
		if(placeIds.length > 0){
			findReq.filter.where.or.push({id: {inq: placeIds}});
		} 
    	console.log(findReq);
    	$rootScope.loadingScreen.show();
    	$scope.places = Place.find(findReq,
    			  function(list) { 
    				  $rootScope.loadingScreen.hide();
    				  $scope.places = list;
    				  $scope.display = 'places';
    				  if($scope.places && $scope.places.length == 1){
						  $scope.selectedPlace = $scope.places[0];
						  $scope.display = 'dashboard';
						  $scope.fetchPlaceAreas();
					  }    				  
    				  
    				  angular.forEach($scope.places, function(place) {
    					  console.log('PLACE FETCHED: >>>> ', place);
    					  if(place.isDefault){
    						  $scope.selectedPlace = place;
    						  $scope.display = 'dashboard';
    						  $scope.fetchPlaceAreas();
    					  }
    					});
    			  },
	    		  function(errorResponse) { 
    				  $rootScope.loadingScreen.hide();
    				  console.log(errorResponse);
    			  });
    };
    
    $scope.savePlace = function(){
    	$scope.selectedPlace.ownerId = $rootScope.currentUser.userId;
    	$rootScope.loadingScreen.show();
    	$scope.selectedPlace = Place.create($scope.selectedPlace,
		  function(place) { 
    		$rootScope.loadingScreen.hide();
			$scope.selectedPlace = place;
			console.log('PLACE SAVED: >>>> ', place);
			$scope.showPlaces();
		  },
		  function(errorResponse) { 
			  $rootScope.loadingScreen.hide();
			  console.log(errorResponse);
			  $scope.showPlaces();
		  });
    };
    
    $scope.deletePlace = function(){
    	$scope.selectedPlace.ownerId = $rootScope.currentUser.id;
    	$rootScope.loadingScreen.show();
    	$scope.selectedPlace = Place.deleteById({id: $scope.selectedPlace.id},
		  function(resp) { 
			console.log('PLACE DELETED: >>>> ', resp);
			$scope.selectedPlace = {};
			$scope.showPlaces();
			$rootScope.loadingScreen.hide();
		  },
		  function(errorResponse) { 
			  $rootScope.loadingScreen.hide();
			  console.log(errorResponse);
			  $scope.showPlaces();
		  });
    };
    
    $scope.savePlaceArea = function(){
    	
    	if($scope.selectedPlace.id){
    		$scope.selectedPlaceArea.placeId = $scope.selectedPlace.id;
    	}else{
    		alert('Place Area can not be created without selecting a Place !');
    		console.log('Place Area can not be created without selecting a Place !');
    		return;
    	}
    	
    	$rootScope.loadingScreen.show();
    	$scope.selectedPlaceArea = PlaceArea.create($scope.selectedPlaceArea,
		  function(placeArea) {
    		  $rootScope.loadingScreen.hide();
			  $scope.selectedPlaceArea = placeArea;
			  console.log('PLACE AREA SAVED: >>>> ', placeArea);
			  $scope.showDashboard();
		  },
		  function(errorResponse) { 
			  $rootScope.loadingScreen.hide();
			  console.log(errorResponse);
			  $scope.showDashboard();
		  });
    };
    
    $scope.fetchPlaceAreas = function(){
    	if($scope.selectedPlace.id){
    		console.log('FETCH AREAS FOR PLACE: ', $scope.selectedPlace);
    		var findReq = {filter: {where: {placeId: $scope.selectedPlace.id}}};
    		$rootScope.loadingScreen.show();
    		$scope.selectedPlace.placeAreas = PlaceArea.find(findReq,
      			  function(list) { 
    				  $rootScope.loadingScreen.hide();
    				  $scope.selectedPlace.placeAreas = list;
      			  },
  	    		  function(errorResponse) { 
      				  $rootScope.loadingScreen.hide();
      				  console.log(errorResponse);
      			  });
    	}    	
    };
    
  }
  
  ctrl.$inject = ['$rootScope', '$scope', 'authService', 'Place', 'PlaceArea', 'Member'];
  return ctrl;

});

