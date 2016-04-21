define(function () {
    'use strict';

  function ctrl($rootScope, $scope, CONFIG, authService, mqttService, dataService, Place, PlaceArea, Group){
	  
	  $scope.memberships = [];
	  $scope.places = [];
	  $scope.selectedPlace = {floor: 'Ground'};
	  $scope.display = 'places';
	  $scope.selectedPlaceArea = {};
	  
	  $scope.placeAreaTypes = ['living-room', 'bed-room', 'bath-room', 'kitchen', 'store', 'gallery', 'parking', 'balcony', 'other'];
	  $scope.floors = ['Ground'];
	  
	  $scope.$watch(
              "selectedPlace",
              function handleFooChange(newValue, oldValue ) {
                  console.log( "selectedPlace newValue:", newValue);
                  if(newValue.id){
                	  $scope.handlePermissions();
                	  mqttService.connectToMqtt($scope.onMqttMessageArrived, $scope.onMqttConnectionLost, $scope.mqttConnectSuccess);
                  }
              }
          );
	  
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
	  };
	  
	  $scope.handlePermissions = function(){
		  
		  if(!$rootScope.currentUser.permissions){
			  $rootScope.currentUser.permissions = {};
		  }
		  
		  if($scope.selectedPlace.id){
			  $rootScope.currentUser.permissions.placeOwner = $scope.selectedPlace.ownerId == $scope.ownerId;
		  }
	  };
	  
	  $scope.mqttConnectSuccess = function(){
   	   console.log('MQTT Connection SUCCESS >>>>>>>>>>');
	   	try{
			   mqttService.subscribeToMqtt(CONFIG.MQTT.TOPIC_PREFIX+$scope.selectedPlace.uniqueIdentifier+'/cloud');
		   }catch(err){
			   console.log('Error: >>> ', err);
		   }
      };
	  
	  $scope.onMqttMessageArrived = function(message) {
   	   console.log('onMqttMessageArrived >>>>>>>>>>' +message.payloadString);
          try{
       	   // Refresh Devices
          }catch(err){
              console.log(err);
          }
      };
      
      $scope.onMqttConnectionLost = function(responseObject) {
   	   console.log('MQTT Connection LOST >>>>>>>>>>');
          if (responseObject.errorCode !== 0){
              console.log("onConnectionLost:" + responseObject.errorMessage);
              pushService.connectToMqtt($scope.onMqttMessageArrived, $scope.onMqttConnectionLost, $scope.mqttConnectSuccess);
//              this.connectToMqtt();
          }
      };
	  
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
		  $scope.selectedPlaceArea = {};
		  $scope.display = "dashboard";
	  };
	  
	  $scope.showAddNewPlaceAreaPanel = function(){
		  console.log('IN showAddNewPlaceAreaPanel: ');
		  $scope.selectedPlaceArea = {};
		  $scope.display = "savePlaceAreaPanel";
	  };
	  
	  $scope.showUpdatePlaceAreaPanel = function(placeArea){
		  console.log('IN showUpdatePlaceAreaPanel: ');
		  $scope.selectedPlaceArea = placeArea;
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
	    	
	    	var email = $rootScope.currentUser.profile && $rootScope.currentUser.profile.email;
	    	if(!email){
	    		email = $rootScope.currentUser.email;
	    	}
	    	
	    	var findReq = {
	    					filter:{
			    			  		 where: {"or": [{"members": {"elemMatch": {"username": {"$eq": email}}}},
			    			  		                {"ownerId":$scope.ownerId}]}
	    				   		   }
	    					};
	    	console.log('findReq: >>> ', findReq);
	    	$rootScope.loadingScreen.show();
	    	Group.find(findReq,
	  			  function(list) { 
	    			  console.log('RESPONSE of GROUP.find: >>>>> ', list);
	  				  $scope.memberships = list;
	  				  $rootScope.loadingScreen.hide();
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
    	PlaceArea.upsert($scope.selectedPlaceArea,
		  function(placeArea) {
    		  if(!$scope.selectedPlace.placeAreas){
    			  $scope.selectedPlace.placeAreas = [];
    			  $scope.selectedPlace.placeAreas.push(placeArea);
    		  }else{
    			  var updated = false;
    			  angular.forEach($scope.selectedPlace.placeAreas, function(area) {
					  if(area.id == placeArea.id){
						  area = placeArea;
						  updated = true;
					  }
					});
    			  if(!updated){
    				  $scope.selectedPlace.placeAreas.push(placeArea); 
    			  }
    		  }
			  $scope.selectedPlaceArea = placeArea;
			  console.log('PLACE AREA SAVED: >>>> ', placeArea);
			  $rootScope.loadingScreen.hide();
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
    		PlaceArea.find(findReq,
      			  function(list) { 
    				  $scope.selectedPlace.placeAreas = list;
    				  $rootScope.loadingScreen.hide();
    				  angular.forEach($scope.selectedPlace.placeAreas, function(area) {
    					  $scope.fetchDevices(area);
    					});
      			  },
  	    		  function(errorResponse) { 
      				  $rootScope.loadingScreen.hide();
      				  console.log(errorResponse);
      			  });
    	}    	
    };
    
    $scope.fetchDevices = function(placeArea){
    	if(placeArea && placeArea.id){
    		console.log('FETCH DEVICES FOR PLACEAREA: ', placeArea);
    		dataService.getValue('placeArea1.devices', function(data){
    			console.log('RESP OF GET DATA:>>>  ', data);
    			placeArea.devices = data.placeArea1.devices;
    		});
    	}    	
    };
    
    $scope.toggleDevice = function(placeArea, device){
    	console.log('IN toggleDevice, device: >> ', device);
    	if(device.status == 'ON'){
    		device.status = 'OFF';
    		device.value = 0;
    	}else{
    		device.status = 'ON';
    		device.value = 1;
    	}
    	
    	var msg = '#'+device.parentId+'#'+device.deviceIndex+'#'+device.value;
    	
    	mqttService.publishToMqtt(CONFIG.MQTT.TOPIC_PREFIX+device.parentId+'/gateway', msg, $scope.onMqttMessageArrived);
    };
    
    $scope.getDeviceIconClass = function(device){
    	console.log('IN getDeviceIconClass:>>>> ', device);
    	var cssClass = '';
    	if(device.status > 0){
    		cssClass = device.type + '_ON';
    	}
    	if(device.status < 1){
    		cssClass = device.type + '_OFF';
    	}
    	return cssClass;    	
    };
    
  }
  
  ctrl.$inject = ['$rootScope', '$scope', 'CONFIG', 'authService', 'mqttService', 'dataService', 'Place', 'PlaceArea', 'Group'];
  return ctrl;

});

