'use strict';

var log = require('debug')('boot:01-startup-script');

var Client = require('ibmiotf');

var appClient = {};

module.exports = function(app) {

	if (app.dataSources.db.name !== 'Memory' && !process.env.INITDB) {
		return;
	}

	var appConfig = require('../../common/config/config').get();
	var deviceHandler = require('../../server/handlers/deviceHandler')(app);
	var commonHandler = require('../../server/handlers/commonHandler')();

//	initStartupLogic();
	
//	saveAndExecuteScenes();
	
	function saveAndExecuteScenes(){
		console.log("IN saveAndExecuteScenes: >>> ");
		var Scene = app.models.Scene;
		
		var waterTankScene = {
				title: "WaterTank",
				description: "Switch on motor for filling Water tank",
				placeId: "7760aef8d92a4dbd63939b5bd4cd0cfa",
				repeat: true,
				type: "TIME",
				settings: {
					startTime: "06:05:00",
					endTime: "07:05:00",
					"Monday": true,
					"Tuesday": false,
					"Wednesday": true,
					"Thursday": false,
					"Friday": true,
					"Saturday": true,
					"Sunday": true,
				},
				devices: [
				          {boardId: "SB-B1379", deviceIndex: 4, deviceValue: 1}
				          ]
		};
		
		Scene.findOrCreate(
	              {where: {title: waterTankScene.title}}, 
	              waterTankScene, // create
	              function(err, createdScene, created) {
	                if (err) {
	                  console.error('error creating waterTankScene', err);
	                }
	                (created) ? console.log('CREATED SCENE ::>> ', createdScene)
	                          : console.log('FOUND SCENE ::>> ', createdScene.title);
	                scheduleScene(createdScene);
	              });
	};
	
	function scheduleScene(scene){
		if(!scene.id){
			return false;
		}
		if(scene.type == "TIME"){
			console.log("Scene is of TIME Type and settings are: ", scene.settings);
			var secDiff = commonHandler.timeDifferenceFromStr(scene.settings.startTime);
			if(secDiff > 0){
				console.log("<<<<< Schedule Scene after >>>>>>> ", secDiff, " seconds or ", secDiff/60, " minutes");
				setTimeout(function() {
					console.log(" EXECUTING SCENE AT: ", new Date(), ", SCENE: ", scene.title);
				}, (secDiff * 1000));
			}else{
				console.log("Dont Schedule >>>>> ", secDiff/60, " minutes already passed");
			}			
		}
	};

	function initStartupLogic() {
		
		var iotConfig = appConfig.CLOUD_CONFIG;
		var clientId = parseInt(Math.random() * 100, 10);
		iotConfig.id = iotConfig.id + clientId;
		appClient = new Client.IotfApplication(iotConfig);
		appClient.connect();
		appClient
				.on(
						"connect",
						function() {
							console
									.log('<<<<<<< IBM IoT Cloud Connected Successfully >>>>>> \n\n');
							subscribeToGateway();
						});

		appClient.on("deviceEvent", function(deviceType, deviceId, eventType,
				format, payload) {
			console.log("Device Event from :: " + deviceType + " : " + deviceId
					+ " of event " + eventType + " with payload : " + payload);
			var payloadStr =  payload.toString('utf8');
			handleDeviceEvent(deviceType, deviceId, eventType,
					format, payloadStr);
		});
	};

	function subscribeToGateway() {
		appClient.subscribeToDeviceEvents("GransLiveGateway", "+", "+", "json");
	};

	function handleDeviceEvent(deviceType, deviceId, eventType,
			format, payload) {
		deviceHandler.handleDeviceEvent(deviceType, deviceId, eventType,
				format, payload);
	};

};
