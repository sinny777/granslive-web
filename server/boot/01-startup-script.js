'use strict';

var log = require('debug')('boot:01-startup-script');

var Client = require('ibmiotf');
var gcm = require('node-gcm');

var appClient = {};

module.exports = function(app) {

  if (app.dataSources.db.name !== 'Memory' && !process.env.INITDB) {
    return;
  }
  
  var appConfig = require('../../common/config/config').get();

  initStartupLogic();

  function initStartupLogic() {
	  appClient = new Client.IotfApplication(appConfig.CLOUD_CONFIG);
      appClient.connect();
      appClient.on("connect", function () {
      	console.log('<<<<<<< IBM IoT Cloud Connected Successfully >>>>>> \n\n');
      	subscribeToGateway();
      });
      
      appClient.on("deviceEvent", function (deviceType, deviceId, eventType, format, payload) {
    	    console.log("Device Event from :: "+deviceType+" : "+deviceId+" of event "+eventType+" with payload : "+payload);
    	    try{
    	    	 var jsonPayload = JSON.parse(payload);
    	    	 sendPushNotification(jsonPayload);
    	    }catch(err){
    	    	sendPushNotification({d:{}});
    	    }
    	});
  };
  
  function subscribeToGateway(){
		appClient.subscribeToDeviceEvents("GransLiveGateway", "+","+","json");
	};
	
  function sendPushNotification(payload){
	  var apiKey = "AIzaSyD_dNyMIgJxxY82yjokjNPUdNCLVWQuzM8";
	  var registrationIds = [];
	  registrationIds.push("mGOOYbYbmz4:APA91bGEkm-sHg20CVVhPltdeGWe5Zlvz6BrKBXn-MaajEqPejemm8dG0wHd_x6fCERYgHLvu6bmEa32KXvoIdO3ISrmz_HIZXeO2PuRleDl8kVkjRmAQh465BnftGHloTcTwEGgqrnB");
	  var service = new gcm.Sender(apiKey);
	  
	  var message = new gcm.Message({priority: "high", sound: "default"});
	  message.contentAvailable = true;
	  message.delayWhileIdle = true;
	  message.timeToLive = 3;
	  message.dryRun = true;
	  
	  message.addData({
		   boardId: payload.d.boardId,
	       deviceIndex: payload.d.deviceIndex,
	       deviceValue: payload.d.deviceValue,
	       style: "picture",
	       picture: "http://wallpapercave.com/wp/3Ma6LaY.jpg"
	  });
	  
	  message.addNotification({
		        title: "GransLive Notification",
		        icon: "ic_launcher",
		        body: "This is a notification that will be displayed ASAP.",
		        priority: 2
		    });
	  
	  service.send(message, { registrationTokens: registrationIds }, function (err, response) {
	      if(err) console.error(err);
	      else    console.log(response);
	  });
  }

};
