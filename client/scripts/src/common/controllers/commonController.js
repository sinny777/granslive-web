define(function () {
    'use strict';

  function ctrl($rootScope, $scope, $cookies, $location, authService){
	  
	  $rootScope.footerLinks = [];
	  $rootScope.loginCredentials = {};
	  
	  $rootScope.gotoTop = function (){
	      $('body,html').animate({scrollTop:0},400);
	    };

    $rootScope.initNavBar = function(){
    //  commonService.pageLoadCalls();
    	
    };
	  
    $rootScope.checkUser = function(callback){
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
    
  }
  
  ctrl.$inject = ['$rootScope', '$scope', '$cookies', '$location', 'authService'];
  return ctrl;

});

