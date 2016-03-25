
define(['angular'], function (angular) {
    "use strict";

  var factory = function (LoopBackAuth, User, CONFIG) {

	  var authUriBase = "http://localhost:3000/api/";

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
	      return Auth.currentUser;
	    }
	    else {
	      // Fetch the actual user data.
	      Auth.currentUser = User.getCurrent(function(userData) {
	        console.log("Current User Fetch Success:", userData);
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

	  Auth.logout = function() {
		  User.logout();
//		 Delete the user data cached locally.
		    Auth.currentUser = null;
		    Auth.clearUser();
		    Auth.clearStorage();
		    Auth.save();
	    // Delete the token from the API.
//		    this.logout();
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

	factory.$inject = ['LoopBackAuth', 'User', 'CONFIG'];
	return factory;
});

