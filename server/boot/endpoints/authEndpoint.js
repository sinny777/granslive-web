module.exports = function(app) {
	
	app.get('/auth/account', function(req, res, next) {
		console.log('IN auth/account: >>> ', req.user);
		console.log(req.accessToken);
		
		var User = app.models.User;
		var UserIdentity = app.models.UserIdentity;
		
		User.findById(req.user.id, function(err, userObj){
			if (err) {
		    	  console.log("\n\nERROR IN User.findById:>>>>>>>>>> ", err);
		    	  next();
		        return;
		      }
			console.log('USER OBJ: >>>>>> ', userObj);
			app.currentUser = userObj;
			res.locals.currentUser = userObj;
			var loopbackContext = app.loopback.getCurrentContext();
		    if (loopbackContext) loopbackContext.set('currentUser', userObj);
		});
		
		res.redirect('/#!/home');
		
	  });
	  
};