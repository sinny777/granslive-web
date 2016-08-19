
var crypto = require('crypto');

module.exports = function() {
    
var methods = {};
  	
	methods.random = function(howMany, chars) {
	    chars = chars 
	        || "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ23456789";
	    var rnd = crypto.randomBytes(howMany)
	        , value = new Array(howMany)
	        , len = chars.length;
	
	    for (var i = 0; i < howMany; i++) {
	        value[i] = chars[rnd[i] % len]
	    };
	
	    return value.join('');
	};
	
    return methods;
    
}