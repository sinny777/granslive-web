define(function () {
    'use strict';

  function ctrl($rootScope, $scope, $cookies, $location, CONFIG, authService, mqttService){
	  
	  $rootScope.footerLinks = [];
	  $rootScope.loginCredentials = {};
	  
	  $rootScope.gotoTop = function (){
	      $('body,html').animate({scrollTop:0},400);
	    };

    $rootScope.initNavBar = function(){
    //  commonService.pageLoadCalls();
    };
	  
    $rootScope.checkUser = function(callback){
//    	$rootScope.initializeMQTT();
    	$rootScope.loadingScreen.show();
    	if(!$rootScope.currentUser || !$rootScope.currentUser.id){
    		authService.ensureCurrentUser(function(currentUser){
    			$rootScope.loadingScreen.hide();
    			$rootScope.currentUser = currentUser;
    			console.log("IN checkUser 2: >>>>>>>> ", $rootScope.currentUser);
    			if(callback){
    				callback($rootScope.currentUser);
    			}
    		});
    	}else{
    		$rootScope.loadingScreen.hide();
    		if(callback){
				callback($rootScope.currentUser);
			}
    	}
    };

    $rootScope.login = function(){
    	authService.login($rootScope.loginCredentials, function(userObj){
    		console.log('USER OBJ AFTER LOGIN: >>>>>> ', userObj);
    		$rootScope.currentUser = userObj;
    	});
      };  
	    
    $rootScope.logout = function(){
    	console.log("IN LOGOUT Call for: ", $rootScope.currentUser); 
    	authService.logout(function(){
    		$rootScope.currentUser = {};
    		$location.path("/#!/home");
    	});
    	/*
    	setTimeout(function () {
            $scope.$apply(function () {
            	$rootScope.currentUser = {};
            });
        }, 1000);
        */
    	
      };
      
      /*
      $rootScope.mqttConnectSuccess = function(){
      	   console.log('MQTT Connection SUCCESS >>>>>>>>>>');
   	   	try{
   	   		mqttService.subscribeToMqtt(CONFIG.MQTT.TOPIC_PREFIX+'36149'+'/cloud');
   		   }catch(err){
   			   console.log('Error: >>> ', err);
   		   }
         };
   	  
         $rootScope.onMqttMessageArrived = function(message) {
      	   console.log('onMqttMessageArrived >>>>>>>>>>' +message.payloadString);
             try{
          	   // Refresh Devices
             }catch(err){
                 console.log(err);
             }
         };
         
         $rootScope.onMqttConnectionLost = function(responseObject) {
      	   console.log('MQTT Connection LOST >>>>>>>>>>');
             if (responseObject.errorCode !== 0){
                 console.log("onConnectionLost:" + responseObject.errorMessage);
                 mqttService.connectToMqtt($scope.onMqttMessageArrived, $scope.onMqttConnectionLost, $scope.mqttConnectSuccess);
//                 this.connectToMqtt();
             }
         };
      
      $rootScope.initializeMQTT = function(){
    	  mqttService.connectToMqtt($scope.onMqttMessageArrived, $scope.onMqttConnectionLost, $scope.mqttConnectSuccess);
      };
      
      */
    
  }
  
  ctrl.$inject = ['$rootScope', '$scope', '$cookies', '$location', 'CONFIG', 'authService', 'mqttService'];
  return ctrl;

});

