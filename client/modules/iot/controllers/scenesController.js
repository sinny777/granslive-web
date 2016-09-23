define(function () {
    'use strict';

  function ctrl($rootScope, $scope, Scene){
	  
	  $scope.display = 'scenes';
	  $scope.selectedScene = {};
	  $scope.sceneTypes = ['TIME', 'TEMPERATURE', 'HUMIDITY', 'LIGHT', 'COMBINATION'];
	  
	  $scope.initScenes = function(){
		  $scope.fetchAndShowScenes();
	  }
	  
	  $scope.fetchAndShowScenes = function(){
		  console.log('IN fetchAndShowScenes: ', $scope.selectedPlace.scenes);
		  $scope.selectedScene = {};
		  if(!$scope.selectedPlace.scenes || $scope.selectedPlace.scenes.length == 0){
			  $scope.fetchScenes();
		  }else{
			  $scope.display = "scenes";
		  }
	  };
	  
	  $scope.showAddNewScenePanel = function(){
		  console.log('IN showAddNewScenePanel: ');
		  $scope.selectedScene = {};
		  $scope.display = "saveScenePanel";
	  };
	  
	  $scope.showUpdateScenePanel = function(scene){
		  console.log('IN showUpdateScenePanel for Scene: ', scene);
		  $scope.selectedScene = scene;
		  $scope.display = "saveScenePanel";
	  };
	  
	  
    $scope.fetchScenes = function(){
    	console.log('IN fetchScenes for Place >>>>>>>>>> ', $scope.selectedPlace);
    	$rootScope.loadingScreen.show();
    	var ownerId = $rootScope.currentUser.id;
    	if($rootScope.currentUser.userId){
    		ownerId = $rootScope.currentUser.userId;
    	}
    	
    	var email = $rootScope.currentUser.profile && $rootScope.currentUser.profile.email;
    	if(!email){
    		email = $rootScope.currentUser.email;
    	}
    	
    	var findReq = {
    			  		 where: {"placeId": $scope.selectedPlace.id}
				};
    	
    	var findReq = {
				filter:{
							where: {"placeId": $scope.selectedPlace.id}
						}
					   };
    	
    	console.log('findReq: >>> ', findReq);
    	
    	Scene.find(findReq,
    			  function(list) { 
    				  $rootScope.loadingScreen.hide();
    				  $scope.selectedPlace.scenes = list;
    				  console.log("SCENES FETCHED :>>> ", list);
    				  $scope.display = 'scenes';
    			  },
	    		  function(errorResponse) { 
    				  console.log(errorResponse);
    				  $scope.display = 'scenes';
    				  $rootScope.loadingScreen.hide();
    			  });
    };
    
    $scope.saveScene = function(){
    	console.log('$rootScope.currentUser: >> ', $rootScope.currentUser);
    	console.log('$scope.selectedPlace: >> ', $scope.selectedPlace);
    	var ownerId = $rootScope.currentUser.id;
    	if($rootScope.currentUser.userId){
    		ownerId = $rootScope.currentUser.userId;
    	}
    	$scope.selectedScene.ownerId = ownerId;
    	$scope.selectedScene.placeId = $scope.selectedPlace.id;
    	console.log('IN saveScene: >>>>>', $scope.selectedScene);
    	
    	$rootScope.loadingScreen.show();
    	$scope.selectedScene = Scene.upsert($scope.selectedScene,
		  function(scene) { 
    		$rootScope.loadingScreen.hide();
			$scope.selectedScene = scene;
			console.log('SCENE SAVED: >>>> ', scene);
			$scope.fetchAndShowScenes();
		  },
		  function(errorResponse) {
			  $rootScope.loadingScreen.hide();
			  console.log(errorResponse);
			  $scope.fetchAndShowScenes();
		  });
    };
    
    $scope.toggleDevice = function(device){
    	console.log('IN toggleDevice, device: >> ', device);
    	if(device.status == 'ON'){
    		device.status = 'OFF';
    		device.value = 0;
    	}else{
    		device.status = 'ON';
    		device.value = 1;
    	}
    };
    
    
  }
  
  ctrl.$inject = ['$rootScope', '$scope', 'Scene'];
  return ctrl;

});

