
/**
 * Make sure app is provided while instantiating this class and calling any method
 */
module.exports = function(app) {
	
	var notificationHandler = require('../../server/handlers/notificationHandler')(app);
	var Device;
	var Board;
	var PlaceArea;
    
var methods = {};

	methods.handleDeviceEvent = function(deviceType, deviceId, eventType,
			format, payload){
		console.log('\n\nIN deviceHandler.handleDeviceEvent with payload: >>>> ', payload);
		try {
			var jsonPayload = JSON.parse(payload);
			methods.handleDevicePayload(jsonPayload);
		} catch (err) {
			// TODO: Handle Invalid Payload
		}
	};
	
	methods.deviceChangeTrigger = function(payload){
		console.log("IN deviceHandler.deviceChangeTrigger: >>> ", payload);
		var msg = {};
		if(payload && payload.message){
			try{
				msg = JSON.parse(payload.message);
				methods.handleDevicePayload(msg);
			}catch(err){
				console.log('ERROR in Parsing Payload Message: >> ', err );
				msg = payload.message;
			}
		}
	};
	
	methods.sensorDataTrigger = function(payload){
		console.log("IN deviceHandler.sensorDataTrigger: >>> ", payload);
		var msg = {};
		if(payload && payload.message){
			try{
				msg = JSON.parse(payload.message);
				methods.handleDevicePayload(msg);
			}catch(err){
				console.log('ERROR in Parsing Payload Message: >> ', err );
				msg = payload.message;
			}
		}
	};
	
	methods.handleDevicePayload = function(payload){
		console.log('IN deviceHandler.handleDevicePayload with payload: >>>> ', payload);
		if(payload.d.boardId){
			if(payload.d.gatewayId){
				methods.findBoard(payload.d.boardId, payload.d.gatewayId, function(err, boards) { 
					if(err){
						console.log("ERROR IN finding Board with uniqueIdentifier: ", payload.d.boardId, err);
					}else{
						if(boards && boards.length > 0){
							var board = boards[0];
							console.log("RESP FROM FIND BOARD: >>> ", board.title);
							methods.findPlaceArea(board.placeAreaId, function(err, placeArea) { 
								if(err){
									console.log("ERROR IN finding PlaceArea with ID: ", board.placeAreaId, err);
								}else{
									console.log("RESP FROM FIND PLACEAREA: >>> ", placeArea.title);
									if(placeArea){
										methods.saveDeviceData(payload, board, placeArea);
									}
								}
							});
						}else{
							console.log("NO BOARDS FOUND FOR PAYLOAD: ", payload);
						}						
					}
				});
			}
		}
	};
	
	methods.findBoard = function(boardId, gatewayId, cb){
		try{
			if(boardId){
				if(gatewayId){
					var findReq =  {where: {"uniqueIdentifier": boardId}};
					console.log('IN findBoard, with boardId: ', boardId, ", gatewayId: ", gatewayId, ', findReq: ', findReq);
					if(!Board){
						Board = app.models.Board;
					}
					Board.find(findReq, function(err, resp) { 
						cb(err, resp);
					});
				}else{
					cb("gatewayId can not be null", null);
				}
			}else{
				cb("boardId can not be null", null);
			}
		}catch(err){
			console.log(err);
			cb("Some Error in findBoard: " +err, null);
		}
	};
	
	methods.findPlaceArea = function(placeAreaId, cb){
		console.log('IN findPlaceArea with placeAreaId: ', placeAreaId);
		if(!PlaceArea){
			PlaceArea = app.models.PlaceArea;
		}
		PlaceArea.findById(placeAreaId, function(err, resp) { 
			cb(err, resp);
		});
	};
	
	methods.saveDeviceData = function(payload, board, placeArea){
		for (i = 0; i < board.devices.length; i++) {
		    var device = board.devices[i];
		    if(device.deviceIndex == payload.d.deviceIndex){
		    	board.devices[i].value = payload.d.deviceValue;
		    	
		    	if(payload.d.deviceValue == 1){
		    		board.devices[i].status = "ON";
		    	}else{
		    		board.devices[i].status = "OFF";
		    	}
		    	
		    	if(payload.d.analogValue){
		    		board.devices[i].analogValue = payload.d.analogValue;
		    	}
		    	
		    	Board.upsert(board, function(err, updatedBoard){
		    		if(err){
		    			console.log("ERROR IN UPDATING BOARD: >> ", err);
		    		}else{
		    			console.log("<<<< BOARD DEVICE UPDATED SUCCESSFULLY >>>>>>> ", board.devices[i]);
		    		}
		    	});
		    	notificationHandler.sendNotification(payload, board, placeArea, board.devices[i]);
		    	break;
		    }
		}
		
	};
	
    return methods;
    
}