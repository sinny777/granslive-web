module.exports = function(Board) {
	
	Board.observe('before save', function updateTimestamp(ctx, next) {
		console.log('\n\nInside Board.js before save: ');
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

};
