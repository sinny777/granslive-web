define(function () {
    'use strict';

  function ctrl($rootScope, $scope, $cookies, $location, authService, User, UserIdentity){
	  
	  $rootScope.footerLinks = [];
	  $rootScope.currentUser = {};
	  
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
	    		var cookies = $cookies.getAll();
		    	var accessTokenId = cookies['access_token'];
		    	if(accessTokenId){
		    		accessTokenId = accessTokenId.split('.')[0];
			    	accessTokenId = accessTokenId.split(':')[1];
		    	}
		    	console.log('accessTokenId: >>>> ' +accessTokenId);		    	
		    	if(accessTokenId){
		    		var userId = cookies['userId'];
		    		if(userId){
		    			userId = userId.split('.')[0];
		    			userId = userId.split(':')[1];
			    	}
		    		console.log('userId: >>>> ' +userId);
		    		authService.currentUserId = userId;
		    		authService.accessTokenId = accessTokenId;
		    		authService.rememberMe = true;
		    		
		    		UserIdentity.user({id: userId}, function(userObj){
		    			console.log('USER OBJ: >>>>>> ', userObj);
		    			if(userObj){
		    				var findReq = {filter: {where: {"userId": userObj.id}}};
		    				UserIdentity.find(findReq).then(function(userIdentityObj){
			    				$rootScope.currentUser = userObj;
			    				$rootScope.currentUser.profile = userIdentityObj[0].profile._json;
			    				console.log('$rootScope.currentUser: >>> ', $rootScope.currentUser);
			    				authService.setUser(accessTokenId, userId, $rootScope.currentUser);
			    				authService.save();
			    			});
		    			}
		    		});
		        }
	    	}
	    	
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
  
  ctrl.$inject = ['$rootScope', '$scope', '$cookies', '$location', 'authService','User', 'UserIdentity'];
  return ctrl;

});

