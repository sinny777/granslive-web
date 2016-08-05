module.exports = function(Board) {
	
	Board.observe('before save', function updateTimestamp(ctx, next) {
		console.log('\n\nInside Board.js before save: ');
		  var board = {};
		  if (ctx.instance) {
			  board = ctx.instance;
			  if(!board.audit){
				  board.audit = {};
			  }
			  if(!board.id){
				  board.audit.created = new Date();
				  board.status = "inactive";
			  }
			  board.audit.modified = new Date();
		  } else {
			  board = ctx.data;
			  if(!board.audit){
				  board.audit = {};
			  }
			  board.audit.modified = new Date();
		  }
		  
		  if(!board.uniqueIdentifier){
			  //TODO: Board should always have a UniquiId set before it is sent for saving
			  board.uniqueIdentifier = generateUUID();
		  }
		  
		 return next();
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
