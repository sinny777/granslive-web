module.exports = function(Place) {
	
	// Workaround for https://github.com/strongloop/loopback/issues/292
	  Place.definition.rawProperties.created.default =
	    Place.definition.properties.created.default = function() {
	    return new Date();
	  };

	  // Workaround for https://github.com/strongloop/loopback/issues/292
	  Place.definition.rawProperties.modified.default =
	    Place.definition.properties.modified.default = function() {
	    return new Date();
	  };

};
