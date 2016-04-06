define(function () {
    'use strict';

  function ctrl($rootScope, $scope, $cookies, $location, authService, User, UserIdentity){
	  
	  $rootScope.footerLinks = [];
	  $rootScope.currentUser = {};
	  $rootScope.loginCredentials = {};
	  
	  $rootScope.gotoTop = function (){
	      $('body,html').animate({scrollTop:0},400);
	    };

    $rootScope.initNavBar = function(){
    //  commonService.pageLoadCalls();
    	
    };
	  
	    $rootScope.checkUser = function(){
	    	console.log("IN checkUser: >>>>>>>> ", $rootScope.currentUser);
	    	
	    	if(!$rootScope.currentUser || !$rootScope.currentUser.id){
	    		$rootScope.currentUser = authService.ensureCurrentUser();
	    	}
	    	
	    	if(!$rootScope.currentUser){
	    		// redirect to login page
	    	}
	    	
	    };

    $rootScope.login = function(){
    	console.log("IN LOGIN Call for: ", $rootScope.loginCredentials); 
    	authService.login($rootScope.loginCredentials, function(userObj){
    		console.log('USER OBJ AFTER LOGIN: >>>>>> ', userObj);
    		$rootScope.checkUser();
    	});
      };  
	    
    $rootScope.logout = function(){
    	console.log("IN LOGOUT Call for: ", $rootScope.currentUser); 
    	setTimeout(function () {
            $scope.$apply(function () {
            	$rootScope.currentUser = {};
            });
        }, 1000);
    	
    	authService.logout();
    	$location.path("/#!/home");
    	
      };
    
  }
  
  ctrl.$inject = ['$rootScope', '$scope', '$cookies', '$location', 'authService', 'User', 'UserIdentity'];
  return ctrl;

});

