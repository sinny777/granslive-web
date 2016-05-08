module.exports = function(Board) {
	
	Board.observe('before save', function updateTimestamp(ctx, next) {
		console.log('\n\nInside Board.js before save: ');
		  if (ctx.instance) {
			  var board = ctx.instance;
			  if(!board.audit){
				  board.audit = {};
			  }
			  if(!board.id){
				  board.audit.created = new Date();
				  board.status = "inactive";
			  }
			  board.audit.modified = new Date();
			  if(!board.uniqueIdentifier){
				  board.uniqueIdentifier = generateUUID();
			  }
			  
		  } else {
			  if(!ctx.data.audit){
				  ctx.data.audit = {};
			  }
			  ctx.data.audit.modified = new Date();
			  
		  }
		  next();
		});
	
	function generateUUID() {
	    var d = new Date().getTime();
	    var uuid = 'yxxx-yxxx-yxxx'.replace(/[xy]/g,function(c) {
	        var r = (d + Math.random()*8)%8 | 0;
	        d = Math.floor(d/16);
	        return (c=='x' ? r : (r&0x7|0x8)).toString(16);
	    });
	    return uuid.toUpperCase();
	};
	
};
