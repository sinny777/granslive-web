
define(['angular'], function (angular) {
    "use strict";

  var factory = function (LoopBackAuth, MyUser, UserIdentity, CONFIG, $cookies) {

	  var authUriBase = CONFIG.API_URL;

	  // Inherit from LoopBackAuth so we don't need to keep modifying it.
	  // Note that this method didn't work. I think because a new version of LoopBackAuth was used instead of the singleton.
	  //var Auth = Object.create(LoopBackAuth);
	  var Auth = LoopBackAuth;

	  /**
	   * Returns a url to be used for authentication.
	   */
	  Auth.authUri = function(provider) {
	    return authUriBase + provider;
	  };

	  Auth.currentUser = null;

	  /**
	   * Gets all available info on authenticated user
	   *
	   * @return {Object} user
	   */
	  Auth.ensureCurrentUser = function() {
	    if (Auth.currentUser) {
	      console.log('Using cached user');
	      return Auth.currentUser;
	    }
	    if(!Auth.isLoggedIn()) {
	      console.log('User not logged in.');
	      Auth.currentUser = null;
	      
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
	    		Auth.currentUserId = userId;
	    		Auth.accessTokenId = accessTokenId;
	    		Auth.rememberMe = true;
	    		var findUserReq = {filter: {where: {"_id": userId}}};
	    		MyUser.findById({id:userId}).$promise.then(function(userObj){
	    			console.log('userObj: >>>>>>>>>> ', userObj);
    				var findReq = {filter: {where: {"userId": userObj.id}}};
    				UserIdentity.find(findReq).$promise.then(function(UserIdentityObj){
	    				Auth.currentUser = userObj;
	    				Auth.currentUser.profile = UserIdentityObj[0].profile._json;
	    				console.log('$rootScope.currentUser: >>> ', $rootScope.currentUser);
	    				Auth.setUser(accessTokenId, userId, $rootScope.currentUser);
	    				Auth.save();
	    			});
	    		});
	        }
	      
	      return Auth.currentUser;
	    } else {
	      // Fetch the actual user data.
	      Auth.currentUser = MyUser.getCurrent(function(userData) {
	        console.log("Current User Fetch Success:", userData);
	        Auth.currentUser = userData;
    			console.log('USER OBJ: >>>>>> ', Auth.currentUser);
    			if(Auth.currentUser){
    				var findReq = {filter: {where: {"userId": userData.id}}};
    				UserIdentity.find(findReq).$promise.then(function(userIdentityObj){
    					console.log(userIdentityObj)
    					if(userIdentityObj && userIdentityObj[0]){
	    					Auth.currentUser.profile = userIdentityObj[0].profile._json;
		    				console.log('Auth.currentUser: >>> ', Auth.currentUser);
    					}else{
    						Auth.currentUser.profile = {"name": "Guest"};
    					}
	    			});
    			}
	        
	      },
	      function(err) {
	        console.log("Current User Fetch Failed:", err);
	      });
	    }
	    return Auth.currentUser;
	  };

	  /**
	   * Check if a user is logged in
	   *
	   * @return {Boolean}
	   */
	  Auth.isLoggedIn = function() {
	    if(Auth.currentUserId) {
	      return true;
	    }
	    return false;
	  };
	  
	  Auth.login = function(credentials) {
		  MyUser.login(credentials);
	  };

	  Auth.logout = function() {
		  MyUser.logout();
//		 Delete the user data cached locally.
		    Auth.currentUser = null;
		    Auth.clearUser();
		    Auth.clearStorage();
		    Auth.save();
		    $cookies.remove('access_token');
		    $cookies.remove('userId');
		    delete $cookies['access_token'];
		    delete $cookies['userId'];
	  };

	  /**
	   * Waits for currentUser to resolve before checking if user is logged in
	   */
	  Auth.isLoggedInAsync = function(cb) {
	    if(Auth.currentUser && Auth.currentUser.hasOwnProperty('$promise')) {
	      Auth.currentUser.$promise.then(function() {
	        cb(true);
	      }).catch(function() {
	        cb(false);
	      });
	    } else if(Auth.currentUser && Auth.currentUser.hasOwnProperty('role')) {
	      cb(true);
	    } else {
	      cb(false);
	    }
	  };

	  return Auth;
	
  }

	factory.$inject = ['LoopBackAuth', 'MyUser', 'UserIdentity', 'CONFIG', '$cookies'];
	return factory;
});

