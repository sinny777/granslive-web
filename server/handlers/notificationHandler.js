module.exports = function(app) {

	var commonHandler = require('../../server/handlers/commonHandler')();
	var emailHandler = require('../../server/handlers/emailHandler')();
	var gcm = require('node-gcm');

	var methods = {};

	methods.sendNotification = function(payload, board, placeArea, device) {
		var pushMsg = placeArea.title +"'s " + device.title + " status is changed to " + device.status +" at " +new Date();
		var pushData = {
				boardId : payload.d.boardId,
				deviceIndex : payload.d.deviceIndex,
				deviceValue : payload.d.deviceValue,
				style : "picture",
				picture : "http://wallpapercave.com/wp/3Ma6LaY.jpg"
			};
		//TODO get RegistrationIds for sending Notification
		var registrationIds = ["lToS_pqhEgI:APA91bFZ7dzViDni82vZvI0wob9ur1Ug1mCCWH3EE1x17jUIMZZQ53wtG_9zaWgRlGqQqbYXEOc-C72MGuFFVrCfD3PfF29wmqUHGF6Pksfo-gNcwgtam4R1X9sQrRsQCxaTHZyno1Xx"];
		methods.sendPushNotification(pushData, pushMsg, registrationIds);
	};

	methods.sendPushNotification = function(pushData, pushMsg, registrationIds) {
		console.log('IN notificationHandler.sendPushNotification: >> ', pushMsg);
		var apiKey = "AIzaSyD_dNyMIgJxxY82yjokjNPUdNCLVWQuzM8";
		var service = new gcm.Sender(apiKey);
		var message = new gcm.Message({
			priority : "high",
			sound : "default"
		});
		message.contentAvailable = true;
		message.delayWhileIdle = true;
		message.timeToLive = 3;
		message.dryRun = true;

		message.addData(pushData);

		message.addNotification({
			title : "GransLive Notification",
			icon : "ic_launcher",
			body : pushMsg,
			priority : 2
		});

		service.send(message, {
			registrationTokens : registrationIds
		}, function(err, response) {
			if (err)
				console.error(err);
			else
				console.log(response);
		});
	};

	return methods;

}