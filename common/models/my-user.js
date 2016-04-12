module.exports = function(MyUser) {
	
	var loopback = require('loopback');

	MyUser.observe('before save', function updateTimestamp(ctx, next) {
		console.log('\n\nInside MyUser.js before save: ');
		  if (ctx.instance) {
			  if(!ctx.instance.audit){
				  ctx.instance.audit = {};
			  }
			  if(!ctx.instance.id){
				  ctx.instance.audit.created = new Date();
			  }
		    ctx.instance.audit.modified = new Date();
		  } else {
			  if(!ctx.data.audit){
				  ctx.data.audit = {};
			  }
			  ctx.data.audit.modified = new Date();
			  
		  }
		  next();
		});
	
	MyUser.afterRemote('login', function(context, remoteMethodOutput, next) {
	    console.log('\n\nIN MyUser.js, afterRemote login method, remoteMethodOutput >>>>>>>', remoteMethodOutput);
	    
	    if(loopback){
	    	loopback.getCurrentContext().set('currentUser', remoteMethodOutput);
	    	console.log('CurrentUser set in loopbackContext successfully >>>>>> ', loopback.getCurrentContext().get('currentUser'));
	    }
    	
	    next();
	  });
	
};
