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
	    console.log('IN Place.js, beforeRemote find method >>>>>>>');
	    var accessToken = context.req && context.req.accessToken;
		console.log('accessToken: >>> ', accessToken);
		var userId = accessToken && accessToken.userId;
	    console.log('userId: >>> ', userId);
	    var ownerId = context.query && context.query.where && context.query.where.ownerId;
	    
	    if(loopback){
	    	var curren
	    	tUser = loopback.getCurrentContext().get('currentUser');
	    	console.log('currentUser 1: >>>>> ', currentUser);
	    	if(currentUser){
	    		findMembers(currentUser.id);
	    	}
	    }
    	
	    next();
	  });
	  
	  Place.observe('access', function fetchGroups(ctx, next) {
		  console.log('IN Place.js, observe access method >>>>>>> Member ', Member);
		  var ownerId = ctx.query.where.ownerId;
		  console.log('IN Place.js, observe access method, ownerId >>>>>>> ', ownerId);
		  if(loopback){
		    	var currentUser = loopback.getCurrentContext().get('currentUser');
		    	console.log('currentUser 2: >>>>> ', currentUser);
		    	if(currentUser){
		    		findMembers(currentUser.id);
		    	}else{
		    		var accessToken = loopback.getCurrentContext() && loopback.getCurrentContext().get('accessToken');
		    		console.log('accessToken: >>> ', accessToken);
		    		var userId = accessToken && accessToken.userId;
		    	    console.log('userId: >>> ', userId);
		    	}
		    }
		  
		  findMembers(ctx, ownerId);
		  next();
		});
	  
	  findMembers = function(ctx, memberId){
		  var loopback = require('loopback');
		  console.log('IN Place.js, findMembers for memberId: >>> ');
		  var findReq = {filter: {where: {"username": "sinny777@gmail.com"}}};
		  /*
		  var Member = loopback.models.Member;
		  Member.find(findReq, function(err, members){
				if (err) {
			    	  console.log("\n\nERROR IN findMembers:>>>>>>>>>> ", err);
			    	  next();
			        return;
			      }
				console.log('MEMBERS RESP: >>>>>> ', members);
				
			});
			*/
	  }
	
};
