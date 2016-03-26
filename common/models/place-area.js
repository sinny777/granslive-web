module.exports = function(PlaceArea) {
	
	  PlaceArea.definition.rawProperties.created.default =
	    PlaceArea.definition.properties.created.default = function() {
	    return new Date();
	  };

	  PlaceArea.definition.rawProperties.modified.default =
	    PlaceArea.definition.properties.modified.default = function() {
	    return new Date();
	  };

};
