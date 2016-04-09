module.exports = function(Audit) {
	
	Audit.definition.rawProperties.created.default =
		Audit.definition.properties.created.default = function() {
	    return new Date();
	  };

	  // Workaround for https://github.com/strongloop/loopback/issues/292
	  Audit.definition.rawProperties.modified.default =
	  Audit.definition.properties.modified.default = function() {
	    return new Date();
	  };
	
};
