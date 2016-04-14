var loopback = require('loopback');

module.exports = function(Place, Member) {
	
	Place.observe('before save', function updateTimestamp(ctx, next) {
		console.log('\n\nInside Place.js before save: ');
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
	
	// remote method before hook
	  Place.beforeRemote('find', function(context, unused, next) {
	    var accessToken = context.req && context.req.accessToken;
		var userId = accessToken && accessToken.userId;
	    var ownerId = context.query && context.query.where && context.query.where.ownerId;
	    if(loopback){
	    	var currentUser = loopback.getCurrentContext().get("currentUser");
	    	console.log("IN place.js current userId: ", userId, ", query: ", context.filter+", currentUser: ", currentUser);
	    	if(currentUser){
	    		findMembers(currentUser.id);
	    	}
	    }
    	
	    next();
	  });
	  
	  findMembers = function(memberId){
		  console.log('IN place.js, findMembers for memberId: ', memberId);
		  var loopback = require('loopback');
		  var findReq = {filter: {where: {"username": "sinny777@gmail.com"}}};
	  }
	
};
